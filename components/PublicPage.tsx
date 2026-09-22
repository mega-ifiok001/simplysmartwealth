import Footer from "@/components/layout/Footer";

/**
 * Shared wrapper for the dynamic, database-backed public pages. The themed
 * site header/search/off-canvas come from SiteFrame; this component adds the
 * magazine footer.
 */
export default function PublicPage({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Footer variant="default" />
    </>
  );
}
