#!/usr/bin/env node
// Seeds categories and personal-finance articles into the configured database.
// Idempotent: existing categories are updated in place, existing post slugs
// are skipped. Run: node --env-file=.env scripts/seed-content.mjs
import { PrismaClient } from "@prisma/client";
import { categories, posts } from "./seed-data.mjs";

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.admin.findFirst({ orderBy: { createdAt: "asc" } });
  if (!admin) {
    console.error("seed-content: no admin account found. Run `npm run admin:create` first.");
    process.exit(1);
  }

  const categoryBySlug = new Map();
  let categoriesUpdated = 0;
  for (const category of categories) {
    const row = await prisma.category.upsert({
      where: { name: category.name },
      update: { slug: category.slug, description: category.description },
      create: { name: category.name, slug: category.slug, description: category.description },
    });
    categoryBySlug.set(category.slug, row);
    categoriesUpdated++;
  }

  let created = 0;
  let skipped = 0;
  for (const post of posts) {
    const existing = await prisma.post.findUnique({ where: { slug: post.slug } });
    if (existing) {
      skipped++;
      continue;
    }
    const publishedAt = new Date(Date.now() - post.daysAgo * 24 * 60 * 60 * 1000);
    const row = await prisma.post.create({
      data: {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        status: "PUBLISHED",
        coverUrl: post.cover,
        coverAlt: post.coverAlt,
        featured: Boolean(post.featured),
        publishedAt,
        authorId: admin.id,
      },
    });
    for (const slug of post.categories) {
      const category = categoryBySlug.get(slug);
      if (!category) throw new Error(`Unknown category slug in seed data: ${slug}`);
      await prisma.postCategory.create({ data: { postId: row.id, categoryId: category.id } });
    }
    created++;
  }

  console.log(`seed-content: categories upserted: ${categoriesUpdated}`);
  console.log(`seed-content: posts created: ${created}, skipped (already present): ${skipped}`);
}

main()
  .catch((error) => {
    console.error("seed-content failed:", error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());