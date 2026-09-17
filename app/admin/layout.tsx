import "./admin.css";
export const metadata = { title: "Admin | Simply Smart Wealth", robots: { index: false, follow: false } };
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="admin-shell">{children}</div>;
}
