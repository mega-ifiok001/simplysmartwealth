import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import CategoryForm from "@/components/admin/CategoryForm";
export const dynamic = "force-dynamic";
export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const category = await prisma.category.findUnique({
    where: { id: (await params).id },
    select: { id: true, name: true, slug: true, description: true },
  });
  if (!category) notFound();
  return <main><nav><Link href="/admin/categories">Back to categories</Link></nav><h1>Edit category</h1><CategoryForm category={category} /></main>;
}
