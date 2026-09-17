import PublicPage from "@/components/PublicPage";
import { getSiteSettings } from "@/lib/settings";
export default async function AboutContent() {
  const settings = await getSiteSettings();
  return <PublicPage><main id="main-content" className="container pt-50 pb-50" style={{ maxWidth: 900 }}>
    <h1 className="mb-30">{settings.about_title}</h1>
    <div style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere", lineHeight: 1.9 }}>{settings.about_content || settings.site_tagline}</div>
  </main></PublicPage>;
}
