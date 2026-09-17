import PublicPage from "@/components/PublicPage";
import { getSiteSettings } from "@/lib/settings";
export const dynamic = "force-dynamic";
export async function generateMetadata() {
  const settings = await getSiteSettings();
  return { title: `Terms | ${settings.site_name}`, robots: settings.terms_content ? undefined : { index: false } };
}
export default async function TermsPage() {
  const settings = await getSiteSettings();
  return <PublicPage><main id="main-content" className="container pt-50 pb-50" style={{ maxWidth: 900 }}>
    <h1 className="mb-30">Terms of use</h1>
    <div style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere", lineHeight: 1.9 }}>{settings.terms_content || "The site owner has not published terms of use yet. Please contact us with any questions."}</div>
  </main></PublicPage>;
}
