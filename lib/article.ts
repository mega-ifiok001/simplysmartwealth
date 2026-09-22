import { prisma } from "@/lib/db";
import { readingTimeMs } from "@/lib/utils";

export const PUBLIC_POSTS_PER_PAGE = 12;
const PUBLIC_POST_WHERE = {
  status: "PUBLISHED" as const,
  publishedAt: { lte: new Date() },
};

function buildPostRow(post: {
  id: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  coverUrl?: string | null;
  publishedAt: Date | null;
  featured?: boolean | null;
}) {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt ?? "",
    coverImage: post.coverUrl ?? "",
    publishedAt: post.publishedAt,
    featured: Boolean(post.featured),
  };
}

export async function getPublicPostOrNotFound(slug: string) {
  const post = await prisma.post.findUnique({
    where: { slug },
    include: { author: { select: { name: true } } },
  });
  if (!post) {
    throw { data: post, status: "not-found" };
  }
  if (post.status !== "PUBLISHED" || !post.publishedAt) {
    throw { data: post, status: "hidden" };
  }
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt ?? "",
    body: post.content ?? "",
    coverImage: post.coverUrl ?? "",
    coverAlt: post.coverAlt ?? post.title,
    featured: Boolean(post.featured),
    categorySlug: "",
    categoryName: "",
    authorName: post.author?.name ?? "",
    publishedAt: post.publishedAt,
    tags: [],
    readingTime: readingTimeMs(post.content ?? ""),
  };
}

export async function getPublicCategoryOrNotFound(slug: string) {
  const category = await prisma.category.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      _count: { select: { posts: true } },
    },
  });
  if (!category) {
    throw { data: category, status: "not-found" };
  }
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description ?? "",
    postCount: category._count.posts,
  };
}

export async function getPublicPosts(params: {
  page?: number;
  categorySlug?: string;
  featured?: boolean;
  limit?: number;
} = {}) {
  const pageNo = Math.max(1, Number(params.page) || 1);
  const size = Number(params.limit) || PUBLIC_POSTS_PER_PAGE;
  const cursor = (pageNo - 1) * size;
        const baseWhere = params.categorySlug
    ? { status: "PUBLISHED" as const, publishedAt: { lte: new Date() }, categories: { some: { category: { slug: params.categorySlug } } } }
    : { status: "PUBLISHED" as const, publishedAt: { lte: new Date() } };
  const where = params.featured !== undefined ? { ...baseWhere, featured: params.featured } : baseWhere;
  const rows = await prisma.post.findMany({
    where,
    orderBy: [{ publishedAt: "desc" }],
    skip: cursor,
    take: size,
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      coverUrl: true,
      publishedAt: true,
      featured: true,
    },
  });
  const total = await prisma.post.count({ where });
  return {
    posts: rows.map(buildPostRow),
    page: pageNo,
    pageSize: size,
    totalCount: total,
    hasNextPage: cursor + size < total,
  };
}

export async function getFeaturedPublicPosts(count = 6) {
  const rows = await prisma.post.findMany({
    where: { ...PUBLIC_POST_WHERE, featured: true },
    orderBy: [{ publishedAt: "desc" }],
    take: count,
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      coverUrl: true,
      publishedAt: true,
      featured: true,
    },
  });
  return rows.map(buildPostRow);
}
