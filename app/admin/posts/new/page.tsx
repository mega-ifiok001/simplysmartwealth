import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import PostForm from "@/components/admin/PostForm";
export const dynamic = "force-dynamic";
export default async function NewPostPage() {
  await requireAdmin();
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } });
  return <main><nav><Link href="/admin">Back to dashboard</Link></nav><h1>Create post</h1><PostForm categories={categories} /></main>;
}
