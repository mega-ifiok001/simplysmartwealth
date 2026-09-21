"use client";

import Link from "next/link";
import { useUI } from "@/components/ClientLayout";

const TOPICS = [
  { name: "Budgeting", slug: "budgeting" },
  { name: "Saving", slug: "saving" },
  { name: "Making Money Online", slug: "making-money-online" },
  { name: "Side Hustles", slug: "side-hustles" },
  { name: "Investing", slug: "investing" },
  { name: "Debt & Credit", slug: "debt-credit" },
];

function toggleSearch() {
  document.body.classList.toggle("open-search-form");
  document.querySelectorAll(".mega-menu-item").forEach((el) => el.classList.remove("open"));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function toggleTheme(e: React.MouseEvent) {
  e.preventDefault();
  const dark = document.body.classList.toggle("dark");
  const btn = document.querySelector(".dark-light-mode");
  if (btn) btn.classList.toggle("dark", dark);
  localStorage.setItem("theme", dark ? "dark" : "light");
}

function openSidebar() {
  document.body.classList.add("canvas-opened");
}

export default function Header({ siteName = "Simply Smart Wealth" }: { siteName?: string }) {
  const { scrolled } = useUI();
  const [firstWord, ...rest] = siteName.split(" ");
  const brandRest = rest.join(" ");
  return (
<header className="main-header header-style-1 font-heading">
	<div className="header-top">
		<div className="container">
			<div className="row pt-20 pb-20 align-items-center">
				<div className="col-md-3 col-xs-6">
					<Link href="/" className="logo-text font-weight-900 font-large text-muted">
						{firstWord}{" "}<span className="text-primary">{brandRest}</span>
					</Link>
				</div>
				<div className="col-md-9 col-xs-6 text-end header-top-right">
					<ul className="list-inline nav-topbar d-none d-md-inline">
						<li className="list-inline-item"><Link href="/login"><i className="elegant-icon icon_profile mr-5"></i>Sign in</Link></li>
						<li className="list-inline-item"><Link href="/register"><i className="elegant-icon icon_plus mr-5"></i>Register</Link></li>
					</ul>
					<span className="vertical-divider mr-20 ml-20 d-none d-md-inline"></span>
					<button className="search-icon d-none d-md-inline" onClick={toggleSearch} aria-label="Search">
						<span className="mr-15 text-muted font-small"><i className="elegant-icon icon_search mr-5"></i>Search</span>
					</button>
					<div className="dark-light-mode-cover">
						<a className="dark-light-mode" href="#" onClick={toggleTheme} aria-label="Toggle dark mode"></a>
					</div>
					<Link className="btn btn-radius bg-primary text-white ml-15 font-small box-shadow" href="/account">Your account</Link>
				</div>
			</div>
		</div>
	</div>
	<div className={`header-sticky${scrolled ? " sticky-bar" : ""}`}>
		<div className="container align-self-center position-relative">
			<div className="mobile_menu d-lg-none d-block"></div>
			<div className="main-nav d-none d-lg-block float-start">
				<nav aria-label="Main">
					<ul className="main-menu d-none d-lg-inline font-small">
						<li><Link href="/"><i className="elegant-icon icon_house_alt mr-5"></i> Home</Link></li>
						<li className="menu-item-has-children">
							<a href="/category">Topics <i className="elegant-icon arrow_down ml-5"></i></a>
							<ul className="sub-menu text-muted font-small">
								{TOPICS.map((topic) => (
									<li key={topic.slug}><Link href={`/category/${topic.slug}`}>{topic.name}</Link></li>
								))}
							</ul>
						</li>
						<li><Link href="/about">About</Link></li>
						<li><Link href="/contact">Contact</Link></li>
					</ul>
				</nav>
			</div>
			<div className="float-end header-tools text-muted font-small">
				<div className="off-canvas-toggle-cover d-inline-block">
					<div className="off-canvas-toggle hidden d-inline-block" id="off-canvas-toggle" onClick={openSidebar} role="button" aria-label="Open menu"><span></span></div>
				</div>
			</div>
			<div className="clearfix"></div>
		</div>
	</div>
</header>
  );
}