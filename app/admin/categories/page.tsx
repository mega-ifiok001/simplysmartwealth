import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
export const dynamic = "force-dynamic";
export default async function AdminCategoriesPage() {
  await requireAdmin();
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, slug: true, _count: { select: { posts: true } } },
  });
  return <main><nav><Link href="/admin">Back to dashboard</Link><Link href="/admin/categories/new">Create category</Link></nav>
    <h1>Categories</h1>
    {categories.length ? <div className="table-wrap"><table><thead><tr><th>Name</th><th>Slug</th><th>Posts</th><th>Actions</th></tr></thead><tbody>
      {categories.map(category => <tr key={category.id}><td>{category.name}</td><td>{category.slug}</td><td>{category._count.posts}</td>
        <td><Link href={`/admin/categories/${category.id}/edit`}>Edit</Link> · <Link href={`/categories/${category.slug}`}>View</Link></td></tr>)}
    </tbody></table></div> : <p>No categories yet. Create one to organise published posts.</p>}
  </main>;
}
