"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { overLimit } from "@/lib/rate-limit";
import { validateComment, validateContact } from "@/lib/validation";

export type PublicFormState = { ok: boolean; error: string };

/** IP from proxy headers when present; null in direct/local access. */
async function clientIp(): Promise<string | null> {
  const forwarded = (await headers()).get("x-forwarded-for") ?? "";
  const ip = forwarded.split(",")[0]?.trim();
  return ip || null;
}

export async function submitComment(postId: string, _prev: PublicFormState, data: FormData): Promise<PublicFormState> {
  let input: ReturnType<typeof validateComment>;
  try { input = validateComment(data); }
  catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Invalid comment." };
  }
  try {
    const ip = await clientIp();
    // Comments are moderated, so the limiter is a flood guard, not the only defense.
    if (ip && await overLimit(`comment:${ip}`, 5, 10 * 60 * 1000)) {
      return { ok: false, error: "Too many submissions from your network. Please try again later." };
    }
    const post = await prisma.post.findFirst({
      where: { id: postId, status: "PUBLISHED", publishedAt: { lte: new Date() } },
      select: { id: true, slug: true },
    });
    if (!post) return { ok: false, error: "Comments are only open on published articles." };
    await prisma.comment.create({ data: { postId: post.id, authorName: input.authorName, content: input.content } });
    revalidatePath(`/posts/${post.slug}`);
    return { ok: true, error: "" };
  } catch {
    return { ok: false, error: "Could not submit your comment. Please try again later." };
  }
}

export async function submitContact(_prev: PublicFormState, data: FormData): Promise<PublicFormState> {
  let input: ReturnType<typeof validateContact>;
  try { input = validateContact(data); }
  catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Invalid message." };
  }
  try {
    const ip = await clientIp();
    if (ip && await overLimit(`contact:${ip}`, 3, 60 * 60 * 1000)) {
      return { ok: false, error: "Too many messages from your network. Please try again later." };
    }
    await prisma.contactMessage.create({ data: input });
    return { ok: true, error: "" };
  } catch {
    return { ok: false, error: "Could not send your message. Please try again later." };
  }
}
