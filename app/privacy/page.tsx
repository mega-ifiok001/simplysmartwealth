import PublicPage from "@/components/PublicPage";
import { getSiteSettings } from "@/lib/settings";
export const dynamic = "force-dynamic";
export async function generateMetadata() {
  const settings = await getSiteSettings();
  return { title: `Privacy | ${settings.site_name}`, robots: settings.privacy_content ? undefined : { index: false } };
}
export default async function PrivacyPage() {
  const settings = await getSiteSettings();
  return <PublicPage><main id="main-content" className="container pt-50 pb-50" style={{ maxWidth: 900 }}>
    <h1 className="mb-30">Privacy policy</h1>
    <div style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere", lineHeight: 1.9 }}>{settings.privacy_content || "The site owner has not published a privacy policy yet. Please contact us with any privacy questions."}</div>
  </main></PublicPage>;
}
