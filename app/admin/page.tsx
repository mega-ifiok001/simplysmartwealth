import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import SignOutButton from "@/components/admin/SignOutButton";
export const dynamic = "force-dynamic";
export default async function AdminPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const admin = await requireAdmin();
  const requested = Number((await searchParams).page ?? 1);
  const page = Number.isInteger(requested) && requested > 0 ? Math.min(requested, 10000) : 1;
  const now = new Date();
  const [posts, total, published, scheduled, pendingComments, openMessages] = await Promise.all([
    prisma.post.findMany({ orderBy: { updatedAt: "desc" }, skip: (page - 1) * 20, take: 20 }),
    prisma.post.count(), prisma.post.count({ where: { status: "PUBLISHED", publishedAt: { lte: now } } }),
    prisma.post.count({ where: { status: "PUBLISHED", publishedAt: { gt: now } } }),
    prisma.comment.count({ where: { approved: false } }),
    prisma.contactMessage.count({ where: { resolved: false } }),
  ]);
  return <main><h1>Publishing dashboard</h1><p>Welcome, {admin.name}.</p>
    <nav><Link href="/admin/posts/new">Create post</Link><Link href="/admin/categories">Categories</Link>
      <Link href="/admin/comments">Comments{pendingComments ? ` (${pendingComments})` : ""}</Link>
      <Link href="/admin/inbox">Inbox{openMessages ? ` (${openMessages})` : ""}</Link>
      <Link href="/admin/newsletter">Newsletter</Link>
      <Link href="/admin/settings">Site settings</Link><Link href="/">View website</Link><SignOutButton /></nav>
    <p>{total} posts · {published} published · {scheduled} scheduled · {total - published - scheduled} drafts</p>
    <div className="table-wrap"><table><thead><tr><th>Title</th><th>Status</th><th>Updated</th><th>Actions</th></tr></thead>
      <tbody>{posts.map(post => <tr key={post.id}><td>{post.title}</td><td>{post.status === "PUBLISHED" && post.publishedAt && post.publishedAt > now ? "SCHEDULED" : post.status}</td><td>{post.updatedAt.toISOString().slice(0, 10)}</td>
        <td><Link href={`/admin/posts/${post.id}/edit`}>Edit</Link>{post.status === "PUBLISHED" && post.publishedAt && post.publishedAt <= now && <> · <Link href={`/posts/${post.slug}`}>View</Link></>}</td></tr>)}</tbody></table></div>
    {!posts.length && <p>No posts here yet. Create your first draft to get started.</p>}
    <nav aria-label="Post pages">{page > 1 && <Link href={`/admin?page=${page - 1}`}>Previous</Link>}
      {page * 20 < total && <Link href={`/admin?page=${page + 1}`}>Next</Link>}</nav>
  </main>;
}
