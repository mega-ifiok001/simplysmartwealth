import type { Metadata } from "next";
import Behaviors from "@/components/Behaviors";
import Footer from "@/components/layout/Footer";
import SiteBottom from "@/components/layout/SiteBottom";
import ReaderLoginForm from "@/components/site/ReaderLoginForm";

export const metadata: Metadata = {
  title: "Simply Smart Wealth - Login",
};

export default function LoginPage() {
  return (
    <>
      <main className="bg-grey pt-80 pb-50">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-6 col-md-10">
              <div className="login_wrap widget-taber-content p-30 bg-white border-radius-10">
                <div className="padding_eight_all bg-white">
                  <div className="heading_s1 text-center"><h3 className="mb-30 font-weight-900">Login</h3></div>
                  <ReaderLoginForm />
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
