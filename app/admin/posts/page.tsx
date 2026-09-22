import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { postCount, categoryCount, subscriberCount, pendingCommentCount } from "@/lib/admin-stats";
import { formatCount } from "@/lib/admin-stats";

export const metadata: Metadata = { title: "Simply Smart Wealth - Posts" };

export default async function AdminPostsPage() {
  await requireAdmin();
  const totalPosts = await postCount();
  const totalCategories = await categoryCount();
  const totalSubscribers = await subscriberCount();
  const pendingComments = await pendingCommentCount();
  return (
    <>
      <h1 className="admin-page-title">Posts</h1>
      <p className="admin-page-sub">All posts in your database.</p>
      <div className="admin-stats">
        <div className="admin-stat">
          <div className="admin-stat-value">{formatCount(totalPosts)}</div>
          <div className="admin-stat-label">Posts</div>
        </div>
        <div className="admin-stat">
          <div className="admin-stat-value">{formatCount(totalCategories)}</div>
          <div className="admin-stat-label">Categories</div>
        </div>
        <div className="admin-stat">
          <div className="admin-stat-value">{formatCount(totalSubscribers)}</div>
          <div className="admin-stat-label">Subscribers</div>
        </div>
        <div className="admin-stat">
          <div className="admin-stat-value">{formatCount(pendingComments)}</div>
          <div className="admin-stat-label">Pending comments</div>
        </div>
      </div>
      <div className="admin-card">
        <div className="admin-card-header">
          <h2 className="admin-card-title">Posts</h2>
          <Link href="/admin/posts/new" className="admin-btn admin-btn-primary">New post</Link>
        </div>
        <p className="admin-empty"><span className="admin-empty-icon">📄</span>No posts yet.</p>
      </div>
    </>
  );
}