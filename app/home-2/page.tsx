import Behaviors from "@/components/Behaviors";
import Footer from "@/components/layout/Footer";
import SiteBottom from "@/components/layout/SiteBottom";

export const metadata = {
  title: "Simply Smart Wealth - Home2",
};

export default function Home2Page() {
  return (
    <>
<main>
	<div className="featured-slider-2">
		<div className="featured-slider-2-items">
			<div className="slider-single">
				<div className="post-thumb position-relative">
					<div className="thumb-overlay position-relative" style={{ backgroundImage: "url(/assets/imgs/news/news-16.jpg)" }}>
						<div className="post-content-overlay">
							<div className="container">
								<div className="entry-meta meta-0 font-small mb-20"><a href="/category" tabIndex={0}><span className="post-cat text-info text-uppercase">Travel</span></a> <a href="/category" tabIndex={0}><span className="post-cat text-warning text-uppercase">Animal</span></a></div>
								<h1 className="post-title mb-20 font-weight-900 text-white"><a className="text-white" href="/single" tabIndex={0}>How to Visit Bali's Monkey Forest</a></h1>
								<div className="entry-meta meta-1 font-small text-white mt-10 pr-5 pl-5"><span className="post-on">26 August 2026</span> <span className="hit-count has-dot">18k Views</span></div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="slider-single">
				<div className="post-thumb position-relative">
					<div className="thumb-overlay position-relative" style={{ backgroundImage: "url(/assets/imgs/news/news-17.jpg)" }}>
						<div className="post-content-overlay">
							<div className="container">
								<div className="entry-meta meta-0 font-small mb-20"><a href="/category" tabIndex={0}><span className="post-cat text-info text-uppercase">Lifestyle</span></a> <a href="/category" tabIndex={0}><span className="post-cat text-warning text-uppercase">Destinations</span></a></div>
								<h1 className="post-title mb-20 font-weight-900 text-white"><a className="text-white" href="/single" tabIndex={0}>Abstract Australia from Above</a></h1>
								<div className="entry-meta meta-1 font-small text-white mt-10 pr-5 pl-5"><span className="post-on">15 September 2026</span> <span className="hit-count has-dot">23k Views</span></div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="slider-single">
				<div className="post-thumb position-relative">
					<div className="thumb-overlay position-relative" style={{ backgroundImage: "url(/assets/imgs/news/news-18.jpg)" }}>
						<div className="post-content-overlay">
							<div className="container">
								<div className="entry-meta meta-0 font-small mb-20"><a href="/category" tabIndex={0}><span className="post-cat text-warning text-uppercase">Travel Tips</span></a></div>
								<h1 className="post-title mb-20 font-weight-900 text-white"><a className="text-white" href="/single" tabIndex={0}>Tips for Scuba Diving the Great Barrier Reef</a></h1>
								<div className="entry-meta meta-1 font-small text-white mt-10 pr-5 pl-5"><span className="post-on">15 September 2026</span> <span className="hit-count has-dot">17k Views</span></div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="slider-single">
				<div className="post-thumb position-relative">
					<div className="thumb-overlay position-relative" style={{ backgroundImage: "url(/assets/imgs/news/news-19.jpg)" }}>
						<div className="post-content-overlay">
							<div className="container">
								<div className="entry-meta meta-0 font-small mb-20"><a href="/category" tabIndex={0}><span className="post-cat text-info text-uppercase">Hotel</span></a> <a href="/category" tabIndex={0}><span className="post-cat text-warning text-uppercase">Healthy</span></a></div>
								<h1 className="post-title mb-20 font-weight-900 text-white"><a className="text-white" href="/single" tabIndex={0}>Staying at the Hilton Seychelles Northolme Resort &amp; Spa</a></h1>
								<div className="entry-meta meta-1 font-small text-white mt-10 pr-5 pl-5"><span className="post-on">22 September 2026</span> <span className="hit-count has-dot">16k Views</span></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div className="container position-relative">
			<div className="arrow-cover color-white"></div>
			<div className="featured-slider-2-nav-cover">
				<div className="featured-slider-2-nav">
					<div className="slider-post-thumb mr-15 mt-20 position-relative">
						<div className="d-flex hover-up-2 transition-normal">
							<div className="post-thumb post-thumb-80 d-flex mr-15 border-radius-5"><img className="border-radius-5" src="/assets/imgs/news/thumb-16.jpg" alt="" /></div>
							<div className="post-content media-body text-white">
								<h5 className="post-title mb-15 text-limit-2-row">How to Visit Bali's Monkey Forest</h5>
								<div className="entry-meta meta-1 float-start font-x-small text-uppercase"><span className="post-on text-white">26 Aug</span> <span className="post-by has-dot text-white">18k views</span></div>
							</div>
						</div>
					</div>
					<div className="slider-post-thumb mr-15 mt-20 position-relative">
						<div className="d-flex hover-up-2 transition-normal">
							<div className="post-thumb post-thumb-80 d-flex mr-15 border-radius-5"><img className="border-radius-5" src="/assets/imgs/news/thumb-17.jpg" alt="" /></div>
							<div className="post-content media-body text-white">
								<h5 className="post-title mb-15 text-limit-2-row">Abstract Australia from Above</h5>
								<div className="entry-meta meta-1 float-start font-x-small text-uppercase"><span className="post-on text-white">15 Sep</span> <span className="post-by has-dot text-white">23k views</span></div>
							</div>
						</div>
					</div>
					<div className="slider-post-thumb mr-15 mt-20 position-relative">
						<div className="d-flex hover-up-2 transition-normal">
							<div className="post-thumb post-thumb-80 d-flex mr-15 border-radius-5"><img className="border-radius-5" src="/assets/imgs/news/thumb-18.jpg" alt="" /></div>
							<div className="post-content media-body text-white">
								<h5 className="post-title mb-15 text-limit-2-row">Tips for Scuba Diving the Great Barrier Reef</h5>
								<div className="entry-meta meta-1 float-start font-x-small text-uppercase"><span className="post-on text-white">18 Sep</span> <span className="post-by has-dot text-white">17k views</span></div>
							</div>
						</div>
					</div>
					<div className="slider-post-thumb mr-15 mt-20 position-relative">
						<div className="d-flex hover-up-2 transition-normal">
							<div className="post-thumb post-thumb-80 d-flex mr-15 border-radius-5"><img className="border-radius-5" src="/assets/imgs/news/thumb-19.jpg" alt="" /></div>
							<div className="post-content media-body text-white">
								<h5 className="post-title mb-15 text-limit-2-row">Staying at the Hilton Seychelles Northolme Resort &amp; Spa</h5>
								<div className="entry-meta meta-1 float-start font-x-small text-uppercase"><span className="post-on text-white">22 Sep</span> <span className="post-by has-dot text-white">16k views</span></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div className="container">
		<div className="hot-tags pt-30 pb-30 font-small align-self-center">
			<div className="widget-header-3">
				<div className="row align-self-center">
					<div className="col-md-4 align-self-center"><h5 className="widget-title">Featured posts</h5></div>
					<div className="col-md-8 text-md-end font-small align-self-center"><p className="d-inline-block mr-5 mb-0"><i className="elegant-icon  icon_tag_alt mr-5 text-muted"></i>Hot tags:</p> <ul className="list-inline d-inline-block tags"><li className="list-inline-item"><a href="#"># Covid-19</a></li> <li className="list-inline-item"><a href="#"># Inspiration</a></li> <li className="list-inline-item"><a href="#"># Work online</a></li> <li className="list-inline-item"><a href="#"># Stay home</a></li></ul></div>
				</div>
			</div>
		</div>
		<div className="loop-grid mb-30">
			<div className="row">
				<div className="col-lg-8 mb-30">
					<div className="carausel-post-1 hover-up border-radius-10 overflow-hidden transition-normal position-relative wow fadeInUp animated">
						<div className="arrow-cover"></div>
						<div className="slide-fade">
							<div className="position-relative post-thumb">
								<div className="thumb-overlay img-hover-slide position-relative" style={{ backgroundImage: "url(/assets/imgs/news/news-4.jpg)" }}>
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
								<div className="thumb-overlay img-hover-slide position-relative" style={{ backgroundImage: "url(/assets/imgs/news/news-6.jpg)" }}>
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
						<div className="post-thumb thumb-overlay img-hover-slide position-relative" style={{ backgroundImage: "url(/assets/imgs/news/news-7.jpg)" }}><a className="img-link" href="/single"></a> <ul className="social-share"><li><a href="#"><i className="elegant-icon social_share"></i></a></li> <li><a className="fb" href="#" title="Share on Facebook" target="_blank"><i className="elegant-icon social_facebook"></i></a></li> <li><a className="tw" href="#" target="_blank" title="Tweet now"><i className="elegant-icon social_twitter"></i></a></li> <li><a className="pt" href="#" target="_blank" title="Pin it"><i className="elegant-icon social_pinterest"></i></a></li></ul></div>
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
						<div className="post-thumb thumb-overlay img-hover-slide position-relative" style={{ backgroundImage: "url(/assets/imgs/news/news-9.jpg)" }}><a className="img-link" href="/single"></a> <ul className="social-share"><li><a href="#"><i className="elegant-icon social_share"></i></a></li> <li><a className="fb" href="#" title="Share on Facebook" target="_blank"><i className="elegant-icon social_facebook"></i></a></li> <li><a className="tw" href="#" target="_blank" title="Tweet now"><i className="elegant-icon social_twitter"></i></a></li> <li><a className="pt" href="#" target="_blank" title="Pin it"><i className="elegant-icon social_pinterest"></i></a></li></ul></div>
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
						<div className="post-thumb thumb-overlay img-hover-slide position-relative" style={{ backgroundImage: "url(/assets/imgs/news/news-11.jpg)" }}><a className="img-link" href="/single"></a> <span className="top-right-icon bg-info"><i className="elegant-icon icon_headphones"></i></span> <ul className="social-share"><li><a href="#"><i className="elegant-icon social_share"></i></a></li> <li><a className="fb" href="#" title="Share on Facebook" target="_blank"><i className="elegant-icon social_facebook"></i></a></li> <li><a className="tw" href="#" target="_blank" title="Tweet now"><i className="elegant-icon social_twitter"></i></a></li> <li><a className="pt" href="#" target="_blank" title="Pin it"><i className="elegant-icon social_pinterest"></i></a></li></ul></div>
						<div className="post-content p-30">
							<div className="entry-meta meta-0 font-small mb-10"><a href="/category"><span className="post-cat text-success">Lifestyle</span></a></div>
							<div className="d-flex post-card-content">
								<h5 className="post-title mb-20 font-weight-900"><a href="/single">When Two Wheels Are Better Than Four</a></h5>
								<div className="entry-meta meta-1 float-start font-x-small text-uppercase"><span className="post-on">15 Jun</span> <span className="time-reading has-dot">9 mins read</span> <span className="post-by has-dot">1.2k views</span></div>
							</div>
						</div>
					</div>
				</article>
			</div>
		</div>
	</div>
	<div className="bg-grey pt-50 pb-50">
		<div className="container">
			<div className="row">
				<div className="col-lg-8">
					<div className="post-module-2">
						<div className="widget-header-1 position-relative mb-30  wow fadeInUp animated"><h5 className="mt-5 mb-30">Travel tips</h5></div>
						<div className="loop-list loop-list-style-1">
							<div className="row">
								<article className="col-md-6 mb-40 wow fadeInUp  animated">
									<div className="post-card-1 border-radius-10 hover-up">
										<div className="post-thumb thumb-overlay img-hover-slide position-relative" style={{ backgroundImage: "url(/assets/imgs/news/news-6.jpg)" }}><a className="img-link" href="/single"></a> <ul className="social-share"><li><a href="#"><i className="elegant-icon social_share"></i></a></li> <li><a className="fb" href="#" title="Share on Facebook" target="_blank"><i className="elegant-icon social_facebook"></i></a></li> <li><a className="tw" href="#" target="_blank" title="Tweet now"><i className="elegant-icon social_twitter"></i></a></li> <li><a className="pt" href="#" target="_blank" title="Pin it"><i className="elegant-icon social_pinterest"></i></a></li></ul></div>
										<div className="post-content p-30">
											<div className="entry-meta meta-0 font-small mb-10"><a href="/category"><span className="post-cat text-info">Artists</span></a> <a href="/category"><span className="post-cat text-success">Film</span></a></div>
											<div className="d-flex post-card-content">
												<h5 className="post-title mb-20 font-weight-900"><a href="/single">Easy Ways to Use Alternatives to Plastic</a></h5>
												<div className="post-excerpt mb-25 font-small text-muted"><p>Graduating from a top accelerator or incubator can be as career-defining for a startup founder as an elite university diploma. The intensive programmes, which…</p></div>
												<div className="entry-meta meta-1 float-start font-x-small text-uppercase"><span className="post-on">27 August</span> <span className="time-reading has-dot">12 mins read</span> <span className="post-by has-dot">23k views</span></div>
											</div>
										</div>
									</div>
								</article>
								<article className="col-md-6 mb-40 wow fadeInUp  animated">
									<div className="post-card-1 border-radius-10 hover-up">
										<div className="post-thumb thumb-overlay img-hover-slide position-relative" style={{ backgroundImage: "url(/assets/imgs/news/news-8.jpg)" }}><a className="img-link" href="/single"></a> <ul className="social-share"><li><a href="#"><i className="elegant-icon social_share"></i></a></li> <li><a className="fb" href="#" title="Share on Facebook" target="_blank"><i className="elegant-icon social_facebook"></i></a></li> <li><a className="tw" href="#" target="_blank" title="Tweet now"><i className="elegant-icon social_twitter"></i></a></li> <li><a className="pt" href="#" target="_blank" title="Pin it"><i className="elegant-icon social_pinterest"></i></a></li></ul></div>
										<div className="post-content p-30">
											<div className="entry-meta meta-0 font-small mb-10"><a href="/category"><span className="post-cat">Fashion</span></a></div>
											<div className="d-flex post-card-content">
												<h5 className="post-title mb-20 font-weight-900"><a href="/single">Tips for Growing Healthy, Longer Hair</a></h5>
												<div className="post-excerpt mb-25 font-small text-muted"><p>Proin vitae placerat quam. Ut sodales eleifend urna, in condimentum tortor ultricies eu. Nunc auctor iaculis dolorProin vitae placerat quam. Proin vitae placerat quam.</p></div>
												<div className="entry-meta meta-1 float-start font-x-small text-uppercase"><span className="post-on">12 August</span> <span className="time-reading has-dot">6 mins read</span> <span className="post-by has-dot">3k views</span></div>
											</div>
										</div>
									</div>
								</article>
								<article className="col-md-6 mb-40 wow fadeInUp  animated">
									<div className="post-card-1 border-radius-10 hover-up">
										<div className="post-thumb thumb-overlay img-hover-slide position-relative" style={{ backgroundImage: "url(/assets/imgs/news/news-10.jpg)" }}><a className="img-link" href="/single"></a> <span className="top-right-icon bg-secondary"><i className="elegant-icon icon_heart_alt"></i></span> <ul className="social-share"><li><a href="#"><i className="elegant-icon social_share"></i></a></li> <li><a className="fb" href="#" title="Share on Facebook" target="_blank"><i className="elegant-icon social_facebook"></i></a></li> <li><a className="tw" href="#" target="_blank" title="Tweet now"><i className="elegant-icon social_twitter"></i></a></li> <li><a className="pt" href="#" target="_blank" title="Pin it"><i className="elegant-icon social_pinterest"></i></a></li></ul></div>
										<div className="post-content p-30">
											<div className="entry-meta meta-0 font-small mb-10"><a href="/category"><span className="post-cat text-success">Lifestyle</span></a></div>
											<div className="d-flex post-card-content">
												<h5 className="post-title mb-20 font-weight-900"><a href="/single">Project Ideas Around the House</a></h5>
												<div className="post-excerpt mb-25 font-small text-muted"><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tempor condimentum metus non tempor. Maecenas non augue aliquam, facilisis lectus quis, lacinia risus.</p></div>
												<div className="entry-meta meta-1 float-start font-x-small text-uppercase"><span className="post-on">27 August</span> <span className="time-reading has-dot">12 mins read</span> <span className="post-by has-dot">23k views</span></div>
											</div>
										</div>
									</div>
								</article>
								<article className="col-md-6 mb-40 wow fadeInUp  animated">
									<div className="post-card-1 border-radius-10 hover-up">
										<div className="post-thumb thumb-overlay img-hover-slide position-relative" style={{ backgroundImage: "url(/assets/imgs/news/news-12.jpg)" }}><a className="img-link" href="/single"></a> <ul className="social-share"><li><a href="#"><i className="elegant-icon social_share"></i></a></li> <li><a className="fb" href="#" title="Share on Facebook" target="_blank"><i className="elegant-icon social_facebook"></i></a></li> <li><a className="tw" href="#" target="_blank" title="Tweet now"><i className="elegant-icon social_twitter"></i></a></li> <li><a className="pt" href="#" target="_blank" title="Pin it"><i className="elegant-icon social_pinterest"></i></a></li></ul></div>
										<div className="post-content p-30">
											<div className="entry-meta meta-0 font-small mb-10"><a href="/category"><span className="post-cat text-danger">Hotels</span></a></div>
											<div className="d-flex post-card-content">
												<h5 className="post-title mb-20 font-weight-900"><a href="/single">How to Give Yourself a Spa Day from Home</a></h5>
												<div className="post-excerpt mb-25 font-small text-muted"><p>Graduating from a top accelerator or incubator can be as career-defining for a startup founder as an elite university diploma. The intensive programmes, which…</p></div>
												<div className="entry-meta meta-1 float-start font-x-small text-uppercase"><span className="post-on">18 August</span> <span className="time-reading has-dot">14 mins read</span> <span className="post-by has-dot">25k views</span></div>
											</div>
										</div>
									</div>
								</article>
							</div>
						</div>
					</div>
					<div className="post-module-3">
						<div className="widget-header-1 position-relative mb-30"><h5 className="mt-5 mb-30">Latest posts</h5></div>
						<div className="loop-list loop-list-style-1">
							<article className="hover-up-2 transition-normal wow fadeInUp animated">
								<div className="row mb-40 list-style-2">
									<div className="col-md-4">
										<div className="post-thumb position-relative border-radius-5">
											<div className="img-hover-slide border-radius-5 position-relative" style={{ backgroundImage: "url(/assets/imgs/news/news-13.jpg)" }}><a className="img-link" href="/single"></a></div>
											<ul className="social-share"><li><a href="#"><i className="elegant-icon social_share"></i></a></li> <li><a className="fb" href="#" title="Share on Facebook" target="_blank"><i className="elegant-icon social_facebook"></i></a></li> <li><a className="tw" href="#" target="_blank" title="Tweet now"><i className="elegant-icon social_twitter"></i></a></li> <li><a className="pt" href="#" target="_blank" title="Pin it"><i className="elegant-icon social_pinterest"></i></a></li></ul>
										</div>
									</div>
									<div className="col-md-8 align-self-center">
										<div className="post-content">
											<div className="entry-meta meta-0 font-small mb-10"><a href="/category"><span className="post-cat text-primary">Food</span></a></div>
											<h5 className="post-title font-weight-900 mb-20"><a href="/single">Helpful Tips for Working from Home as a Freelancer</a> <span className="post-format-icon"><i className="elegant-icon icon_star_alt"></i></span></h5>
											<div className="entry-meta meta-1 float-start font-x-small text-uppercase"><span className="post-on">7 August</span> <span className="time-reading has-dot">11 mins read</span> <span className="post-by has-dot">3k views</span></div>
										</div>
									</div>
								</div>
							</article>
							<article className="hover-up-2 transition-normal wow fadeInUp animated">
								<div className="row mb-40 list-style-2">
									<div className="col-md-4">
										<div className="post-thumb position-relative border-radius-5">
											<div className="img-hover-slide border-radius-5 position-relative" style={{ backgroundImage: "url(/assets/imgs/news/news-4.jpg)" }}><a className="img-link" href="/single"></a></div>
											<ul className="social-share"><li><a href="#"><i className="elegant-icon social_share"></i></a></li> <li><a className="fb" href="#" title="Share on Facebook" target="_blank"><i className="elegant-icon social_facebook"></i></a></li> <li><a className="tw" href="#" target="_blank" title="Tweet now"><i className="elegant-icon social_twitter"></i></a></li> <li><a className="pt" href="#" target="_blank" title="Pin it"><i className="elegant-icon social_pinterest"></i></a></li></ul>
										</div>
									</div>
									<div className="col-md-8 align-self-center">
										<div className="post-content">
											<div className="entry-meta meta-0 font-small mb-10"><a href="/category"><span className="post-cat text-success">Cooking</span></a></div>
											<h5 className="post-title font-weight-900 mb-20"><a href="/single">10 Easy Ways to Be Environmentally Conscious At Home</a></h5>
											<div className="entry-meta meta-1 float-start font-x-small text-uppercase"><span className="post-on">27 Sep</span> <span className="time-reading has-dot">10 mins read</span> <span className="post-by has-dot">22k views</span></div>
										</div>
									</div>
								</div>
							</article>
							<article className="hover-up-2 transition-normal wow fadeInUp animated">
								<div className="row mb-40 list-style-2">
									<div className="col-md-4">
										<div className="post-thumb position-relative border-radius-5">
											<div className="img-hover-slide border-radius-5 position-relative" style={{ backgroundImage: "url(/assets/imgs/news/news-2.jpg)" }}><a className="img-link" href="/single"></a></div>
											<ul className="social-share"><li><a href="#"><i className="elegant-icon social_share"></i></a></li> <li><a className="fb" href="#" title="Share on Facebook" target="_blank"><i className="elegant-icon social_facebook"></i></a></li> <li><a className="tw" href="#" target="_blank" title="Tweet now"><i className="elegant-icon social_twitter"></i></a></li> <li><a className="pt" href="#" target="_blank" title="Pin it"><i className="elegant-icon social_pinterest"></i></a></li></ul>
										</div>
									</div>
									<div className="col-md-8 align-self-center">
										<div className="post-content">
											<div className="entry-meta meta-0 font-small mb-10"><a href="/category"><span className="post-cat text-warning">Cooking</span></a></div>
											<h5 className="post-title font-weight-900 mb-20"><a href="/single">My Favorite Comfies to Lounge in At Home</a></h5>
											<div className="entry-meta meta-1 float-start font-x-small text-uppercase"><span className="post-on">7 August</span> <span className="time-reading has-dot">9 mins read</span> <span className="post-by has-dot">12k views</span></div>
										</div>
									</div>
								</div>
							</article>
							<article className="hover-up-2 transition-normal wow fadeInUp animated">
								<div className="row mb-40 list-style-2">
									<div className="col-md-4">
										<div className="post-thumb position-relative border-radius-5">
											<div className="img-hover-slide border-radius-5 position-relative" style={{ backgroundImage: "url(/assets/imgs/news/news-3.jpg)" }}><a className="img-link" href="/single"></a></div>
											<ul className="social-share"><li><a href="#"><i className="elegant-icon social_share"></i></a></li> <li><a className="fb" href="#" title="Share on Facebook" target="_blank"><i className="elegant-icon social_facebook"></i></a></li> <li><a className="tw" href="#" target="_blank" title="Tweet now"><i className="elegant-icon social_twitter"></i></a></li> <li><a className="pt" href="#" target="_blank" title="Pin it"><i className="elegant-icon social_pinterest"></i></a></li></ul>
										</div>
									</div>
									<div className="col-md-8 align-self-center">
										<div className="post-content">
											<div className="entry-meta meta-0 font-small mb-10"><a href="/category"><span className="post-cat text-danger">Travel</span></a></div>
											<h5 className="post-title font-weight-900 mb-20"><a href="/single">How to Give Your Space a Parisian-Inspired Makeover</a></h5>
											<div className="entry-meta meta-1 float-start font-x-small text-uppercase"><span className="post-on">27 August</span> <span className="time-reading has-dot">12 mins read</span> <span className="post-by has-dot">23k views</span></div>
										</div>
									</div>
								</div>
							</article>
						</div>
					</div>
					<div className="pagination-area mb-30 wow fadeInUp animated">
						<nav aria-label="Page navigation example"><ul className="pagination justify-content-start"><li className="page-item"><a className="page-link" href="#"><i className="elegant-icon arrow_left"></i></a></li> <li className="page-item active"><a className="page-link" href="#">01</a></li> <li className="page-item"><a className="page-link" href="#">02</a></li> <li className="page-item"><a className="page-link" href="#">03</a></li> <li className="page-item"><a className="page-link" href="#">04</a></li> <li className="page-item"><a className="page-link" href="#"><i className="elegant-icon arrow_right"></i></a></li></ul></nav>
					</div>
				</div>
				<div className="col-lg-4">
					<div className="widget-area">
						<div className="sidebar-widget widget-about mb-50 pt-30 pr-30 pb-30 pl-30 bg-white border-radius-5 has-border  wow fadeInUp animated"><img className="about-author-img mb-25" src="/assets/imgs/authors/author.jpg" alt="" /> <h5 className="mb-20">Hello, I'm Steven</h5> <p className="font-medium text-muted">Hi, I’m Stenven, a Florida native, who left my career in corporate wealth management six years ago to embark on a summer of soul searching that would change the course of my life forever.</p> <strong>Follow me:</strong> <ul className="header-social-network d-inline-block list-inline color-white mb-20"><li className="list-inline-item"><a className="fb" href="#" target="_blank" title="Facebook"><i className="elegant-icon social_facebook"></i></a></li> <li className="list-inline-item"><a className="tw" href="#" target="_blank" title="Tweet now"><i className="elegant-icon social_twitter"></i></a></li> <li className="list-inline-item"><a className="pt" href="#" target="_blank" title="Pin it"><i className="elegant-icon social_pinterest"></i></a></li></ul></div>
						<div className="sidebar-widget widget-latest-posts mb-50 wow fadeInUp animated">
							<div className="widget-header-1 position-relative mb-30"><h5 className="mt-5 mb-30">Most popular</h5></div>
							<div className="post-block-list post-module-1"><ul className="list-post"><li className="mb-30 wow fadeInUp animated">
	<div className="d-flex bg-white has-border p-25 hover-up transition-normal border-radius-5">
		<div className="post-content media-body">
			<h6 className="post-title mb-15 text-limit-2-row font-medium"><a href="/single">Spending Some Quality Time with Kids? It’s Possible</a></h6>
			<div className="entry-meta meta-1 float-start font-x-small text-uppercase"><span className="post-on">05 August</span> <span className="post-by has-dot">150 views</span></div>
		</div>
		<div className="post-thumb post-thumb-80 d-flex ml-15 border-radius-5 img-hover-scale overflow-hidden"><a className="color-white" href="/single"><img src="/assets/imgs/news/thumb-6.jpg" alt="" /></a></div>
	</div>
</li> <li className="mb-30 wow fadeInUp animated">
	<div className="d-flex bg-white has-border p-25 hover-up transition-normal border-radius-5">
		<div className="post-content media-body">
			<h6 className="post-title mb-15 text-limit-2-row font-medium"><a href="/single">Relationship Podcasts are Having “That” Talk</a></h6>
			<div className="entry-meta meta-1 float-start font-x-small text-uppercase"><span className="post-on">12 August</span> <span className="post-by has-dot">6k views</span></div>
		</div>
		<div className="post-thumb post-thumb-80 d-flex ml-15 border-radius-5 img-hover-scale overflow-hidden"><a className="color-white" href="/single"><img src="/assets/imgs/news/thumb-7.jpg" alt="" /></a></div>
	</div>
</li> <li className="mb-30 wow fadeInUp animated">
	<div className="d-flex bg-white has-border p-25 hover-up transition-normal border-radius-5">
		<div className="post-content media-body">
			<h6 className="post-title mb-15 text-limit-2-row font-medium"><a href="/single">Here’s How to Get the Best Sleep at Night</a></h6>
			<div className="entry-meta meta-1 float-start font-x-small text-uppercase"><span className="post-on">15 August</span> <span className="post-by has-dot">16k views</span></div>
		</div>
		<div className="post-thumb post-thumb-80 d-flex ml-15 border-radius-5 img-hover-scale overflow-hidden"><a className="color-white" href="/single"><img src="/assets/imgs/news/thumb-2.jpg" alt="" /></a></div>
	</div>
</li> <li className=" wow fadeInUp animated">
	<div className="d-flex bg-white has-border p-25 hover-up transition-normal border-radius-5">
		<div className="post-content media-body">
			<h6 className="post-title mb-15 text-limit-2-row font-medium"><a href="/single">America’s Governors Get Tested for a Virus That Is Testing Them</a></h6>
			<div className="entry-meta meta-1 float-start font-x-small text-uppercase"><span className="post-on">12 August</span> <span className="post-by has-dot">3k views</span></div>
		</div>
		<div className="post-thumb post-thumb-80 d-flex ml-15 border-radius-5 img-hover-scale overflow-hidden"><a className="color-white" href="/single"><img src="/assets/imgs/news/thumb-3.jpg" alt="" /></a></div>
	</div>
</li></ul></div>
						</div>
						<div className="sidebar-widget widget-latest-posts mb-50 wow fadeInUp animated">
							<div className="widget-header-1 position-relative mb-30"><h5 className="mt-5 mb-30">Last comments</h5></div>
							<div className="post-block-list post-module-2"><ul className="list-post"><li className="mb-30 wow fadeInUp animated">
	<div className="d-flex bg-white has-border p-25 hover-up transition-normal border-radius-5">
		<div className="post-thumb post-thumb-64 d-flex mr-15 border-radius-5 img-hover-scale overflow-hidden"><a className="color-white" href="/single"><img src="/assets/imgs/authors/author-2.jpg" alt="" /></a></div>
		<div className="post-content media-body"><p className="mb-10"><a href="/author"><strong>David</strong></a> <span className="ml-15 font-small text-muted has-dot">16 Jan 2026</span></p> <p className="text-muted font-small">A writer is someone for whom writing is more difficult than...</p></div>
	</div>
</li> <li className="mb-30 wow fadeInUp animated">
	<div className="d-flex bg-white has-border p-25 hover-up transition-normal border-radius-5">
		<div className="post-thumb post-thumb-64 d-flex mr-15 border-radius-5 img-hover-scale overflow-hidden"><a className="color-white" href="/single"><img src="/assets/imgs/authors/author-3.jpg" alt="" /></a></div>
		<div className="post-content media-body"><p className="mb-10"><a href="/author"><strong>Kokawa</strong></a> <span className="ml-15 font-small text-muted has-dot">12 Feb 2026</span></p> <p className="text-muted font-small">Striking pewter studded epaulettes silver zips</p></div>
	</div>
</li> <li className="wow fadeInUp animated">
	<div className="d-flex bg-white has-border p-25 hover-up transition-normal border-radius-5">
		<div className="post-thumb post-thumb-64 d-flex mr-15 border-radius-5 img-hover-scale overflow-hidden"><a className="color-white" href="/single"><img src="/assets/imgs/news/thumb-1.jpg" alt="" /></a></div>
		<div className="post-content media-body"><p className="mb-10"><a href="/author"><strong>Tsukasi</strong></a> <span className="ml-15 font-small text-muted has-dot">18 May 2026</span></p> <p className="text-muted font-small">Workwear bow detailing a slingback buckle strap</p></div>
	</div>
</li></ul></div>
						</div>
						<div className="sidebar-widget widget_instagram wow fadeInUp animated">
							<div className="widget-header-1 position-relative mb-30"><h5 className="mt-5 mb-30">Instagram</h5></div>
							<div className="instagram-gellay"><ul className="insta-feed"><li><a href="/assets/imgs/news/thumb-1.jpg" className="play-video" data-animate="zoomIn" data-duration="1.5s" data-delay="0.1s"><img className="border-radius-5" src="/assets/imgs/news/thumb-1.jpg" alt="" /></a></li> <li><a href="/assets/imgs/news/thumb-2.jpg" className="play-video" data-animate="zoomIn" data-duration="1.5s" data-delay="0.1s"><img className="border-radius-5" src="/assets/imgs/news/thumb-2.jpg" alt="" /></a></li> <li><a href="/assets/imgs/news/thumb-3.jpg" className="play-video" data-animate="zoomIn" data-duration="1.5s" data-delay="0.1s"><img className="border-radius-5" src="/assets/imgs/news/thumb-3.jpg" alt="" /></a></li> <li><a href="/assets/imgs/news/thumb-1.jpg" className="play-video" data-animate="zoomIn" data-duration="1.5s" data-delay="0.1s"><img className="border-radius-5" src="/assets/imgs/news/thumb-4.jpg" alt="" /></a></li> <li><a href="/assets/imgs/news/thumb-2.jpg" className="play-video" data-animate="zoomIn" data-duration="1.5s" data-delay="0.1s"><img className="border-radius-5" src="/assets/imgs/news/thumb-5.jpg" alt="" /></a></li> <li><a href="/assets/imgs/news/thumb-3.jpg" className="play-video" data-animate="zoomIn" data-duration="1.5s" data-delay="0.1s"><img className="border-radius-5" src="/assets/imgs/news/thumb-6.jpg" alt="" /></a></li></ul></div>
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
