export const settingFields = {
  site_name: { label: "Site name", max: 100, fallback: "Simply Smart Wealth" },
  site_tagline: { label: "Site description", max: 300, fallback: "Practical ideas for a smarter financial future." },
  hero_heading: { label: "Homepage heading", max: 180, fallback: "Build your financial knowledge" },
  hero_subheading: { label: "Homepage introduction", max: 1000, fallback: "Explore our latest articles and guides." },
  footer_text: { label: "Footer text", max: 500, fallback: "Simply Smart Wealth" },
  about_title: { label: "About page title", max: 180, fallback: "About Simply Smart Wealth" },
  about_content: { label: "About page content", max: 20000, fallback: "" },
  contact_email: { label: "Public contact email", max: 254, fallback: "" },
  social_twitter: { label: "X / Twitter URL", max: 500, fallback: "" },
  social_instagram: { label: "Instagram URL", max: 500, fallback: "" },
  social_youtube: { label: "YouTube URL", max: 500, fallback: "" },
  social_linkedin: { label: "LinkedIn URL", max: 500, fallback: "" },
  privacy_content: { label: "Privacy policy (review before publishing)", max: 30000, fallback: "" },
  terms_content: { label: "Terms of use (review before publishing)", max: 30000, fallback: "" },
} as const;
export type SettingKey = keyof typeof settingFields;
export type SiteSettings = Record<SettingKey, string>;
export const defaultSettings = Object.fromEntries(Object.entries(settingFields).map(([key, field]) => [key, field.fallback])) as SiteSettings;
export function validateSettings(data: FormData): SiteSettings {
  const values = {} as SiteSettings;
  for (const key of Object.keys(settingFields) as SettingKey[]) {
    const raw = data.get(key);
    if (typeof raw !== "string") throw new Error(`${settingFields[key].label} is required.`);
    const value = raw.trim();
    if (value.length > settingFields[key].max) throw new Error(`${settingFields[key].label} is too long.`);
    if ((key === "site_name" || key === "site_tagline") && !value) throw new Error(`${settingFields[key].label} cannot be empty.`);
    if (key === "contact_email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) throw new Error("Enter a valid contact email.");
    if (key.startsWith("social_") && value) {
      let url: URL;
      try { url = new URL(value); } catch { throw new Error("Social links must be full HTTPS URLs."); }
      if (url.protocol !== "https:" || url.username || url.password) throw new Error("Social links must be HTTPS URLs without credentials.");
    }
    values[key] = value;
  }
  return values;
}
