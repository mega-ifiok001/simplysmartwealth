import Link from "next/link";
export type ArticleSummary = { id: string; slug: string; title: string; excerpt: string; coverUrl: string | null; coverAlt: string };
export default function ArticleGrid({ posts }: { posts: ArticleSummary[] }) {
  return <div className="row">{posts.map(post => <article key={post.id} className="col-md-6 col-lg-4 mb-30">
    {post.coverUrl && <Link href={`/posts/${post.slug}`} aria-label={post.title}><img src={post.coverUrl} alt={post.coverAlt} loading="lazy" className="border-radius-10 mb-20" style={{ width: "100%", height: 220, objectFit: "cover" }} /></Link>}
    <h3 className="mb-15"><Link href={`/posts/${post.slug}`}>{post.title}</Link></h3><p>{post.excerpt}</p>
  </article>)}</div>;
}
