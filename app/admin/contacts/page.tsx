import Link from "next/link";
import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import ContactsList from "./ContactsList";

export const metadata: Metadata = { title: "Simply Smart Wealth - Inbox" };

export default async function AdminContactsPage() {
  await requireAdmin();
  return (
    <>
      <h1 className="admin-page-title">Contacts</h1>
      <p className="admin-page-sub">Messages sent through the site contact form.</p>
      <div className="admin-card">
        <div className="admin-card-header">
          <h2 className="admin-card-title">Messages</h2>
          <div className="admin-actions">
            <Link href="/admin" className="admin-back">Back to dashboard</Link>
          </div>
        </div>
        <ContactsList />
      </div>
    </>
  );
}