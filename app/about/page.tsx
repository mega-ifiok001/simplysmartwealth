import { getSiteSettings } from "@/lib/settings";
export const dynamic = "force-dynamic";
export async function generateMetadata() {
  const settings = await getSiteSettings();
  return { title: "About | " + settings.site_name, description: settings.site_tagline };
}
export { default } from "@/components/AboutContent";
