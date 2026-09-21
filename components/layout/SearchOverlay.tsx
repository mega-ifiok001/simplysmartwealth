import Link from "next/link";

const SUGGESTED = [
  { name: "Budgeting", slug: "budgeting" },
  { name: "Saving", slug: "saving" },
  { name: "Making Money Online", slug: "making-money-online" },
  { name: "Side Hustles", slug: "side-hustles" },
  { name: "Investing", slug: "investing" },
  { name: "Debt & Credit", slug: "debt-credit" },
];

export default function SearchOverlay() {
  return (
<div className="main-search-form">
	<div className="container">
		<div className=" pt-50 pb-50 ">
			<div className="row mb-20">
				<div className="col-12 align-self-center main-search-form-cover m-auto"><p className="text-center"><span className="search-text-bg">Search</span></p> <form action="/search" method="get" className="search-header">
	<div className="input-group w-100">
		<input type="search" name="q" maxLength={100} className="form-control" placeholder="Search articles on saving, budgeting and more" aria-label="Search articles" />
		<div className="input-group-append"><button className="btn btn-search bg-white" type="submit"><i className="elegant-icon icon_search"></i></button></div>
	</div>
</form></div>
			</div>
			<div className="row mt-80 text-center">
				<div className="col-12 font-small suggested-area"><h5 className="suggested font-heading mb-20 text-muted"><strong>Browse topics:</strong></h5> <ul className="list-inline d-inline-block">
					{SUGGESTED.map((topic) => (
						<li className="list-inline-item" key={topic.slug}><Link href={`/category/${topic.slug}`}>{topic.name}</Link></li>
					))}
				</ul></div>
			</div>
		</div>
	</div>
</div>
  );
}
