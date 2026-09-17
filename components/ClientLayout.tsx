"use client";

import {
  createContext, useCallback, useContext, useEffect, useState,
} from "react";

type UIContextValue = {
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (v: boolean) => void;
  scrolled: boolean;
};

const UIContext = createContext<UIContextValue>({
  sidebarOpen: false,
  setSidebarOpen: () => {},
  searchOpen: false,
  setSearchOpen: () => {},
  scrolled: false,
});

export function useUI() {
  return useContext(UIContext);
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // restore dark mode (also applied pre-paint by the inline theme script)
    if (localStorage.getItem("theme") === "dark") {
      document.body.classList.add("dark");
    }
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? (window.scrollY / max) * 100 : 0);
      setScrolled(window.scrollY > 245);
      setShowTop(window.scrollY > 300);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <UIContext.Provider
      value={{ sidebarOpen, setSidebarOpen, searchOpen, setSearchOpen, scrolled }}
    >
      <div className={mounted ? "preloader text-center preloader-hide" : "preloader text-center"}>
        <div className="circle"></div>
      </div>
      <div className="scroll-progress primary-bg" style={{ width: `${progress}%` }} />
      {children}
      <div
        className="dark-mark"
        onClick={() => setSidebarOpen(false)}
        style={
          sidebarOpen
            ? { opacity: 1, visibility: "visible" }
            : undefined
        }
      />
      <button
        type="button"
        id="scrollUp"
        onClick={scrollTop}
        style={{ display: showTop ? "block" : "none" }}
        aria-label="Scroll to top"
      >
        <i className="elegant-icon arrow_up"></i>
      </button>
    </UIContext.Provider>
  );
}
