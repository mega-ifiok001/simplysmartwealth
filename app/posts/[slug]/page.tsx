import { cache } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import Footer from "@/components/layout/Footer";
import CommentForm from "@/components/CommentForm";
export const dynamic = "force-dynamic";
const getPost = cache(async (slug: string) => {
  if (!process.env.DATABASE_URL) return null;
  return prisma.post.findFirst({ where: { slug, status: "PUBLISHED", publishedAt: { lte: new Date() } },
    include: { author: { select: { name: true } },
      comments: { where: { approved: true }, orderBy: { createdAt: "desc" }, take: 50,
        select: { id: true, authorName: true, content: true, createdAt: true } } } });
});
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const post = await getPost((await params).slug);
  return post ? { title: post.title, description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, type: "article", images: post.coverUrl ? [post.coverUrl] : [] } }
    : { title: "Article not found" };
}
export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const post = await getPost((await params).slug);
  if (!post) notFound();
  return <><main className="container pt-50 pb-50" style={{ maxWidth: 900 }}>
    <Link href="/">← All articles</Link><article>
      <h1 className="mt-30 mb-20">{post.title}</h1>
      <p>{post.author.name} · <time dateTime={post.publishedAt!.toISOString()}>{post.publishedAt!.toISOString().slice(0, 10)}</time></p>
      <p className="font-large">{post.excerpt}</p>
      {post.coverUrl && <img src={post.coverUrl} alt={post.coverAlt} className="border-radius-10 mb-30" style={{ width: "100%" }} />}
      <div style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere", lineHeight: 1.9 }}>{post.content}</div>
    </article>
    <section className="mt-50">
      <h2 className="mb-20">Comments ({post.comments.length})</h2>
      {!post.comments.length && <p className="text-muted">No comments yet. Start the conversation.</p>}
      {post.comments.map(comment => <article key={comment.id} className="mb-20 pb-20" style={{ borderBottom: "1px solid #eee" }}>
        <p className="mb-10"><strong>{comment.authorName}</strong> <span className="text-muted font-small">{comment.createdAt.toISOString().slice(0, 10)}</span></p>
        <p style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{comment.content}</p>
      </article>)}
      <CommentForm postId={post.id} />
    </section>
    </main><Footer variant="default" /></>;
}
