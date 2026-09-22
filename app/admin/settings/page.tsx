import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { getSiteSettings } from "@/lib/settings";
import SettingsForm from "@/components/admin/SettingsForm";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  await requireAdmin();
  const settings = await getSiteSettings();
  return (
    <>
      <h1 className="admin-page-title">Site settings</h1>
      <p className="admin-page-sub">These settings control the main homepage, about/contact pages, and policy pages. Review your business and legal information before publishing.</p>
      <div className="admin-card">
        <div className="admin-card-header">
          <h2 className="admin-card-title">Site settings</h2>
          <div className="admin-actions">
            <Link href="/admin" className="admin-back">Back to dashboard</Link>
          </div>
        </div>
        <SettingsForm values={settings} />
      </div>
    </>
  );
}
