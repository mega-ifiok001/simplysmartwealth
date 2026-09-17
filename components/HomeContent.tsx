import Link from "next/link";
import { prisma } from "@/lib/db";
import { getSiteSettings } from "@/lib/settings";
import { pageNumber } from "@/lib/pagination";
import PublicPage from "@/components/PublicPage";
import ArticleGrid from "@/components/ArticleGrid";
export default async function HomeContent({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const settings = await getSiteSettings();
  const page = pageNumber((await searchParams).page);
  const where = { status: "PUBLISHED" as const, publishedAt: { lte: new Date() } };
  const select = { id: true, slug: true, title: true, excerpt: true, coverUrl: true, coverAlt: true } as const;
  const [posts, total, featured] = process.env.DATABASE_URL ? await Promise.all([
    prisma.post.findMany({ where, orderBy: [{ publishedAt: "desc" }, { id: "asc" }], skip: (page - 1) * 12, take: 12, select }),
    prisma.post.count({ where }),
    page === 1 ? prisma.post.findMany({ where: { ...where, featured: true }, orderBy: [{ publishedAt: "desc" }, { id: "asc" }], take: 3, select }) : Promise.resolve([]),
  ]) : [[], 0, []];
  return <PublicPage><main id="main-content" className="container pt-50 pb-50">
    <section className="mb-50"><h1 className="mb-20">{settings.hero_heading || settings.site_name}</h1><p className="font-large">{settings.hero_subheading || settings.site_tagline}</p></section>
    {featured.length > 0 && <section aria-labelledby="featured-heading"><h2 id="featured-heading" className="mb-30">Featured articles</h2><ArticleGrid posts={featured} /></section>}
    <section aria-labelledby="articles-heading"><h2 id="articles-heading" className="mb-30">Latest articles</h2>
      {!posts.length && <p>{process.env.DATABASE_URL ? "No articles on this page yet." : "Publishing will be available once the database is configured."}</p>}
      <ArticleGrid posts={posts} />
      <nav aria-label="Article pages" className="d-flex" style={{ gap: 20 }}>
        {page > 1 && <Link href={page === 2 ? "/" : `/?page=${page - 1}`}>Previous</Link>}
        <span>Page {page} of {Math.max(1, Math.ceil(total / 12))}</span>
        {page * 12 < total && <Link href={`/?page=${page + 1}`}>Next</Link>}
      </nav>
    </section></main></PublicPage>;
}
