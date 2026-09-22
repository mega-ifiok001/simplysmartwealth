import Link from "next/link";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ContactsList() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  if (!messages.length) {
    return <p className="admin-empty">No contact messages yet.</p>;
  }
  return (
    <table className="admin-table">
      <thead>
        <tr>
          <th>From</th>
          <th>Subject</th>
          <th>Received</th>
          <th>Status</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {messages.map((m) => (
          <tr key={m.id}>
            <td>{m.name} &lt;{m.email}&gt;</td>
            <td>{m.subject || "(no subject)"}</td>
            <td className="admin-meta">{m.createdAt.toISOString().slice(0, 10)}</td>
            <td>{m.resolved ? "Resolved" : m.read ? "Read" : "New"}</td>
            <td className="admin-actions-cell">
              <Link href={`/admin/contacts/${m.id}`} className="admin-btn">View</Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}