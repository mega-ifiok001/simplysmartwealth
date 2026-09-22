"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { overLimit } from "@/lib/rate-limit";
import { isEntityId, validateComment, validateContact } from "@/lib/validation";
import { getClientIp, UNKNOWN_IP_BUCKET } from "@/lib/request-ip";
import { sendEmail } from "@/lib/email";

export type PublicFormState = { ok: boolean; error: string };

/**
 * Client IP for rate limiting. Only trusts proxy headers when the operator
 * has confirmed the deployment topology with TRUST_PROXY=true; otherwise a
 * shared global bucket keeps limits meaningful even for direct connections.
 */
async function clientIp(): Promise<string> {
  const hdrs = await headers();
  return getClientIp(hdrs, { trustProxy: process.env.TRUST_PROXY === "true" }) ?? UNKNOWN_IP_BUCKET;
}

/**
 * Posts a comment or a reply. Comments publish immediately; an admin can
 * still unapprove or delete them afterwards.
 */
export async function submitComment(
  postId: string,
  parentId: string | null,
  _prev: PublicFormState,
  data: FormData,
): Promise<PublicFormState> {
  let input: ReturnType<typeof validateComment>;
  try { input = validateComment(data); }
  catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Invalid comment." };
  }
  try {
    // Honeypot: hidden from people, filled by bots. Report success so the bot
    // learns nothing, but never store it.
    if ((data.get("website") ?? "").toString().trim() !== "") {
      return { ok: true, error: "" };
    }
    const ip = await clientIp();
    // Flood guard only; auto-published comments rely on this plus the honeypot
    // and admin unapprove/delete.
    if (await overLimit(`comment:${ip}`, 5, 10 * 60 * 1000)) {
      return { ok: false, error: "Too many submissions from your network. Please try again later." };
    }
    const post = await prisma.post.findFirst({
      where: { id: postId, status: "PUBLISHED", publishedAt: { lte: new Date() } },
      select: { id: true, slug: true },
    });
    if (!post) return { ok: false, error: "Comments are only open on published articles." };

    // Resolve the thread root. A reply's parent must belong to this post, and
    // a reply to a reply is flattened onto the same top-level comment so
    // threads stay exactly one level deep.
    let threadRootId: string | null = null;
    if (parentId) {
      if (!isEntityId(parentId)) return { ok: false, error: "That comment is no longer available." };
      const parent = await prisma.comment.findFirst({
        where: { id: parentId, postId: post.id },
        select: { id: true, parentId: true },
      });
      if (!parent) return { ok: false, error: "That comment is no longer available." };
      threadRootId = parent.parentId ?? parent.id;
    }

    await prisma.comment.create({
      data: {
        postId: post.id,
        parentId: threadRootId,
        authorName: input.authorName,
        content: input.content,
        approved: true,
      },
    });
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
    if (await overLimit(`contact:${ip}`, 3, 60 * 60 * 1000)) {
      return { ok: false, error: "Too many messages from your network. Please try again later." };
    }
    await prisma.contactMessage.create({ data: input });
    // Notify the site owner; a mail failure must not fail the form.
    const notify = process.env.CONTACT_NOTIFY_EMAIL;
    if (notify) {
      await sendEmail({
        to: notify,
        subject: `New contact message${input.subject ? `: ${input.subject}` : ""}`,
        text: `From: ${input.name} <${input.email}>\nPhone: ${input.phone || "—"}\n\n${input.message}`,
        html: `<p><strong>From:</strong> ${input.name} &lt;${input.email}&gt;<br><strong>Phone:</strong> ${input.phone || "—"}</p><p>${input.message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>")}</p>`,
      }).catch((error) => console.error("Contact notification email failed:", error));
    }
    return { ok: true, error: "" };
  } catch {
    return { ok: false, error: "Could not send your message. Please try again later." };
  }
}
