import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import NewsletterComposer from "@/components/admin/NewsletterComposer";
import { listCampaigns, subscriberCount } from "./actions";

export const metadata: Metadata = {
  title: "Simply Smart Wealth - Newsletter",
  robots: { index: false },
};

export default async function NewsletterAdminPage() {
  await requireAdmin();
  const [count, campaigns] = await Promise.all([subscriberCount(), listCampaigns()]);
  return (
    <>
      <h1 className="admin-page-title">Newsletter</h1>
      <p className="admin-page-sub">
        {count === 1 ? "1 confirmed subscriber" : `${count} confirmed subscribers`} will receive campaigns.
        Recipients must confirm by email before they are included.
      </p>
      <div className="admin-grid-2">
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">New campaign</h2>
          </div>
          <NewsletterComposer />
        </div>
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">Recent campaigns</h2>
          </div>
          {campaigns.length === 0 ? (
            <p className="admin-page-sub">No campaigns sent yet.</p>
          ) : (
            <ul className="admin-list">
              {campaigns.map((c) => (
                <li key={c.id} className="admin-list-item">
                  <div className="admin-list-title"><strong>{c.subject}</strong></div>
                  <div className="admin-meta">
                    {c.status} · {c.recipientCount} recipient{c.recipientCount === 1 ? "" : "s"} ·
                    {(c.sentAt ?? c.createdAt).toLocaleString()}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}