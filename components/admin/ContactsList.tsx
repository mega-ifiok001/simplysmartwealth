import Link from "next/link";

export default function ContactsList() {
  return (
    <p className="empty">
      No contacts yet.
      <Link href="/admin/contacts" className="btn btn-secondary" style={{ marginLeft: 8 }}>Refresh</Link>
    </p>
  );
}