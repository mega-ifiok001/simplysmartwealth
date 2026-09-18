import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Behaviors from "@/components/Behaviors";
import Footer from "@/components/layout/Footer";
import SiteBottom from "@/components/layout/SiteBottom";
import { getReader } from "@/lib/auth";
import SignOutButton from "@/components/site/SignOutButton";

export const metadata: Metadata = {
  title: "Simply Smart Wealth - Your account",
  robots: { index: false },
};

export default async function AccountPage() {
  const reader = await getReader();
  if (!reader) redirect("/login");
  return (
    <>
      <main className="bg-grey pt-80 pb-50">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-6 col-md-10">
              <div className="login_wrap widget-taber-content p-30 bg-white border-radius-10">
                <div className="padding_eight_all bg-white">
                  <div className="heading_s1 text-center"><h3 className="mb-30 font-weight-900">Your account</h3></div>
                  <p className="mb-10"><strong>Name:</strong> {reader.name ?? "—"}</p>
                  <p className="mb-30"><strong>Email:</strong> {reader.email}</p>
                  <SignOutButton />
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