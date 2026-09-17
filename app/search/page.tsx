import Link from "next/link";
import { prisma } from "@/lib/db";
import Footer from "@/components/layout/Footer";
export const dynamic = "force-dynamic";
export const metadata = { title: "Search | Simply Smart Wealth" };
export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const query = ((await searchParams).q ?? "").trim().slice(0, 100);
  let results: Array<{ id: string; title: string; slug: string; excerpt: string }> = [];
  if (process.env.DATABASE_URL && query) {
    // Only published, already-released posts are searchable.
    results = await prisma.post.findMany({
      where: { status: "PUBLISHED", publishedAt: { lte: new Date() }, OR: [
        { title: { contains: query, mode: "insensitive" } },
        { excerpt: { contains: query, mode: "insensitive" } },
      ] },
      orderBy: { publishedAt: "desc" }, take: 30,
      select: { id: true, title: true, slug: true, excerpt: true },
    });
  }
  return <><main className="container pt-50 pb-50" style={{ maxWidth: 900 }}>
    <h1 className="mb-30">Search</h1>
    <form action="/search" method="get" className="mb-30" role="search">
      <input type="search" name="q" defaultValue={query} maxLength={100} placeholder="Search published articles" aria-label="Search query" style={{ padding: 12, width: "70%", maxWidth: 420 }} />
      <button type="submit" className="btn bg-primary text-white ml-10">Search</button>
    </form>
    {query && <p className="text-muted">{results.length} result{results.length === 1 ? "" : "s"} for “{query}”</p>}
    {results.map(post => <article key={post.id} className="mb-40">
      <h2 className="mb-10"><Link href={`/posts/${post.slug}`}>{post.title}</Link></h2>
      <p>{post.excerpt}</p>
    </article>)}
    {query && !results.length && <p>No published articles matched your search.</p>}
  </main><Footer variant="default" /></>;
}
