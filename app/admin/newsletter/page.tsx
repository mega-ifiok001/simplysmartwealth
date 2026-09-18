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
    <div className="row">
      <div className="col-12 mb-30">
        <h1 className="font-weight-900 mb-10">Newsletter</h1>
        <p className="text-muted mb-0">
          {count === 1 ? "1 confirmed subscriber" : `${count} confirmed subscribers`} will receive campaigns.
          Recipients must confirm by email before they are included.
        </p>
      </div>
      <div className="col-lg-6 mb-30">
        <div className="card-box p-30 bg-white border-radius-10">
          <h4 className="mb-20 font-weight-700">New campaign</h4>
          <NewsletterComposer />
        </div>
      </div>
      <div className="col-lg-6 mb-30">
        <div className="card-box p-30 bg-white border-radius-10">
          <h4 className="mb-20 font-weight-700">Recent campaigns</h4>
          {campaigns.length === 0 ? (
            <p className="text-muted mb-0">No campaigns sent yet.</p>
          ) : (
            <ul className="list-unstyled mb-0">
              {campaigns.map((c) => (
                <li key={c.id} className="mb-10 pb-10 border-bottom">
                  <strong>{c.subject}</strong>
                  <div className="text-muted font-small">
                    {c.status} · {c.recipientCount} recipient{c.recipientCount === 1 ? "" : "s"} ·{" "}
                    {(c.sentAt ?? c.createdAt).toLocaleString()}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}