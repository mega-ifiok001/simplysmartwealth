import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/auth";
import AdminLoginForm from "@/components/admin/LoginForm";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await getAdmin()) redirect("/admin");
  return (
    <main className="admin-login">
      <div className="admin-card" style={{ maxWidth: 420, margin: "40px auto" }}>
        <div style={{ textAlign: "center", marginBottom: 18 }}>
          <Link href="/admin" className="admin-logo" style={{ justifyContent: "center" }}>
            <img src="/logo.svg" alt="Simply Smart Wealth" className="admin-logo-img" />
            Simply Smart Wealth
          </Link>
        </div>
        <h1 className="admin-page-title" style={{ textAlign: "center" }}>Administrator sign in</h1>
        <p className="admin-page-sub" style={{ textAlign: "center" }}>Use the account created through the secure bootstrap command.</p>
        <AdminLoginForm />
        <p style={{ textAlign: "center", marginTop: 18 }}>
          <Link href="/" className="admin-back">Back to website</Link>
        </p>
      </div>
    </main>
  );
}
