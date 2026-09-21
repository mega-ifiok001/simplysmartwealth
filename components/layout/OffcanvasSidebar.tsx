"use client";

import Link from "next/link";

function closeSidebar() {
  document.body.classList.remove("canvas-opened");
}

const TOPICS = [
  { name: "Budgeting", slug: "budgeting" },
  { name: "Saving", slug: "saving" },
  { name: "Making Money Online", slug: "making-money-online" },
  { name: "Side Hustles", slug: "side-hustles" },
  { name: "Investing", slug: "investing" },
  { name: "Debt & Credit", slug: "debt-credit" },
];

export default function OffcanvasSidebar() {
  return (
<aside id="sidebar-wrapper" className="custom-scrollbar offcanvas-sidebar">
	<button className="off-canvas-close" onClick={closeSidebar} aria-label="Close menu"><i className="elegant-icon icon_close"></i></button>
	<div className="sidebar-inner">
		<div className="sidebar-widget widget_categories mb-50 mt-30">
			<div className="widget-header-2 position-relative"><h5 className="mt-5 mb-15">Browse topics</h5></div>
			<div className="widget_nav_menu">
				<ul>
					<li className="cat-item"><Link href="/">Home</Link></li>
					{TOPICS.map((topic) => (
						<li className="cat-item" key={topic.slug}><Link href={`/category/${topic.slug}`}>{topic.name}</Link></li>
					))}
					<li className="cat-item"><Link href="/about">About</Link></li>
					<li className="cat-item"><Link href="/contact">Contact</Link></li>
				</ul>
			</div>
		</div>
		<div className="sidebar-widget mb-50">
			<div className="widget-header-2 position-relative mb-30"><h5 className="mt-5 mb-30">Your account</h5></div>
			<div className="widget_nav_menu">
				<ul>
					<li className="cat-item"><Link href="/login">Sign in</Link></li>
					<li className="cat-item"><Link href="/register">Register</Link></li>
					<li className="cat-item"><Link href="/account">Your account</Link></li>
				</ul>
			</div>
		</div>
	</div>
</aside>
  );
}