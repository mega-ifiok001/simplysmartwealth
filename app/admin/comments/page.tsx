import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { pageNumber } from "@/lib/pagination";
import { approveComment, unapproveComment, deleteComment } from "@/app/admin/actions";
export const dynamic = "force-dynamic";
export default async function AdminCommentsPage({ searchParams }: { searchParams: Promise<{ page?: string; status?: string }> }) {
  await requireAdmin();
  const params = await searchParams;
  const status = params.status === "approved" ? "approved" : "pending";
  const where = { approved: status === "approved" };
  const total = await prisma.comment.count({ where });
  const pages = Math.max(1, Math.ceil(total / 20));
  const page = Math.min(pageNumber(params.page), pages);
  const comments = await prisma.comment.findMany({ where,
    orderBy: [{ createdAt: "desc" }, { id: "asc" }], skip: (page - 1) * 20, take: 20,
    include: { post: { select: { title: true, slug: true } } },
  });
  return <main>
    <nav><Link href="/admin">Back to dashboard</Link><Link href="/admin/inbox">Contact inbox</Link></nav>
    <h1>Comment moderation</h1>
    <form action="/admin/comments" method="get">
      <label>Status<select name="status" defaultValue={status}><option value="pending">Pending</option><option value="approved">Approved</option></select></label>
      <button type="submit">Filter comments</button>
    </form>
    <h2 className="mt-30">{status === "approved" ? "Approved" : "Pending"} ({total})</h2>
    {comments.length ? comments.map(comment => <article key={comment.id} className="mb-20">
      <p><strong>{comment.authorName}</strong> on <Link href={`/posts/${comment.post.slug}`}>{comment.post.title}</Link>
        <span className="text-muted"> · {comment.createdAt.toISOString().slice(0, 10)}</span></p>
      <p style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{comment.content}</p>
      <form action={(comment.approved ? unapproveComment : approveComment).bind(null, comment.id)} className="inline">
        <button type="submit">{comment.approved ? "Unapprove" : "Approve"}</button></form>{" "}
      <form action={deleteComment.bind(null, comment.id)} className="inline"><button type="submit">Delete</button></form>
    </article>) : <p>No matching comments.</p>}
    <nav aria-label="Comment pages">
      {page > 1 && <Link href={`/admin/comments?status=${status}&page=${page - 1}`}>Previous</Link>}
      <span>Page {page} of {pages}</span>
      {page < pages && <Link href={`/admin/comments?status=${status}&page=${page + 1}`}>Next</Link>}
    </nav>
  </main>;
}
