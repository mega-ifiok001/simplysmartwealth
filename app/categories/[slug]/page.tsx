import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import Footer from "@/components/layout/Footer";
export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const category = process.env.DATABASE_URL
    ? await prisma.category.findUnique({ where: { slug: (await params).slug }, select: { name: true, description: true } })
    : null;
  return category ? { title: `${category.name} | Simply Smart Wealth`, description: category.description || undefined }
    : { title: "Category not found" };
}
export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  if (!process.env.DATABASE_URL) notFound();
  const category = await prisma.category.findUnique({
    where: { slug: (await params).slug },
    select: { id: true, name: true, description: true,
      posts: { where: { post: { status: "PUBLISHED", publishedAt: { lte: new Date() } } },
        orderBy: { post: { publishedAt: "desc" } }, take: 50,
        select: { post: { select: { id: true, title: true, slug: true, excerpt: true, coverUrl: true, coverAlt: true, publishedAt: true } } } } },
  });
  if (!category) notFound();
  return <><main className="container pt-50 pb-50" style={{ maxWidth: 900 }}>
    <Link href="/categories">← All categories</Link>
    <h1 className="mt-30 mb-20">{category.name}</h1>
    {category.description && <p className="text-muted mb-30">{category.description}</p>}
    {!category.posts.length && <p>No published articles in this category yet.</p>}
    {category.posts.map(({ post }) => <article key={post.id} className="mb-40">
      <h2 className="mb-10"><Link href={`/posts/${post.slug}`}>{post.title}</Link></h2>
      {post.publishedAt && <p className="text-muted font-small">{post.publishedAt.toISOString().slice(0, 10)}</p>}
      <p>{post.excerpt}</p>
    </article>)}
  </main><Footer variant="default" /></>;
}
