import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import CategoryForm from "@/components/admin/CategoryForm";
export const dynamic = "force-dynamic";
export default async function NewCategoryPage() {
  await requireAdmin();
  return <main><nav><Link href="/admin/categories">Back to categories</Link></nav><h1>Create category</h1><CategoryForm /></main>;
}
