import Behaviors from "@/components/Behaviors";
import Footer from "@/components/layout/Footer";
import SiteBottom from "@/components/layout/SiteBottom";

export const metadata = {
  title: "Simply Smart Wealth - CategoryGrid",
};

export default function CategoryGridPage() {
  return (
    <>
<main>
	<div className="archive-header pt-50 text-center">
		<div className="container">
			<h2 className="font-weight-900">Guides</h2>
			<div className="breadcrumb"><a href="/" rel="nofollow">Home</a> <span></span> Guides</div>
			<div className="bt-1 border-color-1 mt-30 mb-50"></div>
		</div>
	</div>
	<div className="container">
		<div className="loop-grid mb-30">
			<div className="row">
				<div className="col-lg-8 mb-30">
					<div className="carausel-post-1 hover-up border-radius-10 overflow-hidden transition-normal position-relative wow fadeInUp animated">
						<div className="arrow-cover"></div>
						<div className="slide-fade">
							<div className="position-relative post-thumb">
								<div className="thumb-overlay img-hover-slide position-relative" style={{ backgroundImage: "url(/assets/imgs/news/news-10.jpg)" }}>
									<a className="img-link" href="/single"></a>
									<span className="top-left-icon bg-warning"><i className="elegant-icon icon_star_alt"></i></span>
									<div className="post-content-overlay text-white ml-30 mr-30 pb-30">
										<div className="entry-meta meta-0 font-small mb-20"><a href="/category"><span className="post-cat text-info text-uppercase">Travel</span></a> <a href="/category"><span className="post-cat text-success text-uppercase">Animal</span></a></div>
										<h3 className="post-title font-weight-900 mb-20"><a className="text-white" href="/single">Beachmaster Elephant Seal Fights off Rival Male, The match is uncompromising</a></h3>
										<div className="entry-meta meta-1 font-small text-white mt-10 pr-5 pl-5"><span className="post-on">20 minutes ago</span> <span className="hit-count has-dot">23k Views</span></div>
									</div>
								</div>
							</div>
							<div className="position-relative post-thumb">
								<div className="thumb-overlay img-hover-slide position-relative" style={{ backgroundImage: "url(/assets/imgs/news/news-12.jpg)" }}>
									<a className="img-link" href="/single"></a>
									<span className="top-left-icon bg-danger"><i className="elegant-icon icon_image"></i></span>
									<div className="post-content-overlay text-white ml-30 mr-30 pb-30">
										<div className="entry-meta meta-0 font-small mb-20"><a href="/category"><span className="post-cat text-info text-uppercase">Lifestyle</span></a></div>
										<h3 className="post-title font-weight-900 mb-20"><a className="text-white" href="/single">This genius photo experiment shows we are all just sheeple in the consumer matrix</a></h3>
										<div className="entry-meta meta-1 font-small text-white mt-10 pr-5 pl-5"><span className="post-on">26 August 2026</span> <span className="hit-count has-dot">18k Views</span></div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<article className="col-lg-4 col-md-6 mb-30 wow fadeInUp animated" data-wow-delay="0.2s">
					<div className="post-card-1 border-radius-10 hover-up">
						<div className="post-thumb thumb-overlay img-hover-slide position-relative" style={{ backgroundImage: "url(/assets/imgs/news/news-1.jpg)" }}><a className="img-link" href="/single"></a> <span className="top-right-icon bg-success"><i className="elegant-icon icon_camera_alt"></i></span> <ul className="social-share"><li><a href="#"><i className="elegant-icon social_share"></i></a></li> <li><a className="fb" href="#" title="Share on Facebook" target="_blank"><i className="elegant-icon social_facebook"></i></a></li> <li><a className="tw" href="#" target="_blank" title="Tweet now"><i className="elegant-icon social_twitter"></i></a></li> <li><a className="pt" href="#" target="_blank" title="Pin it"><i className="elegant-icon social_pinterest"></i></a></li></ul></div>
						<div className="post-content p-30">
							<div className="entry-meta meta-0 font-small mb-10"><a href="/category"><span className="post-cat text-info">Travel</span></a> <a href="/category"><span className="post-cat text-success">Food</span></a></div>
							<div className="d-flex post-card-content">
								<h5 className="post-title mb-20 font-weight-900"><a href="/single">Want fluffy Japanese pancakes but can’t fly to Tokyo?</a></h5>
								<div className="entry-meta meta-1 float-start font-x-small text-uppercase"><span className="post-on">27 August</span> <span className="time-reading has-dot">12 mins read</span> <span className="post-by has-dot">23k views</span></div>
							</div>
						</div>
					</div>
				</article>
				<article className="col-lg-4 col-md-6 mb-30 wow fadeInUp animated">
					<div className="post-card-1 border-radius-10 hover-up">
						<div className="post-thumb thumb-overlay img-hover-slide position-relative" style={{ backgroundImage: "url(/assets/imgs/news/news-2.jpg)" }}><a className="img-link" href="/single"></a> <ul className="social-share"><li><a href="#"><i className="elegant-icon social_share"></i></a></li> <li><a className="fb" href="#" title="Share on Facebook" target="_blank"><i className="elegant-icon social_facebook"></i></a></li> <li><a className="tw" href="#" target="_blank" title="Tweet now"><i className="elegant-icon social_twitter"></i></a></li> <li><a className="pt" href="#" target="_blank" title="Pin it"><i className="elegant-icon social_pinterest"></i></a></li></ul></div>
						<div className="post-content p-30">
							<div className="entry-meta meta-0 font-small mb-10"><a href="/category"><span className="post-cat text-warning">Fashion</span></a></div>
							<div className="d-flex post-card-content">
								<h5 className="post-title mb-20 font-weight-900"><a href="/single">Put Yourself in Your Customers Shoes</a></h5>
								<div className="entry-meta meta-1 float-start font-x-small text-uppercase"><span className="post-on">17 July</span> <span className="time-reading has-dot">8 mins read</span> <span className="post-by has-dot">12k views</span></div>
							</div>
						</div>
					</div>
				</article>
				<article className="col-lg-4 col-md-6 mb-30 wow fadeInUp animated" data-wow-delay="0.2s">
					<div className="post-card-1 border-radius-10 hover-up">
						<div className="post-thumb thumb-overlay img-hover-slide position-relative" style={{ backgroundImage: "url(/assets/imgs/news/news-3.jpg)" }}><a className="img-link" href="/single"></a> <ul className="social-share"><li><a href="#"><i className="elegant-icon social_share"></i></a></li> <li><a className="fb" href="#" title="Share on Facebook" target="_blank"><i className="elegant-icon social_facebook"></i></a></li> <li><a className="tw" href="#" target="_blank" title="Tweet now"><i className="elegant-icon social_twitter"></i></a></li> <li><a className="pt" href="#" target="_blank" title="Pin it"><i className="elegant-icon social_pinterest"></i></a></li></ul></div>
						<div className="post-content p-30">
							<div className="entry-meta meta-0 font-small mb-10"><a href="/category"><span className="post-cat text-danger">Travel</span></a></div>
							<div className="d-flex post-card-content">
								<h5 className="post-title mb-20 font-weight-900"><a href="/single">Life and Death in the Empire of the Tiger</a></h5>
								<div className="entry-meta meta-1 float-start font-x-small text-uppercase"><span className="post-on">7 August</span> <span className="time-reading has-dot">15 mins read</span> <span className="post-by has-dot">500 views</span></div>
							</div>
						</div>
					</div>
				</article>
				<article className="col-lg-4 col-md-6 mb-30 wow fadeInUp animated" data-wow-delay="0.4s">
					<div className="post-card-1 border-radius-10 hover-up">
						<div className="post-thumb thumb-overlay img-hover-slide position-relative" style={{ backgroundImage: "url(/assets/imgs/news/news-4.jpg)" }}><a className="img-link" href="/single"></a> <span className="top-right-icon bg-info"><i className="elegant-icon icon_headphones"></i></span> <ul className="social-share"><li><a href="#"><i className="elegant-icon social_share"></i></a></li> <li><a className="fb" href="#" title="Share on Facebook" target="_blank"><i className="elegant-icon social_facebook"></i></a></li> <li><a className="tw" href="#" target="_blank" title="Tweet now"><i className="elegant-icon social_twitter"></i></a></li> <li><a className="pt" href="#" target="_blank" title="Pin it"><i className="elegant-icon social_pinterest"></i></a></li></ul></div>
						<div className="post-content p-30">
							<div className="entry-meta meta-0 font-small mb-10"><a href="/category"><span className="post-cat text-success">Lifestyle</span></a></div>
							<div className="d-flex post-card-content">
								<h5 className="post-title mb-20 font-weight-900"><a href="/single">When Two Wheels Are Better Than Four</a></h5>
								<div className="entry-meta meta-1 float-start font-x-small text-uppercase"><span className="post-on">15 Jun</span> <span className="time-reading has-dot">9 mins read</span> <span className="post-by has-dot">1.2k views</span></div>
							</div>
						</div>
					</div>
				</article>
				<article className="col-lg-4 col-md-6 mb-30 wow fadeInUp animated">
					<div className="post-card-1 border-radius-10 hover-up">
						<div className="post-thumb thumb-overlay img-hover-slide position-relative" style={{ backgroundImage: "url(/assets/imgs/news/news-5.jpg)" }}><a className="img-link" href="/single"></a> <ul className="social-share"><li><a href="#"><i className="elegant-icon social_share"></i></a></li> <li><a className="fb" href="#" title="Share on Facebook" target="_blank"><i className="elegant-icon social_facebook"></i></a></li> <li><a className="tw" href="#" target="_blank" title="Tweet now"><i className="elegant-icon social_twitter"></i></a></li> <li><a className="pt" href="#" target="_blank" title="Pin it"><i className="elegant-icon social_pinterest"></i></a></li></ul></div>
						<div className="post-content p-30">
							<div className="entry-meta meta-0 font-small mb-10"><a href="/category"><span className="post-cat text-warning">Fashion</span></a></div>
							<div className="d-flex post-card-content">
								<h5 className="post-title mb-20 font-weight-900"><a href="/single">The Life of a Travel Writer with David Farley</a></h5>
								<div className="entry-meta meta-1 float-start font-x-small text-uppercase"><span className="post-on">17 July</span> <span className="time-reading has-dot">8 mins read</span> <span className="post-by has-dot">12k views</span></div>
							</div>
						</div>
					</div>
				</article>
				<article className="col-lg-4 col-md-6 mb-30 wow fadeInUp animated" data-wow-delay="0.2s">
					<div className="post-card-1 border-radius-10 hover-up">
						<div className="post-thumb thumb-overlay img-hover-slide position-relative" style={{ backgroundImage: "url(/assets/imgs/news/news-6.jpg)" }}><a className="img-link" href="/single"></a> <ul className="social-share"><li><a href="#"><i className="elegant-icon social_share"></i></a></li> <li><a className="fb" href="#" title="Share on Facebook" target="_blank"><i className="elegant-icon social_facebook"></i></a></li> <li><a className="tw" href="#" target="_blank" title="Tweet now"><i className="elegant-icon social_twitter"></i></a></li> <li><a className="pt" href="#" target="_blank" title="Pin it"><i className="elegant-icon social_pinterest"></i></a></li></ul></div>
						<div className="post-content p-30">
							<div className="entry-meta meta-0 font-small mb-10"><a href="/category"><span className="post-cat text-danger">Travel</span></a></div>
							<div className="d-flex post-card-content">
								<h5 className="post-title mb-20 font-weight-900"><a href="/single">The 22 Best Things to See and Do in Bangkok</a></h5>
								<div className="entry-meta meta-1 float-start font-x-small text-uppercase"><span className="post-on">7 August</span> <span className="time-reading has-dot">15 mins read</span> <span className="post-by has-dot">500 views</span></div>
							</div>
						</div>
					</div>
				</article>
				<article className="col-lg-4 col-md-6 mb-30 wow fadeInUp animated" data-wow-delay="0.4s">
					<div className="post-card-1 border-radius-10 hover-up">
						<div className="post-thumb thumb-overlay img-hover-slide position-relative" style={{ backgroundImage: "url(/assets/imgs/news/news-7.jpg)" }}><a className="img-link" href="/single"></a> <ul className="social-share"><li><a href="#"><i className="elegant-icon social_share"></i></a></li> <li><a className="fb" href="#" title="Share on Facebook" target="_blank"><i className="elegant-icon social_facebook"></i></a></li> <li><a className="tw" href="#" target="_blank" title="Tweet now"><i className="elegant-icon social_twitter"></i></a></li> <li><a className="pt" href="#" target="_blank" title="Pin it"><i className="elegant-icon social_pinterest"></i></a></li></ul></div>
						<div className="post-content p-30">
							<div className="entry-meta meta-0 font-small mb-10"><a href="/category"><span className="post-cat text-success">Lifestyle</span></a></div>
							<div className="d-flex post-card-content">
								<h5 className="post-title mb-20 font-weight-900"><a href="/single">Why Don’t More Black American Women Travel Solo?</a></h5>
								<div className="entry-meta meta-1 float-start font-x-small text-uppercase"><span className="post-on">15 Jun</span> <span className="time-reading has-dot">9 mins read</span> <span className="post-by has-dot">1.2k views</span></div>
							</div>
						</div>
					</div>
				</article>
				<article className="col-lg-4 col-md-6 mb-30 wow fadeInUp animated">
					<div className="post-card-1 border-radius-10 hover-up">
						<div className="post-thumb thumb-overlay img-hover-slide position-relative" style={{ backgroundImage: "url(/assets/imgs/news/news-8.jpg)" }}><a className="img-link" href="/single"></a> <ul className="social-share"><li><a href="#"><i className="elegant-icon social_share"></i></a></li> <li><a className="fb" href="#" title="Share on Facebook" target="_blank"><i className="elegant-icon social_facebook"></i></a></li> <li><a className="tw" href="#" target="_blank" title="Tweet now"><i className="elegant-icon social_twitter"></i></a></li> <li><a className="pt" href="#" target="_blank" title="Pin it"><i className="elegant-icon social_pinterest"></i></a></li></ul></div>
						<div className="post-content p-30">
							<div className="entry-meta meta-0 font-small mb-10"><a href="/category"><span className="post-cat text-warning">Fashion</span></a></div>
							<div className="d-flex post-card-content">
								<h5 className="post-title mb-20 font-weight-900"><a href="/single">My 8 Favorite Hostels in San José, Costa Rica</a></h5>
								<div className="entry-meta meta-1 float-start font-x-small text-uppercase"><span className="post-on">17 July</span> <span className="time-reading has-dot">8 mins read</span> <span className="post-by has-dot">12k views</span></div>
							</div>
						</div>
					</div>
				</article>
				<article className="col-lg-4 col-md-6 mb-30 wow fadeInUp animated" data-wow-delay="0.2s">
					<div className="post-card-1 border-radius-10 hover-up">
						<div className="post-thumb thumb-overlay img-hover-slide position-relative" style={{ backgroundImage: "url(/assets/imgs/news/news-9.jpg)" }}><a className="img-link" href="/single"></a> <ul className="social-share"><li><a href="#"><i className="elegant-icon social_share"></i></a></li> <li><a className="fb" href="#" title="Share on Facebook" target="_blank"><i className="elegant-icon social_facebook"></i></a></li> <li><a className="tw" href="#" target="_blank" title="Tweet now"><i className="elegant-icon social_twitter"></i></a></li> <li><a className="pt" href="#" target="_blank" title="Pin it"><i className="elegant-icon social_pinterest"></i></a></li></ul></div>
						<div className="post-content p-30">
							<div className="entry-meta meta-0 font-small mb-10"><a href="/category"><span className="post-cat text-danger">Travel</span></a></div>
							<div className="d-flex post-card-content">
								<h5 className="post-title mb-20 font-weight-900"><a href="/single">The Nomadic Network: A Community Update &amp; More Events</a></h5>
								<div className="entry-meta meta-1 float-start font-x-small text-uppercase"><span className="post-on">7 August</span> <span className="time-reading has-dot">15 mins read</span> <span className="post-by has-dot">500 views</span></div>
							</div>
						</div>
					</div>
				</article>
				<article className="col-lg-4 col-md-6 mb-30 wow fadeInUp animated" data-wow-delay="0.4s">
					<div className="post-card-1 border-radius-10 hover-up">
						<div className="post-thumb thumb-overlay img-hover-slide position-relative" style={{ backgroundImage: "url(/assets/imgs/news/news-11.jpg)" }}><a className="img-link" href="/single"></a> <span className="top-right-icon bg-info"><i className="elegant-icon icon_headphones"></i></span> <ul className="social-share"><li><a href="#"><i className="elegant-icon social_share"></i></a></li> <li><a className="fb" href="#" title="Share on Facebook" target="_blank"><i className="elegant-icon social_facebook"></i></a></li> <li><a className="tw" href="#" target="_blank" title="Tweet now"><i className="elegant-icon social_twitter"></i></a></li> <li><a className="pt" href="#" target="_blank" title="Pin it"><i className="elegant-icon social_pinterest"></i></a></li></ul></div>
						<div className="post-content p-30">
							<div className="entry-meta meta-0 font-small mb-10"><a href="/category"><span className="post-cat text-success">Lifestyle</span></a></div>
							<div className="d-flex post-card-content">
								<h5 className="post-title mb-20 font-weight-900"><a href="/single">We’ve Updated Our Travel Hacking Guide</a></h5>
								<div className="entry-meta meta-1 float-start font-x-small text-uppercase"><span className="post-on">15 Jun</span> <span className="time-reading has-dot">9 mins read</span> <span className="post-by has-dot">1.2k views</span></div>
							</div>
						</div>
					</div>
				</article>
			</div>
			<div className="row mt-50">
				<div className="col-12">
					<div className="pagination-area mb-30 wow fadeInUp animated">
						<nav aria-label="Page navigation example"><ul className="pagination justify-content-start"><li className="page-item"><a className="page-link" href="#"><i className="elegant-icon arrow_left"></i></a></li> <li className="page-item active"><a className="page-link" href="#">01</a></li> <li className="page-item"><a className="page-link" href="#">02</a></li> <li className="page-item"><a className="page-link" href="#">03</a></li> <li className="page-item"><a className="page-link" href="#">04</a></li> <li className="page-item"><a className="page-link" href="#"><i className="elegant-icon arrow_right"></i></a></li></ul></nav>
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
