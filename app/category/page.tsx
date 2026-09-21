import { prisma } from "@/lib/db";
import PublicPage from "@/components/PublicPage";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Topics | Simply Smart Wealth",
};

export default async function CategoryIndexPage() {
  const topics = process.env.DATABASE_URL
    ? await prisma.category.findMany({
        orderBy: { name: "asc" },
        include: { _count: { select: { posts: true } } },
      })
    : [];

  return (
    <PublicPage>
      <main id="main-content">
        <div className="archive-header pt-50">
          <div className="container">
            <h1 className="font-weight-900">Browse topics</h1>
            <div className="breadcrumb mt-15"><a href="/">Home</a> <span></span> Topics</div>
            <div className="bt-1 border-color-1 mt-30 mb-50"></div>
          </div>
        </div>
        <div className="container pb-50">
          {!topics.length && <p className="text-muted">No topics yet.</p>}
          <div className="row">
            {topics.map((topic) => (
              <div className="col-md-6 col-lg-4 mb-30" key={topic.id}>
                <a className="d-block bg-white has-border p-30 hover-up border-radius-10" href={`/category/${topic.slug}`}>
                  <h3 className="font-weight-900 mb-10">{topic.name}</h3>
                  <p className="font-small text-muted">{topic.description}</p>
                  <span className="font-x-small text-uppercase text-primary">
                    {topic._count.posts} article{topic._count.posts === 1 ? "" : "s"}
                  </span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </main>
    </PublicPage>
  );
}