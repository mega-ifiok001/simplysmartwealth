import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { setContactResolved, deleteContactMessage, markContactRead } from "@/app/admin/actions";
import { pageNumber } from "@/lib/pagination";
export const dynamic = "force-dynamic";
export default async function AdminInboxPage({ searchParams }: { searchParams: Promise<{ page?: string; status?: string }> }) {
  await requireAdmin();
  const params = await searchParams;
  const status = ["open", "resolved", "unread"].includes(params.status || "") ? params.status! : "all";
  const where = status === "open" ? { resolved: false } : status === "resolved" ? { resolved: true } : status === "unread" ? { read: false } : {};
  const [total, open] = await Promise.all([prisma.contactMessage.count({ where }), prisma.contactMessage.count({ where: { resolved: false } })]);
  const pages = Math.max(1, Math.ceil(total / 20));
  const page = Math.min(pageNumber(params.page), pages);
  const messages = await prisma.contactMessage.findMany({ where, orderBy: [{ createdAt: "desc" }, { id: "asc" }], skip: (page - 1) * 20, take: 20 });
  return <main>
    <nav><Link href="/admin">Back to dashboard</Link><Link href="/admin/comments">Comment moderation</Link></nav>
    <h1>Contact inbox ({open} open)</h1>
    <form action="/admin/inbox" method="get">
      <label>Status<select name="status" defaultValue={status}>
        <option value="all">All messages</option><option value="open">Open</option>
        <option value="resolved">Resolved</option><option value="unread">Unread</option>
      </select></label><button type="submit">Filter messages</button>
    </form>
    <p className="mt-20">{total} matching messages</p>
    {messages.length ? messages.map(message => <article key={message.id} className="mb-20" style={{ opacity: message.resolved ? 0.65 : 1 }}>
      <p><strong>{message.name}</strong> &lt;{message.email}&gt;{message.phone ? ` · ${message.phone}` : ""}
        <span className="text-muted"> · {message.createdAt.toISOString().slice(0, 16).replace("T", " ")}</span>
        {!message.read && <span> · </span>}{!message.read && <strong>new</strong>}</p>
      {message.subject && <p><em>{message.subject}</em></p>}
      <p style={{ whiteSpace: "pre-wrap" }}>{message.message}</p>
      <form action={markContactRead.bind(null, message.id, !message.read)} className="inline">
        <button type="submit">{message.read ? "Mark unread" : "Mark read"}</button></form>{" "}
      <form action={setContactResolved.bind(null, message.id, !message.resolved)} className="inline">
        <button type="submit">{message.resolved ? "Reopen" : "Mark resolved"}</button></form>{" "}
      <form action={deleteContactMessage.bind(null, message.id)} className="inline"><button type="submit">Delete</button></form>
    </article>) : <p>No matching messages.</p>}
    <nav aria-label="Inbox pages">
      {page > 1 && <Link href={`/admin/inbox?status=${status}&page=${page - 1}`}>Previous</Link>}
      <span>Page {page} of {pages}</span>
      {page < pages && <Link href={`/admin/inbox?status=${status}&page=${page + 1}`}>Next</Link>}
    </nav>
  </main>;
}
