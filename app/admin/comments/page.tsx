import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { pageNumber } from "@/lib/pagination";
import { approveComment, unapproveComment, deleteComment } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

/**
 * Comments publish immediately, so this screen is a review/cleanup tool
 * rather than an approval queue: it lists everything by default, and an admin
 * can unapprove (hide) or delete anything that should not be public.
 */
export default async function AdminCommentsPage({ searchParams }: { searchParams: Promise<{ page?: string; status?: string }> }) {
  await requireAdmin();
  const params = await searchParams;
  const status = params.status === "approved" ? "approved" : params.status === "pending" ? "pending" : "all";
  const where = status === "all" ? {} : { approved: status === "approved" };
  const total = await prisma.comment.count({ where });
  const pages = Math.max(1, Math.ceil(total / 20));
  const page = Math.min(pageNumber(params.page), pages);
  const comments = await prisma.comment.findMany({
    where,
    orderBy: [{ createdAt: "desc" }, { id: "asc" }],
    skip: (page - 1) * 20,
    take: 20,
    include: { post: { select: { title: true, slug: true } }, parent: { select: { authorName: true } } },
  });
  const heading = status === "all" ? "All comments" : status === "approved" ? "Approved" : "Hidden";
  return (
    <>
      <h1 className="admin-page-title">Comments</h1>
      <p className="admin-page-sub">Comments appear on articles as soon as they are posted. Unapprove to hide one, or delete it permanently.</p>
      <div className="admin-card">
        <div className="admin-card-header">
          <h2 className="admin-card-title">{heading} ({total})</h2>
          <div className="admin-actions">
            <Link href="/admin" className="admin-back">Back to dashboard</Link>
            <Link href="/admin/inbox" className="admin-btn">Contact inbox</Link>
          </div>
        </div>
        <div className="admin-card-body">
          <form action="/admin/comments" method="get" className="admin-field" style={{ marginBottom: 18 }}>
            <label className="admin-field-label">Status</label>
            <select name="status" defaultValue={status} className="admin-field-select">
              <option value="all">All</option>
              <option value="approved">Approved (visible)</option>
              <option value="pending">Hidden</option>
            </select>
            <button type="submit" className="admin-btn admin-btn-primary">Filter comments</button>
          </form>
          {comments.length ? (
            comments.map((comment) => (
              <article key={comment.id} className="admin-comment">
                <div className="admin-comment-meta">
                  <strong>{comment.authorName}</strong>
                  <span className="admin-meta"> on </span>
                  <Link href={`/posts/${comment.post.slug}`} className="admin-link">{comment.post.title}</Link>
                  <span className="admin-meta"> · {comment.createdAt.toISOString().slice(0, 10)}</span>
                  {comment.parent && (
                    <>
                      <span className="admin-meta"> · reply to {comment.parent.authorName}</span>
                    </>
                  )}
                  {!comment.approved && <span className="badge badge-spam">hidden</span>}
                </div>
                <p className="admin-comment-content" style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{comment.content}</p>
                <div className="admin-comment-actions">
                  <form action={(comment.approved ? unapproveComment : approveComment).bind(null, comment.id)} className="inline">
                    <button type="submit" className="admin-btn">{comment.approved ? "Unapprove" : "Approve"}</button>
                  </form>
                  <form action={deleteComment.bind(null, comment.id)} className="inline">
                    <button type="submit" className="admin-btn admin-btn-danger">Delete</button>
                  </form>
                </div>
              </article>
            ))
          ) : (
            <p className="admin-empty"><span className="admin-empty-icon">💬</span>No matching comments.</p>
          )}
        </div>
      </div>
      <nav className="admin-pagination" aria-label="Comment pages">
        {page > 1 && <Link href={`/admin/comments?status=${status}&page=${page - 1}`} className="admin-btn">Previous</Link>}
        <span>Page {page} of {pages}</span>
        {page < pages && <Link href={`/admin/comments?status=${status}&page=${page + 1}`} className="admin-btn">Next</Link>}
      </nav>
    </>
  );
}
