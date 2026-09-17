import type { Metadata } from "next";
import "./globals.css";
import "../public/assets/css/style.css";
import "../public/assets/css/widgets.css";
import "../public/assets/css/dark.css";
import "../public/assets/css/responsive.css";
import SiteFrame from "@/components/SiteFrame";

export const metadata: Metadata = {
  title: {
    default: "Simply Smart Wealth - Personal Blog",
    template: "%s",
  },
  description:
    "Personal blog about travel tips, hotels review, food guides and lifestyle.",
  icons: { icon: "/assets/imgs/theme/favicon.png" },
};

// Applies the saved dark theme before first paint (same behavior as the
// original template's darkLightMode init in main.js).
const themeInit = `try{if(localStorage.getItem("theme")==="dark"){document.body.classList.add("dark");var b=document.querySelector(".dark-light-mode");if(b){b.classList.add("dark")}}}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="no-js">
      <body className="theme-mode" suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        <script
          type="module"
          src="https://cdn.jsdelivr.net/npm/ionicons@7/dist/ionicons/ionicons.esm.js"
          async
        ></script>
        <SiteFrame>{children}</SiteFrame>
      </body>
    </html>
  );
}
