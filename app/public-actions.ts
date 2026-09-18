"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { overLimit } from "@/lib/rate-limit";
import { validateComment, validateContact } from "@/lib/validation";
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

export async function submitComment(postId: string, _prev: PublicFormState, data: FormData): Promise<PublicFormState> {
  let input: ReturnType<typeof validateComment>;
  try { input = validateComment(data); }
  catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Invalid comment." };
  }
  try {
    const ip = await clientIp();
    // Comments are moderated, so the limiter is a flood guard, not the only defense.
    if (await overLimit(`comment:${ip}`, 5, 10 * 60 * 1000)) {
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
