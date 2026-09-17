"use client";
import { usePathname } from "next/navigation";
import ClientLayout from "@/components/ClientLayout";
import Header from "@/components/layout/Header";
import OffcanvasSidebar from "@/components/layout/OffcanvasSidebar";
import SearchOverlay from "@/components/layout/SearchOverlay";

export default function SiteFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return <>{children}</>;
  if (["/", "/about", "/contact", "/privacy", "/terms"].includes(pathname)) {
    return <ClientLayout>{children}</ClientLayout>;
  }
  return <ClientLayout><OffcanvasSidebar /><Header /><SearchOverlay />{children}</ClientLayout>;
}
