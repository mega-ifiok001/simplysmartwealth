import type { Metadata } from "next";
import Link from "next/link";
import Behaviors from "@/components/Behaviors";
import Footer from "@/components/layout/Footer";
import SiteBottom from "@/components/layout/SiteBottom";
import { confirmNewsletter } from "@/lib/newsletter";

// A one-time confirmation token is consumed on load; never cache this.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Simply Smart Wealth - Newsletter confirmed",
  robots: { index: false },
};

export default async function NewsletterConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  let ok = false;
  let message = "This page needs a valid confirmation link from your email.";
  if (token) {
    const result = await confirmNewsletter(token).catch(() => ({ ok: false, message: "Something went wrong. Please try again." }));
    ok = result.ok;
    message = result.message;
  }
  return (
    <>
      <main className="bg-grey pt-80 pb-50">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-6 col-md-10">
              <div className="login_wrap widget-taber-content p-30 bg-white border-radius-10">
                <div className="padding_eight_all bg-white">
                  <div className="heading_s1 text-center"><h3 className="mb-30 font-weight-900">Newsletter</h3></div>
                  <p role={ok ? "status" : "alert"} className={ok ? "text-success" : "text-danger"}>{message}</p>
                  <div className="text-muted text-center"><Link href="/">Back to home</Link></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Behaviors />
      <SiteBottom />
      <Footer variant="default" />
    </>
  );
}