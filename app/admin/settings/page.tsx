import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { getSiteSettings } from "@/lib/settings";
import SettingsForm from "@/components/admin/SettingsForm";
export const dynamic = "force-dynamic";
export default async function SettingsPage() {
  await requireAdmin();
  return <main><Link href="/admin">Back to dashboard</Link><h1>Site settings</h1>
    <p>These settings control the main homepage, about/contact pages, and policy pages. Review your business and legal information before publishing.</p>
    <SettingsForm values={await getSiteSettings()} /></main>;
}
