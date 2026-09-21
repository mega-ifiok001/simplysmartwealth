import type { Metadata } from "next";
import "./globals.css";
import "../public/assets/css/style.css";
import "../public/assets/css/widgets.css";
import "../public/assets/css/dark.css";
import "../public/assets/css/responsive.css";
import SiteFrame from "@/components/SiteFrame";

export const metadata: Metadata = {
  title: {
    default: "Simply Smart Wealth — Personal Finance, Made Practical",
    template: "%s",
  },
  description:
    "Practical personal finance: budgeting, saving, side hustles, making money online, investing, and getting out of debt.",
  icons: { icon: "/assets/imgs/theme/favicon.png" },
};

// Applies the saved dark theme before first paint (same behavior as the
// original template's darkLightMode init in main.js).
const themeInit = `try{if(localStorage.getItem("theme")==="dark"){document.body.classList.add("dark");var b=document.querySelector(".dark-light-mode");if(b){b.classList.add("dark")}}}catch(e){}`;

const FALLBACK_SITE_NAME = "Simply Smart Wealth";

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // The site name comes from admin-editable settings so the header always
  // matches what the operator saved. Falls back safely without a database.
  let siteName = FALLBACK_SITE_NAME;
  if (process.env.DATABASE_URL) {
    try {
      const { getSiteSettings } = await import("@/lib/settings");
      const settings = await getSiteSettings();
      if (settings.site_name) siteName = settings.site_name;
    } catch {
      // keep fallback
    }
  }
  return (
    <html lang="en" className="no-js">
      <body className="theme-mode" suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        <script
          type="module"
          src="https://cdn.jsdelivr.net/npm/ionicons@7/dist/ionicons/ionicons.esm.js"
          async
        ></script>
        <SiteFrame siteName={siteName}>{children}</SiteFrame>
      </body>
    </html>
  );
}
