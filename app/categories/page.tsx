import Link from "next/link";
import { prisma } from "@/lib/db";
export const dynamic = "force-dynamic";
export const metadata = { title: "Categories | Simply Smart Wealth" };
export default async function CategoriesPage() {
  if (!process.env.DATABASE_URL) return <main className="container pt-50 pb-50"><h1>Categories</h1><p>Browse categories will be available once the database is configured.</p></main>;
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, slug: true, description: true,
      _count: { select: { posts: { where: { post: { status: "PUBLISHED", publishedAt: { lte: new Date() } } } } } } },
  });
  const listed = categories.filter(category => category._count.posts > 0);
  return <main className="container pt-50 pb-50"><h1 className="mb-30">Categories</h1>
    {!listed.length && <p>No categories with published articles yet.</p>}
    <ul>{listed.map(category => <li key={category.id} className="mb-15">
      <Link href={`/categories/${category.slug}`}><strong>{category.name}</strong></Link> <span className="text-muted">({category._count.posts})</span>
      {category.description && <p className="text-muted">{category.description}</p>}
    </li>)}</ul>
  </main>;
}
