import NewsletterForm from "@/components/site/NewsletterForm";

export default function Footer({
  variant = "default",
}: {
  variant?: "default" | "plain";
}) {
  return (
    <footer className={"pt-50 pb-20" + (variant === "plain" ? "" : " bg-grey")}>
      <div className="container">
        <div className="row">
          <div className="col-lg-3 col-md-6">
            <div className="sidebar-widget wow fadeInUp animated mb-30">
              <div className="widget-header-2 position-relative mb-30"><h5 className="mt-5 mb-30">About us</h5></div>
              <div className="textwidget"><p>Practical personal-finance guidance: save more, invest smarter, and grow your wealth with confidence.</p></div>
            </div>
          </div>
          <div className="col-lg-2 col-md-6">
            <div className="sidebar-widget widget_categories wow fadeInUp animated mb-30" data-wow-delay="0.1s">
              <div className="widget-header-2 position-relative mb-30"><h5 className="mt-5 mb-30">Quick links</h5></div>
              <ul className="font-small">
                <li className="cat-item"><a href="/about">About</a></li>
                <li className="cat-item"><a href="/contact">Contact</a></li>
                <li className="cat-item"><a href="/privacy">Privacy Policy</a></li>
                <li className="cat-item"><a href="/terms">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <div className="sidebar-widget widget_tagcloud wow fadeInUp animated mb-30" data-wow-delay="0.2s">
              <div className="widget-header-2 position-relative mb-30"><h5 className="mt-5 mb-30">Categories</h5></div>
              <div className="tagcloud mt-50">
                <a className="tag-cloud-link" href="/category">Investing</a>
                <a className="tag-cloud-link" href="/category">Saving</a>
                <a className="tag-cloud-link" href="/category">Budgeting</a>
                <a className="tag-cloud-link" href="/category">Retirement</a>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6">
            <div className="sidebar-widget widget_newsletter wow fadeInUp animated mb-30" data-wow-delay="0.3s">
              <div className="widget-header-2 position-relative mb-30"><h5 className="mt-5 mb-30">Newsletter</h5></div>
              <div className="newsletter">
                <p className="font-medium">Subscribe to our newsletter and get our newest updates right on your inbox.</p>
                <NewsletterForm />
              </div>
            </div>
          </div>
        </div>
        <div className="footer-copy-right pt-30 mt-20 wow fadeInUp animated">
          <p className="float-md-start font-small text-muted">© {new Date().getFullYear()} Simply Smart Wealth. All rights reserved.</p>
          <p className="float-md-end font-small text-muted"><a href="/privacy">Privacy</a> | <a href="/terms">Terms</a></p>
        </div>
      </div>
    </footer>
  );
}