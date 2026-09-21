import type { Metadata } from "next";
import Link from "next/link";
import Behaviors from "@/components/Behaviors";
import Footer from "@/components/layout/Footer";
import SiteBottom from "@/components/layout/SiteBottom";
import { verifyEmail } from "@/lib/reader-auth";

// A one-time verification token is consumed on load; never cache this.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Simply Smart Wealth - Confirm your email",
  robots: { index: false },
};

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  let ok = false;
  let message = "This page needs a valid confirmation link from your email.";
  if (token) {
    const result = await verifyEmail(token).catch(() => ({ ok: false, error: "Something went wrong. Please try again." }));
    ok = result.ok;
    if (!result.ok && "error" in result && result.error) message = result.error;
    if (result.ok && "message" in result && result.message) message = result.message;
  }
  return (
    <>
      <main className="bg-grey pt-80 pb-50">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-6 col-md-10">
              <div className="login_wrap widget-taber-content p-30 bg-white border-radius-10">
                <div className="padding_eight_all bg-white">
                  <div className="heading_s1 text-center"><h3 className="mb-30 font-weight-900">Confirm your email</h3></div>
                  <p role={ok ? "status" : "alert"} className={ok ? "text-success" : "text-danger"}>{message}</p>
                  <div className="text-muted text-center">
                    <Link href="/login">Go to sign in</Link>
                  </div>
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