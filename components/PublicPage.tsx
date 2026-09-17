import Link from "next/link";
import { getSiteSettings } from "@/lib/settings";
import PublicFooter from "@/components/PublicFooter";
export default async function PublicPage({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();
  return <><a className="sr-only sr-only-focusable" href="#main-content">Skip to content</a>
    <header className="container pt-30 pb-30 border-bottom">
      <Link href="/" className="font-large font-weight-900">{settings.site_name}</Link>
      <nav aria-label="Main navigation" className="mt-20 d-flex flex-wrap" style={{ gap: 20 }}>
        <Link href="/">Articles</Link><Link href="/categories">Categories</Link>
        <Link href="/about">About</Link><Link href="/contact">Contact</Link>
      </nav>
      <form action="/search" method="get" className="mt-20 d-flex" role="search">
        <label htmlFor="public-search" className="sr-only">Search articles</label>
        <input id="public-search" name="q" type="search" maxLength={100} placeholder="Search articles" className="form-control" />
        <button type="submit" className="button ml-10">Search</button>
      </form>
    </header>{children}<PublicFooter /></>;
}
