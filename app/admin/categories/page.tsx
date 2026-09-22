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
  return (
    <>
      <h1 className="admin-page-title">Categories</h1>
      <p className="admin-page-sub">Manage article categories.</p>
      <div className="admin-card">
        <div className="admin-card-header">
          <h2 className="admin-card-title">Categories</h2>
          <div className="admin-actions">
            <Link href="/admin" className="admin-back">Back to dashboard</Link>
            <Link href="/admin/categories/new" className="admin-btn admin-btn-primary">Create category</Link>
          </div>
        </div>
        {categories.length ? (
          <div className="table-wrap table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Slug</th>
                  <th>Posts</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id}>
                    <td>{category.name}</td>
                    <td><code>{category.slug}</code></td>
                    <td>{category._count.posts}</td>
                    <td>
                      <Link href={`/admin/categories/${category.id}/edit`} className="admin-btn admin-btn-sm">Edit</Link>
                      <span className="admin-meta">·</span>
                      <Link href={`/categories/${category.slug}`} className="admin-btn admin-btn-sm">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="admin-empty"><span className="admin-empty-icon">📁</span>No categories yet. Create one to organise published posts.</p>
        )}
      </div>
    </>
  );
}
