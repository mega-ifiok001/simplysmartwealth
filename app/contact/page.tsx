import { getSiteSettings } from "@/lib/settings";
export const dynamic = "force-dynamic";
export async function generateMetadata() {
  const settings = await getSiteSettings();
  return { title: "Contact | " + settings.site_name, description: settings.site_tagline };
}
export { default } from "@/components/ContactContent";
