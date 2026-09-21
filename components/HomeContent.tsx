import Link from "next/link";
import { prisma } from "@/lib/db";
import { getSiteSettings } from "@/lib/settings";
import { pageNumber } from "@/lib/pagination";
import PublicPage from "@/components/PublicPage";
import ArticleGrid from "@/components/ArticleGrid";
import Behaviors from "@/components/Behaviors";

const postSelect = {
  id: true,
  slug: true,
  title: true,
  excerpt: true,
  coverUrl: true,
  coverAlt: true,
  publishedAt: true,
  views: true,
  categories: { select: { category: { select: { name: true, slug: true } } } },
} as const;

function formatDate(value: Date | string): string {
  return new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export default async function HomeContent({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const settings = await getSiteSettings();
  const page = pageNumber((await searchParams).page);
  const where = { status: "PUBLISHED" as const, publishedAt: { lte: new Date() } };
  const [posts, total, featured, popular, topics] = process.env.DATABASE_URL
    ? await Promise.all([
        prisma.post.findMany({ where, orderBy: [{ publishedAt: "desc" }, { id: "asc" }], skip: (page - 1) * 12, take: 12, select: postSelect }),
        prisma.post.count({ where }),
        page === 1
          ? prisma.post.findMany({ where: { ...where, featured: true }, orderBy: [{ publishedAt: "desc" }, { id: "asc" }], take: 3, select: postSelect })
          : Promise.resolve([]),
        prisma.post.findMany({ where, orderBy: [{ views: "desc" }, { publishedAt: "desc" }], take: 4, select: postSelect }),
        prisma.category.findMany({ orderBy: { name: "asc" }, include: { _count: { select: { posts: true } } } }),
      ])
    : [[], 0, [], [], []];
  const totalPages = Math.max(1, Math.ceil(total / 12));

  return (
    <PublicPage>
      <main id="main-content" className="container pt-50 pb-50">
        {page === 1 && featured.length > 0 && (
          <section className="mb-50" aria-label="Featured articles">
            <div className="carausel-post-1 hover-up border-radius-10 overflow-hidden transition-normal position-relative wow fadeInUp animated">
              <div className="arrow-cover"></div>
              <div className="slide-fade">
                {featured.map((post) => {
                  const first = post.categories?.[0]?.category;
                  return (
                    <div key={post.id} className="position-relative post-thumb">
                      <div
                        className="thumb-overlay img-hover-slide position-relative"
                        style={post.coverUrl ? { backgroundImage: `url(${post.coverUrl})` } : undefined}
                      >
                        <Link className="img-link" href={`/posts/${post.slug}`} aria-label={post.title}></Link>
                        <div className="post-content-overlay text-white ml-30 mr-30 pb-30">
                          {first && (
                            <div className="entry-meta meta-0 font-small mb-20">
                              <Link href={`/category/${first.slug}`}>
                                <span className="post-cat text-warning text-uppercase">{first.name}</span>
                              </Link>
                            </div>
                          )}
                          <h2 className="post-title font-weight-900 mb-20">
                            <Link className="text-white" href={`/posts/${post.slug}`}>{post.title}</Link>
                          </h2>
                          <div className="entry-meta meta-1 font-small text-white mt-10 pr-5 pl-5">
                            {post.publishedAt && <span className="post-on">{formatDate(post.publishedAt)}</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        <div className="row">
          <div className="col-lg-8">
            <section aria-labelledby="articles-heading">
              <div className="widget-header-1 position-relative mb-30">
                <h2 id="articles-heading" className="mt-5 mb-30">Latest articles</h2>
              </div>
              {!posts.length && (
                <p className="text-muted">
                  {process.env.DATABASE_URL ? "No articles on this page yet." : "Publishing will be available once the database is configured."}
                </p>
              )}
              <ArticleGrid posts={posts} />
              {totalPages > 1 && (
                <nav aria-label="Article pages" className="d-flex align-items-center justify-content-between mt-20 mb-20">
                  {page > 1 ? (
                    <Link className="btn btn-radius border bg-white font-small" href={page === 2 ? "/" : `/?page=${page - 1}`}>← Previous</Link>
                  ) : <span />}
                  <span className="font-small text-muted">Page {page} of {totalPages}</span>
                  {page * 12 < total ? (
                    <Link className="btn btn-radius bg-primary text-white font-small" href={`/?page=${page + 1}`}>Next →</Link>
                  ) : <span />}
                </nav>
              )}
            </section>
          </div>

          <aside className="col-lg-4 mt-lg-0 mt-50">
            <div className="sidebar-widget widget_about mb-30">
              <div className="about-content p-25 bg-white border-radius-10">
                <div className="widget-header-2 position-relative mb-20"><h5 className="mt-5 mb-20">About {settings.site_name}</h5></div>
                <p className="font-small text-muted">{settings.hero_subheading || settings.site_tagline}</p>
                <Link className="btn btn-radius bg-primary text-white font-small mt-15" href="/about">Read more</Link>
              </div>
            </div>

            {popular.length > 0 && (
              <div className="sidebar-widget widget-latest-posts mb-30">
                <div className="widget-header-2 position-relative mb-30"><h5 className="mt-5 mb-30">Don&apos;t miss</h5></div>
                <div className="post-block-list post-module-1">
                  <ul className="list-post">
                    {popular.map((post) => (
                      <li key={post.id} className="mb-30">
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
                                <span className="post-on">{formatDate(post.publishedAt)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {topics.length > 0 && (
              <div className="sidebar-widget widget_categories mb-30">
                <div className="widget-header-2 position-relative mb-30"><h5 className="mt-5 mb-30">Browse topics</h5></div>
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
            )}
          </aside>
        </div>
      </main>
      <Behaviors />
    </PublicPage>
  );
}
