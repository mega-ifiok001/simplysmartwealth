import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/auth";
import AdminLoginForm from "@/components/admin/LoginForm";
export const dynamic = "force-dynamic";
export default async function AdminLoginPage() {
  if (await getAdmin()) redirect("/admin");
  return <main className="admin-login"><h1>Administrator sign in</h1>
    <p>Use the account created through the secure bootstrap command.</p>
    <AdminLoginForm /><p><Link href="/">Back to website</Link></p>
  </main>;
}
