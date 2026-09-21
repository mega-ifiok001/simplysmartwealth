import Link from "next/link";
import { prisma } from "@/lib/db";

/**
 * Post-footer band with the newest articles and topics. Data-driven with a
 * graceful fallback: template pages that render it without a database still
 * work, they simply show an empty band.
 */
export default async function SiteBottom() {
  const [latest, topics] = process.env.DATABASE_URL
    ? await Promise.all([
        prisma.post.findMany({
          where: { status: "PUBLISHED", publishedAt: { lte: new Date() } },
          orderBy: [{ publishedAt: "desc" }],
          take: 4,
          select: { id: true, slug: true, title: true, coverUrl: true, coverAlt: true, publishedAt: true },
        }),
        prisma.category.findMany({
          orderBy: { name: "asc" },
          take: 4,
          include: { _count: { select: { posts: true } } },
        }),
      ]).catch(() => [[], []] as const)
    : [[], []] as const;

  return (
<div className="site-bottom pt-50 pb-50">
	<div className="container">
		{latest.length > 0 && (
		<div className="row">
			<div className="col-lg-8">
				<div className="sidebar-widget widget-latest-posts mb-30">
					<div className="widget-header-2 position-relative mb-30"><h5 className="mt-5 mb-30">Latest articles</h5></div>
					<div className="post-block-list post-module-1">
						<ul className="list-post">
							{latest.map((post) => (
								<li className="mb-30" key={post.id}>
									<div className="d-flex hover-up-2 transition-normal">
										{post.coverUrl && (
											<div className="post-thumb post-thumb-80 d-flex mr-15 border-radius-5 img-hover-scale overflow-hidden">
												<Link href={`/posts/${post.slug}`}>
													<img src={post.coverUrl} alt={post.coverAlt} loading="lazy" />
												</Link>
											</div>
										)}
										<div className="post-content media-body">
											<h6 className="post-title mb-10 text-limit-2-row font-medium">
												<Link href={`/posts/${post.slug}`}>{post.title}</Link>
											</h6>
											{post.publishedAt && (
												<div className="entry-meta meta-1 float-start font-x-small text-uppercase">
													<span className="post-on">
														{new Date(post.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
													</span>
												</div>
											)}
										</div>
									</div>
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>
			{topics.length > 0 && (
			<div className="col-lg-4">
				<div className="sidebar-widget widget_categories mb-30">
					<div className="widget-header-2 position-relative mb-30"><h5 className="mt-5 mb-30">Topics</h5></div>
					<ul className="font-small">
						{topics.map((topic) => (
							<li className="cat-item" key={topic.id}>
								<Link href={`/category/${topic.slug}`}>
									{topic.name}<span className="count ml-10">{topic._count.posts}</span>
								</Link>
							</li>
						))}
					</ul>
				</div>
			</div>
			)}
		</div>
		)}
	</div>
</div>
  );
}