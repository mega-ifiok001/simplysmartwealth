import type { Metadata } from "next";
import Behaviors from "@/components/Behaviors";
import Footer from "@/components/layout/Footer";
import SiteBottom from "@/components/layout/SiteBottom";
import ResetPasswordForm from "@/components/site/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Simply Smart Wealth - Set a new password",
  robots: { index: false },
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  return (
    <>
      <main className="bg-grey pt-80 pb-50">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-6 col-md-10">
              <div className="login_wrap widget-taber-content p-30 bg-white border-radius-10">
                <div className="padding_eight_all bg-white">
                  <div className="heading_s1 text-center"><h3 className="mb-30 font-weight-900">Set a new password</h3></div>
                  {token ? (
                    <ResetPasswordForm token={token} />
                  ) : (
                    <p role="alert" className="text-danger">
                      This page needs a valid reset link from your email.{" "}
                      <a href="/forgot-password">Request a new one</a>.
                    </p>
                  )}
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