import Footer from "@/components/layout/Footer";

/**
 * Shared wrapper for the dynamic, database-backed public pages. The themed
 * site header/search/off-canvas come from SiteFrame; this component adds the
 * accessibility skip link and the magazine footer.
 */
export default function PublicPage({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a className="sr-only sr-only-focusable" href="#main-content">Skip to content</a>
      {children}
      <Footer variant="default" />
    </>
  );
}
