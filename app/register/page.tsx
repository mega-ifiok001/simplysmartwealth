import Behaviors from "@/components/Behaviors";
import Footer from "@/components/layout/Footer";
import SiteBottom from "@/components/layout/SiteBottom";

export const metadata = {
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
						<form method="post">
							<div className="form-group"><input type="text" required className="form-control" name="username" placeholder="Username" /></div>
							<div className="form-group"><input type="text" required className="form-control" name="email" placeholder="Email" /></div>
							<div className="form-group"><input className="form-control" required type="password" name="password" placeholder="Password" /></div>
							<div className="form-group"><input className="form-control" required type="password" name="password" placeholder="Confirm password" /></div>
							<div className="login_footer form-group">
								<div className="chek-form">
									<div className="custome-checkbox"><input className="form-check-input" type="checkbox" name="checkbox" id="exampleCheckbox1" value="" /> <label className="form-check-label" htmlFor="exampleCheckbox1"><span>I agree to terms &amp; Policy.</span></label></div>
								</div>
								<a className="text-muted" href="#">Lean more</a>
							</div>
							<div className="form-group"><button type="submit" className="button button-contactForm btn-block">Submit &amp; Register</button></div>
						</form>
						<div className="divider-text-center mt-15 mb-15"><span>or</span></div>
						<ul className="btn-login list_none text-center mb-15"><li><a href="#" className="btn btn-facebook"><i className="elegant-icon social_facebook  mr-5"></i>Facebook</a></li> <li><a href="#" className="btn btn-google"><i className="elegant-icon social_googleplus mr-5"></i>Google</a></li></ul>
						<div className="text-muted text-center">Already have an account? <a href="/login">Sign up now</a></div>
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
