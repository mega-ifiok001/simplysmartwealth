"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { validatePost, validateCategory, publicationTime } from "@/lib/validation";
import { uploadCover } from "@/lib/cloudinary";

export type PostActionState = { error: string };

export async function savePost(id: string | null, _state: PostActionState, data: FormData): Promise<PostActionState> {
  const admin = await requireAdmin();
  let input;
  try { input = validatePost(data); }
  catch (error) { return { error: error instanceof Error ? error.message : "Invalid post." }; }
  const existing = id
    ? await prisma.post.findUnique({ where: { id }, include: { categories: { select: { categoryId: true } } } })
    : null;
  if (id && !existing) return { error: "Post not found." };
  const duplicate = await prisma.post.findUnique({ where: { slug: input.slug }, select: { id: true } });
  if (duplicate && duplicate.id !== id) return { error: "That slug is already in use." };
  const cover = data.get("cover");
  let uploaded: { coverUrl: string; coverPublicId: string } | undefined;
  if (cover instanceof File && cover.size) {
    if (!input.coverAlt) return { error: "Please describe the cover image in the alt text field." };
    try { uploaded = await uploadCover(cover); }
    catch (error) { return { error: error instanceof Error ? error.message : "Upload failed." }; }
  }
  const { categoryIds, publicationDate, ...postValues } = input;
  const values = {
    ...postValues, ...uploaded,
    publishedAt: publicationTime(input.status, publicationDate, existing?.publishedAt ?? null),
  };
  try {
    await prisma.$transaction(async tx => {
      let savedId: string;
      if (id && existing) {
        // Reject concurrent writes rather than recording a snapshot of stale content.
        const result = await tx.post.updateMany({ where: { id, updatedAt: existing.updatedAt }, data: values });
        if (result.count !== 1) throw new Error("Concurrent post update");
        await tx.postRevision.create({ data: {
          postId: id, authorId: admin.id, title: existing.title, excerpt: existing.excerpt,
          content: existing.content, coverUrl: existing.coverUrl, coverAlt: existing.coverAlt,
        } });
        await tx.postCategory.deleteMany({ where: { postId: id } });
        savedId = id;
      } else {
        const post = await tx.post.create({ data: { ...values, authorId: admin.id } });
        savedId = post.id;
      }
      if (categoryIds.length) await tx.postCategory.createMany({ data: categoryIds.map(categoryId => ({ postId: savedId, categoryId })) });
      await tx.auditLog.create({ data: { adminId: admin.id, action: id ? "UPDATE" : "CREATE", entity: "Post", entityId: savedId } });
    });
  } catch (error) {
    return { error: error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002"
      ? "That slug is already in use." : "Could not save the post. Please try again." };
  }
  revalidatePath("/");
  revalidatePath("/search");
  revalidatePath("/categories");
  const categorySlugs = new Set<string>();
  if (input.categoryIds.length) {
    for (const category of await prisma.category.findMany({ where: { id: { in: input.categoryIds } }, select: { slug: true } }))
      categorySlugs.add(category.slug);
  }
  if (existing) {
    for (const link of existing.categories) {
      const category = await prisma.category.findUnique({ where: { id: link.categoryId }, select: { slug: true } });
      if (category) categorySlugs.add(category.slug);
    }
  }
  for (const slug of categorySlugs) revalidatePath(`/categories/${slug}`);
  revalidatePath("/admin");
  revalidatePath(`/posts/${input.slug}`);
  if (existing) revalidatePath(`/posts/${existing.slug}`);
  redirect("/admin");
}

export async function approveComment(id: string): Promise<void> {
  await requireAdmin();
  const comment = await prisma.comment.update({ where: { id }, data: { approved: true }, select: { post: { select: { slug: true } } } });
  revalidatePath(`/posts/${comment.post.slug}`);
  revalidatePath("/admin/comments");
  revalidatePath("/admin");
}

export async function unapproveComment(id: string): Promise<void> {
  await requireAdmin();
  const comment = await prisma.comment.update({ where: { id }, data: { approved: false }, select: { post: { select: { slug: true } } } });
  revalidatePath(`/posts/${comment.post.slug}`);
  revalidatePath("/admin/comments");
}

export async function deleteComment(id: string): Promise<void> {
  await requireAdmin();
  const comment = await prisma.comment.delete({ where: { id }, select: { post: { select: { slug: true } } } });
  revalidatePath(`/posts/${comment.post.slug}`);
  revalidatePath("/admin/comments");
  revalidatePath("/admin");
}

export async function setContactResolved(id: string, resolved: boolean): Promise<void> {
  await requireAdmin();
  await prisma.contactMessage.update({ where: { id }, data: { resolved, read: true } });
  revalidatePath("/admin/inbox");
  revalidatePath("/admin");
}

export async function markContactRead(id: string, read: boolean): Promise<void> {
  await requireAdmin();
  await prisma.contactMessage.update({ where: { id }, data: { read } });
  revalidatePath("/admin/inbox");
  revalidatePath("/admin");
}

export async function deleteContactMessage(id: string): Promise<void> {
  await requireAdmin();
  await prisma.contactMessage.delete({ where: { id } });
  revalidatePath("/admin/inbox");
  revalidatePath("/admin");
}

export async function saveCategory(id: string | null, _state: PostActionState, data: FormData): Promise<PostActionState> {
  await requireAdmin();
  let input;
  try { input = validateCategory(data); }
  catch (error) { return { error: error instanceof Error ? error.message : "Invalid category." }; }
  const conflicts = await prisma.category.findMany({
    where: id ? { OR: [{ name: input.name }, { slug: input.slug }, { id }] } : { OR: [{ name: input.name }, { slug: input.slug }] },
    select: { id: true, name: true, slug: true },
  });
  if (conflicts.some(category => category.id !== id && category.name === input.name)) return { error: "That category name is already in use." };
  if (conflicts.some(category => category.id !== id && category.slug === input.slug)) return { error: "That category slug is already in use." };
  if (id && !conflicts.some(category => category.id === id)) return { error: "Category not found." };
  try {
    if (id) await prisma.category.update({ where: { id }, data: input });
    else await prisma.category.create({ data: input });
  } catch (error) {
    return { error: error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002"
      ? "That category name or slug is already in use." : "Could not save the category. Please try again." };
  }
  if (id) revalidatePath(`/categories/${input.slug}`);
  revalidatePath("/categories");
  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function deleteCategory(id: string, _state: PostActionState): Promise<PostActionState> {
  await requireAdmin();
  try {
    const category = await prisma.category.delete({ where: { id }, select: { slug: true } });
    revalidatePath(`/categories/${category.slug}`);
  } catch { return { error: "Could not delete the category. Refresh and try again." }; }
  revalidatePath("/categories");
  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function deletePost(id: string, _state: PostActionState): Promise<PostActionState> {
  await requireAdmin();
  try {
    const post = await prisma.post.delete({ where: { id } });
    revalidatePath(`/posts/${post.slug}`);
  } catch { return { error: "Could not delete the post. Refresh and try again." }; }
  // Media is retained intentionally; Cloudinary files may be shared elsewhere.
  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}
