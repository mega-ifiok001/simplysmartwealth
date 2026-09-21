import type { Metadata } from "next";
import Behaviors from "@/components/Behaviors";
import Footer from "@/components/layout/Footer";
import SiteBottom from "@/components/layout/SiteBottom";
import ReaderRegisterForm from "@/components/site/ReaderRegisterForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Simply Smart Wealth - Register",
};

export default function RegisterPage() {
  return (
    <>
      <main className="bg-grey pt-80 pb-50">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-6 col-md-10">
              <div className="login_wrap widget-taber-content p-30 bg-white border-radius-10">
                <div className="padding_eight_all bg-white">
                  <div className="heading_s1 text-center"><h3 className="mb-30 font-weight-900">Create an account</h3></div>
                  <ReaderRegisterForm />
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