"use client";
import { usePathname } from "next/navigation";
import ClientLayout from "@/components/ClientLayout";
import Header from "@/components/layout/Header";
import OffcanvasSidebar from "@/components/layout/OffcanvasSidebar";
import SearchOverlay from "@/components/layout/SearchOverlay";

export default function SiteFrame({ children, siteName }: { children: React.ReactNode; siteName?: string }) {
  const pathname = usePathname();
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return <>{children}</>;
  // Every public page shares the full magazine frame: sticky header,
  // off-canvas menu, and the search overlay.
  return (
    <ClientLayout>
      <OffcanvasSidebar />
      <Header siteName={siteName} />
      <SearchOverlay />
      {children}
    </ClientLayout>
  );
}
