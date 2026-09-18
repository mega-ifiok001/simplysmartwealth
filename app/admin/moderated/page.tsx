import Link from "next/link";
import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { approveComment, deleteComment } from "@/app/admin/actions";

export const metadata: Metadata = {
  title: "Comment moderation | Admin",
  robots: { index: false },
};

/**
 * Moderation queue: every pending (unapproved) comment, grouped by post,
 * with one-click approve/delete. Approving publishes the comment on the
 * article page immediately via revalidatePath in the server action.
 */
export default async function ModerationPage() {
  await requireAdmin();
  const [pending, totalPending, totalApproved] = await Promise.all([
    prisma.comment.findMany({
      where: { approved: false },
      include: { post: { select: { title: true, slug: true } } },
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
    prisma.comment.count({ where: { approved: false } }),
    prisma.comment.count({ where: { approved: true } }),
  ]);
  return (
    <main>
      <div className="d-flex justify-content-between align-items-center mb-20">
        <h1 className="mb-0">Comment moderation</h1>
        <Link href="/admin" className="btn btn-sm btn-outline-secondary">Back to dashboard</Link>
      </div>
      <p className="text-muted">
        {totalPending} pending · {totalApproved} approved
      </p>
      {pending.length === 0 ? (
        <p>Nothing awaiting moderation. New comments appear here automatically.</p>
      ) : (
        <div className="list-group">
          {pending.map((comment) => (
            <div key={comment.id} className="list-group-item">
              <div className="d-flex justify-content-between flex-wrap gap-2">
                <div>
                  <strong>{comment.authorName}</strong>
                  <span className="text-muted"> on </span>
                  <Link href={`/posts/${comment.post.slug}`}>{comment.post.title}</Link>
                  <p className="mb-0 mt-5" style={{ whiteSpace: "pre-wrap" }}>{comment.content}</p>
                  <small className="text-muted">{comment.createdAt.toLocaleString()}</small>
                </div>
                <div className="d-flex gap-10 align-self-start">
                  <form action={approveComment.bind(null, comment.id)}>
                    <button type="submit" className="btn btn-sm btn-success">Approve</button>
                  </form>
                  <form action={deleteComment.bind(null, comment.id)}>
                    <button type="submit" className="btn btn-sm btn-outline-danger">Delete</button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
