import { redirect } from "next/navigation";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import SignOutButton from "@/components/admin/SignOutButton";
import { pageNumber } from "@/lib/pagination";

export const dynamic = "force-dynamic";

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  await requireAdmin();
  const requested = Number((await searchParams).page ?? 1);
  const page = Number.isInteger(requested) && requested > 0 ? Math.min(requested, 10000) : 1;
  const now = new Date();
  const [posts, total, published, scheduled, pendingComments, openMessages] = await Promise.all([
    prisma.post.findMany({ orderBy: { updatedAt: "desc" }, skip: (page - 1) * 20, take: 20 }),
    prisma.post.count(),
    prisma.post.count({ where: { status: "PUBLISHED", publishedAt: { lte: now } } }),
    prisma.post.count({ where: { status: "PUBLISHED", publishedAt: { gt: now } } }),
    prisma.comment.count({ where: { approved: false } }),
    prisma.contactMessage.count({ where: { resolved: false } }),
  ]);
  return (
    <>
      <h1 className="admin-page-title">Publishing dashboard</h1>
      <p className="admin-page-sub">Welcome.</p>
      <div className="admin-stats">
        <div className="admin-stat">
          <div className="admin-stat-value">{total}</div>
          <div className="admin-stat-label">Posts</div>
        </div>
        <div className="admin-stat">
          <div className="admin-stat-value">{published}</div>
          <div className="admin-stat-label">Published</div>
        </div>
        <div className="admin-stat accent">
          <div className="admin-stat-value">{scheduled}</div>
          <div className="admin-stat-label">Scheduled</div>
        </div>
        <div className="admin-stat">
          <div className="admin-stat-value">{total - published - scheduled}</div>
          <div className="admin-stat-label">Drafts</div>
        </div>
        <div className="admin-stat">
          <div className="admin-stat-value">{pendingComments}</div>
          <div className="admin-stat-label">Pending comments</div>
        </div>
        <div className="admin-stat">
          <div className="admin-stat-value">{openMessages}</div>
          <div className="admin-stat-label">Open inbox</div>
        </div>
      </div>
      <div className="admin-card">
        <div className="admin-card-header">
          <h2 className="admin-card-title">Recent posts</h2>
          <div className="admin-actions">
            <Link href="/admin/posts/new" className="admin-btn admin-btn-primary">Create post</Link>
            <Link href="/admin/categories" className="admin-btn">Categories</Link>
            <Link href="/admin/comments" className="admin-btn">Comments{pendingComments ? ` (${pendingComments})` : ""}</Link>
            <Link href="/admin/inbox" className="admin-btn">Inbox{openMessages ? ` (${openMessages})` : ""}</Link>
            <Link href="/admin/newsletter" className="admin-btn">Newsletter</Link>
            <Link href="/admin/settings" className="admin-btn">Site settings</Link>
            <Link href="/" className="admin-btn">View website</Link>
            <SignOutButton />
          </div>
        </div>
        <div className="admin-card-body">
          <div className="table-wrap table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id}>
                    <td>{post.title}</td>
                    <td>{post.status === "PUBLISHED" && post.publishedAt && post.publishedAt > now ? "SCHEDULED" : post.status}</td>
                    <td>{post.updatedAt.toISOString().slice(0, 10)}</td>
                    <td>
                      <Link href={`/admin/posts/${post.id}/edit`} className="admin-btn admin-btn-sm">Edit</Link>
                      {post.status === "PUBLISHED" && post.publishedAt && post.publishedAt <= now && (
                        <>
                          <span className="admin-meta">·</span>
                          <Link href={`/posts/${post.slug}`} className="admin-btn admin-btn-sm">View</Link>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!posts.length && <p className="admin-empty"><span className="admin-empty-icon">📝</span>No posts here yet. Create your first draft to get started.</p>}
        </div>
      </div>
      <nav className="admin-pagination">
        {page > 1 && <Link href={`/admin?page=${page - 1}`} className="admin-btn">Previous</Link>}
        {page * 20 < total && <Link href={`/admin?page=${page + 1}`} className="admin-btn">Next</Link>}
      </nav>
    </>
  );
}
