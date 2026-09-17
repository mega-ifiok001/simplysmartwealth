"use client";

import { useEffect } from "react";

/**
 * Reimplements the interactions of the original template's main.js
 * (originally jQuery + slick + masonry + WOW) in vanilla TypeScript:
 *  - fade sliders (slide-fade / featured-slider-3) with arrows
 *  - featured-slider-2 with synced vertical thumb navigation
 *  - masonry grid (.grid) via CSS columns
 *  - hero typewriter effect (.typewrite)
 *  - "more articles" popup on scroll
 */
export default function Behaviors() {
  useEffect(() => {
    const cleanups: Array<() => void> = [];

    /* ------------------------------------------------ fade sliders */
    const initFadeSlider = (container: HTMLElement, arrowHost: HTMLElement | null) => {
      if (container.dataset.sliderInit) return;
      container.dataset.sliderInit = "1";
      cleanups.push(() => { delete container.dataset.sliderInit; });
      const slides = Array.from(container.children) as HTMLElement[];
      if (slides.length === 0) return;
      let index = 0;

      const show = (next: number) => {
        index = (next + slides.length) % slides.length;
        slides.forEach((slide, i) => {
          const active = i === index;
          slide.style.display = active ? "block" : "none";
          slide.classList.remove("animated", "fadeIn");
          if (active) slide.classList.add("animated", "fadeIn");
        });
      };

      if (arrowHost && slides.length > 1) {
        const prev = document.createElement("button");
        prev.type = "button";
        prev.className = "slick-prev";
        prev.setAttribute("aria-label", "Previous slide");
        prev.innerHTML = '<i class="elegant-icon arrow_left"></i>';
        const next = document.createElement("button");
        next.type = "button";
        next.className = "slick-next";
        next.setAttribute("aria-label", "Next slide");
        next.innerHTML = '<i class="elegant-icon arrow_right"></i>';
        prev.addEventListener("click", () => show(index - 1));
        next.addEventListener("click", () => show(index + 1));
        arrowHost.appendChild(prev);
        arrowHost.appendChild(next);
        cleanups.push(() => {
          prev.remove();
          next.remove();
        });
      }

      show(0);
    };

    document.querySelectorAll<HTMLElement>(".slide-fade").forEach((el) => {
      const host = el.closest(".carausel-post-1")?.querySelector<HTMLElement>(".arrow-cover") ?? null;
      initFadeSlider(el, host);
    });

    document.querySelectorAll<HTMLElement>(".featured-slider-3-items").forEach((el) => {
      const host =
        el.closest(".featured-slider-3")?.querySelector<HTMLElement>(".slider-3-arrow-cover") ?? null;
      initFadeSlider(el, host);
    });

    /* ------------------------------------- featured slider 2 (nav) */
    document.querySelectorAll<HTMLElement>(".featured-slider-2-items").forEach((items) => {
      if (items.dataset.sliderInit) return;
      items.dataset.sliderInit = "1";
      cleanups.push(() => { delete items.dataset.sliderInit; });
      const root = items.closest(".featured-slider-2");
      const nav = root?.querySelector<HTMLElement>(".featured-slider-2-nav");
      const slides = Array.from(items.children) as HTMLElement[];
      const navItems = nav ? (Array.from(nav.children) as HTMLElement[]) : [];
      let index = 0;

      const show = (next: number) => {
        index = (next + slides.length) % slides.length;
        slides.forEach((slide, i) => {
          const active = i === index;
          slide.style.display = active ? "block" : "none";
          slide.classList.remove("animated", "fadeIn");
          if (active) slide.classList.add("animated", "fadeIn");
        });
        navItems.forEach((item, i) => item.classList.toggle("slick-current", i === index));
      };

      navItems.forEach((item, i) => {
        const handler = () => show(i);
        item.addEventListener("click", handler);
        cleanups.push(() => item.removeEventListener("click", handler));
      });
      show(0);
    });

    /* -------------------------------------------------- typewriter */
    const wrapStyle = document.createElement("style");
    wrapStyle.innerHTML = ".typewrite > .wrap { border-right: 0.05em solid #5869DA }";
    document.body.appendChild(wrapStyle);
    cleanups.push(() => wrapStyle.remove());

    const timers: Array<ReturnType<typeof setTimeout>> = [];
    document.querySelectorAll<HTMLElement>(".typewrite").forEach((el) => {
      const raw = el.dataset.type;
      if (!raw) return;
      let phrases: string[];
      try {
        phrases = JSON.parse(raw);
      } catch {
        return;
      }
      const period = parseInt(el.dataset.period || "2000", 10);
      let loop = 0;
      let txt = "";
      let deleting = false;

      const tick = () => {
        const full = phrases[loop % phrases.length];
        txt = deleting ? full.substring(0, txt.length - 1) : full.substring(0, txt.length + 1);
        el.innerHTML = `<span class="wrap">${txt}</span>`;
        let delta = 200 - Math.random() * 100;
        if (deleting) delta /= 2;
        if (!deleting && txt === full) {
          delta = period;
          deleting = true;
        } else if (deleting && txt === "") {
          deleting = false;
          loop++;
          delta = 500;
        }
        timers.push(setTimeout(tick, delta));
      };
      tick();
    });
    cleanups.push(() => timers.forEach(clearTimeout));

    /* ------------------------------------------------------ masonry */
    document.querySelectorAll<HTMLElement>(".grid").forEach((grid) => {
      if (grid.dataset.masonryInit) return;
      grid.dataset.masonryInit = "1";
      const apply = () => {
        const w = grid.offsetWidth;
        const cols = w < 576 ? 1 : w < 768 ? 2 : 3;
        grid.style.columnCount = String(cols);
        grid.style.columnGap = "30px";
        Array.from(grid.children).forEach((child) => {
          const item = child as HTMLElement;
          if (item.classList.contains("grid-sizer")) {
            item.style.display = "none";
            return;
          }
          item.style.width = "100%";
          item.style.float = "none";
          item.style.display = "inline-block";
          item.style.marginBottom = "30px";
        });
      };
      apply();
      window.addEventListener("resize", apply);
      cleanups.push(() => window.removeEventListener("resize", apply));
    });

    /* --------------------------------------------- more-articles box */
    const box = document.querySelector<HTMLElement>(".single-more-articles");
    if (box) {
      const closeBtn = box.querySelector(".single-more-articles-close");
      const onScroll = () => {
        if (box.dataset.closed === "1") return;
        const doc = document.documentElement;
        const max = doc.scrollHeight - window.innerHeight;
        box.classList.toggle(
          "single-more-articles--visible",
          max > 0 && window.scrollY > max * 0.55
        );
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
      const onClose = () => {
        box.dataset.closed = "1";
        box.classList.remove("single-more-articles--visible");
      };
      closeBtn?.addEventListener("click", onClose);
      cleanups.push(() => {
        window.removeEventListener("scroll", onScroll);
        closeBtn?.removeEventListener("click", onClose);
      });
    }

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return null;
}
