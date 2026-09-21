import { cache } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSiteSettings } from "@/lib/settings";
import PublicPage from "@/components/PublicPage";
import CommentForm from "@/components/CommentForm";

export const dynamic = "force-dynamic";

const getPost = cache(async (slug: string) => {
  if (!process.env.DATABASE_URL) return null;
  return prisma.post.findFirst({
    where: { slug, status: "PUBLISHED", publishedAt: { lte: new Date() } },
    include: {
      author: { select: { name: true } },
      categories: { select: { category: { select: { id: true, name: true, slug: true } } } },
      comments: {
        where: { approved: true },
        orderBy: { createdAt: "desc" },
        take: 50,
        select: { id: true, authorName: true, content: true, createdAt: true },
      },
    },
  });
});

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const post = await getPost((await params).slug);
  return post
    ? {
        title: post.title,
        description: post.excerpt,
        openGraph: { title: post.title, description: post.excerpt, type: "article", images: post.coverUrl ? [post.coverUrl] : [] },
      }
    : { title: "Article not found" };
}

function formatDate(value: Date | string): string {
  return new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const post = await getPost((await params).slug);
  if (!post) notFound();
  const settings = await getSiteSettings();
  const base = process.env.NEXTAUTH_URL ?? process.env.APP_URL ?? "http://localhost:3000";
  const shareUrl = encodeURIComponent(`${base}/posts/${post.slug}`);
  const shareTitle = encodeURIComponent(post.title);
  const minutes = Math.max(1, Math.round(post.content.split(/\s+/).filter(Boolean).length / 200));
  const initial = (post.author.name ?? "A").trim().charAt(0).toUpperCase() || "A";
  const related = post.categories.length
    ? await prisma.post.findMany({
        where: {
          status: "PUBLISHED",
          publishedAt: { lte: new Date() },
          id: { not: post.id },
          categories: { some: { categoryId: { in: post.categories.map((c) => c.category.id) } } },
        },
        orderBy: [{ publishedAt: "desc" }],
        take: 3,
        select: { id: true, slug: true, title: true, coverUrl: true, coverAlt: true, publishedAt: true },
      })
    : [];

  return (
    <PublicPage>
      <article id="main-content">
        <div className="archive-header pt-50">
          <div className="container">
            {post.categories.length > 0 && (
              <div className="entry-meta meta-0 font-small mb-20">
                {post.categories.map(({ category }) => (
                  <Link key={category.slug} href={`/category/${category.slug}`}>
                    <span className="post-cat text-primary text-uppercase mr-10">{category.name}</span>
                  </Link>
                ))}
              </div>
            )}
            <h1 className="post-title font-weight-900">{post.title}</h1>
            <div className="entry-meta meta-1 font-x-small text-uppercase mt-20">
              <span className="author-name">By {post.author.name}</span>
              {post.publishedAt && <span className="post-on has-dot">{formatDate(post.publishedAt)}</span>}
              <span className="hit-count has-dot">{minutes} min read</span>
            </div>
            <div className="bt-1 border-color-1 mt-30 mb-30"></div>
          </div>
        </div>

        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              {post.coverUrl && (
                <img src={post.coverUrl} alt={post.coverAlt} className="border-radius-10 mb-30" style={{ width: "100%" }} />
              )}
              <p className="font-large mb-30">{post.excerpt}</p>
              <div
                className="entry-content mb-40"
                style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere", lineHeight: 1.9, fontSize: "1.05rem" }}
              >
                {post.content}
              </div>
              <div className="single-share mb-40">
                <ul className="header-social-network d-inline-block list-inline">
                  <li className="list-inline-item text-muted font-small mr-10">Share this:</li>
                  <li className="list-inline-item">
                    <a className="social-icon fb text-xs-center" target="_blank" rel="noopener noreferrer" href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} aria-label="Share on Facebook"><i className="elegant-icon social_facebook"></i></a>
                  </li>
                  <li className="list-inline-item">
                    <a className="social-icon tw text-xs-center" target="_blank" rel="noopener noreferrer" href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`} aria-label="Share on X"><i className="elegant-icon social_twitter"></i></a>
                  </li>
                  <li className="list-inline-item">
                    <a className="social-icon pt text-xs-center" target="_blank" rel="noopener noreferrer" href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`} aria-label="Share on LinkedIn"><i className="elegant-icon social_linkedin"></i></a>
                  </li>
                </ul>
              </div>

              <div className="author-box bg-grey p-30 border-radius-10 mb-50 d-flex align-items-center">
                <div
                  className="bg-primary text-white font-weight-900 mr-15 d-flex align-items-center justify-content-center"
                  style={{ width: 64, height: 64, borderRadius: "50%", fontSize: 26, flexShrink: 0 }}
                  aria-hidden="true"
                >
                  {initial}
                </div>
                <div>
                  <h5 className="mb-5">{post.author.name}</h5>
                  <p className="font-small text-muted mb-0">
                    Writes about saving, budgeting, and building wealth at {settings.site_name}.
                  </p>
                </div>
              </div>

              <section className="mb-50" aria-label="Comments">
                <div className="widget-header-2 position-relative mb-30">
                  <h5 className="mt-5 mb-30">Comments ({post.comments.length})</h5>
                </div>
                {!post.comments.length && <p className="text-muted font-small">No comments yet. Start the conversation.</p>}
                {post.comments.map((comment) => (
                  <div key={comment.id} className="bg-white has-border p-25 border-radius-5 mb-20">
                    <p className="mb-10">
                      <strong>{comment.authorName}</strong>{" "}
                      <span className="ml-10 font-x-small text-muted">{formatDate(comment.createdAt)}</span>
                    </p>
                    <p className="font-small mb-0" style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>
                      {comment.content}
                    </p>
                  </div>
                ))}
                <CommentForm postId={post.id} />
              </section>
            </div>

            <aside className="col-lg-4 pl-lg-4 d-none d-lg-block mt-40">
              {related.length > 0 && (
                <div className="sidebar-widget widget-latest-posts mb-30">
                  <div className="widget-header-2 position-relative mb-30"><h5 className="mt-5 mb-30">Related reading</h5></div>
                  <div className="post-block-list post-module-1">
                    <ul className="list-post">
                      {related.map((item) => (
                        <li key={item.id} className="mb-30">
                          <div className="d-flex hover-up-2 transition-normal">
                            {item.coverUrl && (
                              <div className="post-thumb post-thumb-80 d-flex mr-15 border-radius-5 img-hover-scale overflow-hidden">
                                <Link href={`/posts/${item.slug}`}>
                                  <img src={item.coverUrl} alt={item.coverAlt} loading="lazy" />
                                </Link>
                              </div>
                            )}
                            <div className="post-content media-body">
                              <h6 className="post-title mb-10 text-limit-2-row font-medium">
                                <Link href={`/posts/${item.slug}`}>{item.title}</Link>
                              </h6>
                              {item.publishedAt && (
                                <div className="entry-meta meta-1 float-start font-x-small text-uppercase">
                                  <span className="post-on">{formatDate(item.publishedAt)}</span>
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
            </aside>
          </div>
        </div>
      </article>
    </PublicPage>
  );
}
