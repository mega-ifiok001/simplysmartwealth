"use client";

import { useUI } from "@/components/ClientLayout";

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

export default function Header() {
  const { scrolled } = useUI();
  return (
<header className="main-header header-style-1 font-heading">
	<div className="header-top">
		<div className="container">
			<div className="row pt-20 pb-20">
				<div className="col-md-3 col-xs-6"><a href="/"><img className="logo" src="/assets/imgs/theme/logo.png" alt="" /></a></div>
				<div className="col-md-9 col-xs-6 text-end header-top-right ">
					<ul className="list-inline nav-topbar d-none d-md-inline"><li className="list-inline-item menu-item-has-children"><a href="#">Layouts</a> <ul className="sub-menu font-small"><li className="menu-item-has-children"><a href="#">Pages</a> <ul className="sub-menu font-small"><li><a href="/about">About</a></li> <li><a href="/contact">Contact</a></li> <li><a href="/typography">Typography</a></li> <li><a href="/register">Register</a></li> <li><a href="/login">Login</a></li> <li><a href="/search">Search</a></li> <li><a href="/author">Author</a></li> <li><a href="/404">404 page</a></li></ul></li> <li className="menu-item-has-children"><a href="#">Category</a> <ul className="sub-menu font-small"><li><a href="/category-list">List layout</a></li> <li><a href="/category-grid">Grid layout</a></li> <li><a href="/category-masonry">Masonry layout</a></li> <li><a href="/category-big">Big layout</a></li></ul></li> <li className="menu-item-has-children"><a href="#">Single post</a> <ul className="sub-menu font-small"><li><a href="/single">Default</a></li> <li><a href="/single-2">Big image</a></li> <li><a href="/single-3">Left image</a></li> <li><a href="/single-4">With sidebar</a></li></ul></li></ul></li> <li className="list-inline-item"><a href="/login"><i className="elegant-icon icon_profile mr-5"></i>Sign in</a></li> <li className="list-inline-item"><a href="/register"><i className="elegant-icon icon_plus mr-5"></i>Register</a></li></ul>
					<span className="vertical-divider mr-20 ml-20 d-none d-md-inline"></span>
					<button className="search-icon d-none d-md-inline" onClick={toggleSearch} aria-label="Search"><span className="mr-15 text-muted font-small"><i className="elegant-icon icon_search mr-5"></i>Search</span></button>
					<div className="dark-light-mode-cover"><a className="dark-light-mode" href="#" onClick={toggleTheme} aria-label="Toggle dark mode"></a></div>
					<a className="btn btn-radius bg-primary text-white ml-15 font-small box-shadow" href="/account">Your account</a>
				</div>
			</div>
		</div>
	</div>
	<div className={`header-sticky${scrolled ? " sticky-bar" : ""}`}>
		<div className="container align-self-center position-relative">
			<div className="mobile_menu d-lg-none d-block"></div>
			<div className="main-nav d-none d-lg-block float-start">
				<nav><ul className="main-menu d-none d-lg-inline font-small"><li className="menu-item-has-children"><a href="/"><i className="elegant-icon icon_house_alt mr-5"></i> Home</a> <ul className="sub-menu text-muted font-small"><li><a href="/">Home default</a></li> <li><a href="/home-2">Homepage 2</a></li> <li><a href="/home-3">Homepage 3</a></li></ul></li> <li><a href="/category-list">Travel</a></li> <li className="current-item has-mega-menu"><a href="/category-list">Mega Menu</a> <ul className="mega-menu"><li className="sub-mega-menu sub-mega-menu-width-22"><a className="menu-title" href="#">Travel Blog</a> <ul><li><a href="/category-list">Destinations</a></li> <li><a href="/category-list">Tour Guides</a></li> <li><a href="/category-list">Travel Food</a></li> <li><a href="/category-list">Hotels Booking</a></li> <li><a href="/category-list">Transport Review</a></li> <li><a href="/category-list">Travel Healthy</a></li></ul></li> <li className="sub-mega-menu sub-mega-menu-width-22"><a className="menu-title" href="#">Fruit &amp; Vegetables</a> <ul><li><a href="/category-list">Meat &amp; Poultry</a></li> <li><a href="/category-list">Fresh Vegetables</a></li> <li><a href="/category-list">Herbs &amp; Seasonings</a></li> <li><a href="/category-list">Cuts &amp; Sprouts</a></li> <li><a href="/category-list">Exotic Fruits &amp; Veggies</a></li> <li><a href="/category-list">Packaged Produce</a></li></ul></li> <li className="sub-mega-menu sub-mega-menu-width-22"><a className="menu-title" href="#">Breakfast &amp; Dairy</a> <ul><li><a href="/category-list">Milk &amp; Flavoured Milk</a></li> <li><a href="/category-list">Butter and Margarine</a></li> <li><a href="/category-list">Eggs Substitutes</a></li> <li><a href="/category-list">Marmalades</a></li> <li><a href="/category-list">Sour Cream</a></li> <li><a href="/category-list">Cheese</a></li></ul></li> <li className="sub-mega-menu sub-mega-menu-width-22"><a className="menu-title" href="#">Meat &amp; Seafood</a> <ul><li><a href="/category-list">Breakfast Sausage</a></li> <li><a href="/category-list">Dinner Sausage</a></li> <li><a href="/category-list">Chicken</a></li> <li><a href="/category-list">Sliced Deli Meat</a></li> <li><a href="/category-list">Wild Caught Fillets</a></li> <li><a href="/category-list">Crab and Shellfish</a></li></ul></li></ul></li> <li><a href="/category-grid">Guides</a></li> <li><a href="/category-masonry">Food</a></li> <li><a href="/category-big">Hotels</a></li> <li><a href="/category">Review</a></li> <li><a href="/category">Healthy</a></li> <li><a href="/category">Lifestyle</a></li> <li><a href="/category">Blog</a></li></ul> <ul id="mobile-menu" className="d-block d-lg-none text-muted"><li className="menu-item-has-children"><a href="/">Home</a> <ul className="sub-menu text-muted font-small"><li><a href="/">Home default</a></li> <li><a href="/home-2">Homepage 2</a></li> <li><a href="/home-3">Homepage 3</a></li></ul></li> <li className="menu-item-has-children"><a href="#">Pages</a> <ul className="sub-menu font-small"><li><a href="/about">About</a></li> <li><a href="/contact">Contact</a></li> <li><a href="/typography">Typography</a></li> <li><a href="/register">Register</a></li> <li><a href="/login">Login</a></li> <li><a href="/search">Search</a></li> <li><a href="/author">Author</a></li> <li><a href="/404">404 page</a></li></ul></li> <li className="menu-item-has-children"><a href="#">Category</a> <ul className="sub-menu font-small"><li><a href="/category-list">List layout</a></li> <li><a href="/category-grid">Grid layout</a></li> <li><a href="/category-masonry">Masonry layout</a></li> <li><a href="/category-big">Big layout</a></li></ul></li> <li className="menu-item-has-children"><a href="#">Single post</a> <ul className="sub-menu font-small"><li><a href="/single">Default</a></li> <li><a href="/single-2">Big image</a></li> <li><a href="/single-3">Left image</a></li> <li><a href="/single-4">With sidebar</a></li></ul></li></ul></nav>
			</div>
			<div className="float-end header-tools text-muted font-small">
				<ul className="header-social-network d-inline-block list-inline mr-15"><li className="list-inline-item"><a className="social-icon fb text-xs-center" target="_blank" href="#"><i className="elegant-icon social_facebook"></i></a></li> <li className="list-inline-item"><a className="social-icon tw text-xs-center" target="_blank" href="#"><i className="elegant-icon social_twitter "></i></a></li> <li className="list-inline-item"><a className="social-icon pt text-xs-center" target="_blank" href="#"><i className="elegant-icon social_pinterest "></i></a></li></ul>
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
