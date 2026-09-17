import Link from "next/link";
import { getSiteSettings } from "@/lib/settings";
export default async function PublicFooter() {
  const settings = await getSiteSettings();
  return <footer className="container pt-30 pb-30 border-top"><p>{settings.footer_text}</p>
    <nav aria-label="Footer"><Link href="/about">About</Link>{" · "}<Link href="/contact">Contact</Link>{" · "}
      <Link href="/privacy">Privacy</Link>{" · "}<Link href="/terms">Terms</Link></nav>
    <div className="mt-15">{(["twitter", "instagram", "youtube", "linkedin"] as const).map(name => {
      const value = settings[`social_${name}`];
      try { const url = new URL(value); if (url.protocol !== "https:" || url.username || url.password) return null; }
      catch { return null; }
      return <a key={name} href={value} rel="noopener noreferrer" className="mr-15">{name}</a>;
    })}</div>
  </footer>;
}
