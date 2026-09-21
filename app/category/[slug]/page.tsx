import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import PublicPage from "@/components/PublicPage";
import ArticleGrid from "@/components/ArticleGrid";

export const dynamic = "force-dynamic";

const getCategory = (slug: string) =>
  prisma.category.findUnique({ where: { slug } });

const postSelect = {
  id: true,
  slug: true,
  title: true,
  excerpt: true,
  coverUrl: true,
  coverAlt: true,
  publishedAt: true,
  categories: { select: { category: { select: { name: true, slug: true } } } },
} as const;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await getCategory(slug);
  return category
    ? { title: `${category.name} | Simply Smart Wealth`, description: category.description }
    : { title: "Category not found" };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) notFound();
  const posts = await prisma.post.findMany({
    where: {
      status: "PUBLISHED",
      publishedAt: { lte: new Date() },
      categories: { some: { categoryId: category.id } },
    },
    orderBy: [{ publishedAt: "desc" }, { id: "asc" }],
    take: 24,
    select: postSelect,
  });

  return (
    <PublicPage>
      <main id="main-content">
        <div className="archive-header pt-50">
          <div className="container">
            <h1 className="font-weight-900">{category.name}</h1>
            {category.description && <p className="font-small text-muted mt-10 mb-0">{category.description}</p>}
            <div className="breadcrumb mt-15">
              <a href="/">Home</a> <span></span> {category.name}
            </div>
            <div className="bt-1 border-color-1 mt-30 mb-50"></div>
          </div>
        </div>
        <div className="container pb-50">
          {!posts.length && <p className="text-muted">No published articles in this topic yet.</p>}
          <ArticleGrid posts={posts} />
        </div>
      </main>
    </PublicPage>
  );
}