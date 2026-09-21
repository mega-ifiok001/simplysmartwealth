import Link from "next/link";

export type ArticleSummary = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverUrl: string | null;
  coverAlt: string;
  categories?: Array<{ category: { name: string; slug: string } }>;
  publishedAt?: Date | string | null;
};

function formatDate(value: Date | string | null | undefined): string {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

/** Themed magazine card grid used by the homepage, category archives, and search. */
export default function ArticleGrid({ posts }: { posts: ArticleSummary[] }) {
  return (
    <div className="row">
      {posts.map((post) => {
        const first = post.categories?.[0]?.category;
        return (
          <article key={post.id} className="col-md-6 col-lg-4 mb-40 wow fadeInUp animated">
            <div className="post-card-1 border-radius-10 hover-up bg-white">
              {post.coverUrl && (
                <div
                  className="post-thumb thumb-overlay img-hover-slide position-relative"
                  style={{ backgroundImage: `url(${post.coverUrl})` }}
                >
                  <Link className="img-link" href={`/posts/${post.slug}`} aria-label={post.title}></Link>
                </div>
              )}
              <div className="post-content p-25">
                {first && (
                  <div className="entry-meta meta-0 font-small mb-10">
                    <Link href={`/category/${first.slug}`}>
                      <span className="post-cat text-primary text-uppercase">{first.name}</span>
                    </Link>
                  </div>
                )}
                <h3 className="post-title font-weight-900 mb-15 text-limit-2-row">
                  <Link href={`/posts/${post.slug}`}>{post.title}</Link>
                </h3>
                <p className="excerpt font-small text-muted text-limit-3-row">{post.excerpt}</p>
                {post.publishedAt && (
                  <div className="entry-meta meta-1 font-x-small text-uppercase mt-15">
                    <span className="post-on">{formatDate(post.publishedAt)}</span>
                  </div>
                )}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
