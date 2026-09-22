import { prisma } from "@/lib/db";
import type { Post } from "@prisma/client";

export async function postCount() {
  "use server";
  return prisma.post.count();
}

export async function categoryCount() {
  "use server";
  return prisma.category.count();
}

export async function commentCount() {
  "use server";
  return prisma.comment.count();
}

export async function subscriberCount() {
  "use server";
  return prisma.subscriber.count({ where: { confirmed: true } });
}

export async function pendingCommentCount() {
  "use server";
  return prisma.comment.count({ where: { approved: false } });
}

export function formatCount(n: number) {
  return n.toLocaleString();
}