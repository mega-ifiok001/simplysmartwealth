import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function PublishedPosts() {
  if (!process.env.DATABASE_URL) return <section className="container pt-50 pb-50"><h2>Latest articles</h2><p>Publishing will be available once the database is configured.</p></section>;
  const posts = await prisma.post.findMany({
    where: { status: "PUBLISHED", publishedAt: { lte: new Date() } },
    orderBy: { publishedAt: "desc" }, take: 12,
    select: { id: true, title: true, slug: true, excerpt: true, coverUrl: true, coverAlt: true },
  });
  return <section className="container pt-50 pb-50"><h2 className="mb-30">Latest articles</h2>
    {!posts.length && <p>No articles have been published yet.</p>}
    <div className="row">{posts.map(post => <article key={post.id} className="col-md-6 col-lg-4 mb-30">
      {post.coverUrl && <Link href={`/posts/${post.slug}`}><img src={post.coverUrl} alt={post.coverAlt} className="border-radius-10 mb-20" style={{ width: "100%", height: 220, objectFit: "cover" }} /></Link>}
      <h3 className="mb-15"><Link href={`/posts/${post.slug}`}>{post.title}</Link></h3><p>{post.excerpt}</p>
    </article>)}</div>
  </section>;
}
