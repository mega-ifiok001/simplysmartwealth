import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import PostForm from "@/components/admin/PostForm";
export const dynamic = "force-dynamic";
export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const [post, categories] = await Promise.all([
    prisma.post.findUnique({ where: { id }, select: {
      id: true, title: true, slug: true, excerpt: true, content: true, status: true, coverUrl: true, coverAlt: true,
      featured: true, publishedAt: true,
      categories: { select: { categoryId: true } },
    } }),
    prisma.category.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);
  if (!post) notFound();
  const { categories: links, ...rest } = post;
  return <main><nav><Link href="/admin">Back to dashboard</Link></nav><h1>Edit post</h1>
    <PostForm post={{ ...rest, publicationDate: post.publishedAt?.toISOString().slice(0, 16) ?? "", selectedCategoryIds: links.map(link => link.categoryId) }} categories={categories} /></main>;
}
