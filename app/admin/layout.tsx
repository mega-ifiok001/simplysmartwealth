import Link from "next/link";
import Image from "next/image";
import { headers } from "next/headers";
import "./admin.css";
import { getAdmin } from "@/lib/auth";
import SignOutButton from "@/components/admin/SignOutButton";

export const metadata = {
  title: "Admin | Simply Smart Wealth",
  robots: { index: false, follow: false },
};

const NAV = [
  { section: "Content", links: [
    { href: "/admin", label: "Dashboard", icon: "📊", exact: true },
    { href: "/admin/posts", label: "Posts", icon: "📝" },
    { href: "/admin/categories", label: "Categories", icon: "🗂" },
    { href: "/admin/comments", label: "Comments", icon: "💬" },
  ]},
  { section: "Audience", links: [
    { href: "/admin/contacts", label: "Contacts", icon: "✉️" },
    { href: "/admin/inbox", label: "Inbox", icon: "📥" },
    { href: "/admin/newsletter", label: "Newsletter", icon: "📰" },
  ]},
  { section: "System", links: [
    { href: "/admin/settings", label: "Settings", icon: "⚙️" },
    { href: "/admin/moderated", label: "Moderated", icon: "🛡" },
  ]},
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await getAdmin().catch(() => null);
  const pathname = (await headers()).get("x-pathname") ?? "";
  return (
    <div className="admin-shell">
      <header className="admin-topbar">
        <Link href="/admin" className="admin-logo">
          <Image src="/assets/imgs/theme/logo.png" alt="Simply Smart Wealth" width={22} height={22} className="admin-logo-img" />
          Simply Smart Wealth · Admin
        </Link>
        <div className="admin-topbar-right">
          <Link href="/" className="admin-topbar-link" target="_blank">View site ↗</Link>
          {admin ? (
            <span className="admin-user">Signed in as <strong>{admin.email}</strong> <SignOutButton /></span>
          ) : null}
        </div>
      </header>
      <div className="admin-body">
        <aside className="admin-sidebar">
          {NAV.map((group) => (
            <nav key={group.section} className="admin-sidebar-group" aria-label={group.section}>
              <div className="admin-sidebar-label">{group.section}</div>
              {group.links.map((link) => {
                const active = link.exact ? pathname === link.href : pathname === link.href || pathname.startsWith(`${link.href}/`);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={active ? "admin-sidebar-link active" : "admin-sidebar-link"}
                    aria-current={active ? "page" : undefined}
                  >
                    <span className="admin-sidebar-icon" aria-hidden="true">{link.icon}</span>
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          ))}
          <div className="admin-sidebar-footer">Admin area · not indexed</div>
        </aside>
        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}

