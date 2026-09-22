"use server";

import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { sendEmail } from "@/lib/email";
import { issueToken } from "@/lib/tokens";

export type CampaignState = { ok: boolean; error: string; message: string };

const MAX_SUBJECT = 200;
const MAX_BODY = 20000;
const MAX_BATCH = 500;

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function baseUrl(): string {
  return process.env.NEXTAUTH_URL ?? process.env.APP_URL ?? "http://localhost:3000";
}

/**
 * Sends a newsletter campaign to confirmed, unsubscribed-safe subscribers.
 * Every recipient gets a personal, tokenised unsubscribe link (CAN-SPAM
 * requirement); sends happen inline with a hard cap of MAX_BATCH.
 */
export async function sendNewsletterCampaign(
  _prev: CampaignState,
  data: FormData,
): Promise<CampaignState> {
  try {
    const admin = await requireAdmin();
    const subject = (data.get("subject") ?? "").toString().trim();
    const body = (data.get("body") ?? "").toString().trim();
    if (subject.length < 3 || subject.length > MAX_SUBJECT) {
      return { ok: false, error: "Subject must contain 3–200 characters.", message: "" };
    }
    if (body.length < 10 || body.length > MAX_BODY) {
      return { ok: false, error: "Message must contain 10–20000 characters.", message: "" };
    }
    const recipients = await prisma.subscriber.findMany({
      where: { confirmed: true, unsubscribedAt: null },
      select: { email: true },
      take: MAX_BATCH,
    });
    if (recipients.length === 0) {
      return { ok: false, error: "No confirmed subscribers to send to yet.", message: "" };
    }
    const origin = baseUrl();
    const bodyHtml = escapeHtml(body).replace(/\n/g, "<br>");
    let sent = 0;
    for (const { email } of recipients) {
      // A 30-day single-use unsubscribe token keeps the link working long
      // after the send without embedding the address in the URL.
      const unsubToken = await issueToken(email, "NEWSLETTER_UNSUB", 30 * 24 * 60 * 60 * 1000);
      const unsubLink = `${origin}/newsletter/unsubscribe?token=${encodeURIComponent(unsubToken)}`;
      try {
        await sendEmail({
          to: email,
          subject,
          text: `${body}\n\n---\nYou are receiving this because you subscribed to the Simply Smart Wealth newsletter.\nUnsubscribe: ${unsubLink}`,
          html: `<div style="font-family:system-ui,sans-serif;line-height:1.6"><p>${bodyHtml}</p><hr><p style="color:#666;font-size:12px">You are receiving this because you subscribed to the Simply Smart Wealth newsletter. <a href="${unsubLink}">Unsubscribe</a></p></div>`,
        });
        sent += 1;
      } catch (sendError) {
        console.error(`Campaign email to ${email} failed:`, sendError);
      }
    }
    const campaign = await prisma.newsletterCampaign.create({
      data: {
        subject,
        body,
        status: sent === recipients.length ? "SENT" : "PARTIAL",
        sentAt: new Date(),
        recipientCount: sent,
        authorId: admin.id,
      },
    });
    if (sent === 0) {
      return { ok: false, error: "Sending failed for every recipient. Check Resend settings and try again.", message: "" };
    }
    return {
      ok: true,
      error: "",
      message:
        sent === recipients.length
          ? `Sent to ${sent} subscriber${sent === 1 ? "" : "s"} (campaign ${campaign.id}).`
          : `Sent to ${sent} of ${recipients.length} subscribers; some deliveries failed — check the server log (campaign ${campaign.id}).`,
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Could not send the campaign. Check SMTP settings and try again.",
      message: "",
    };
  }
}

export async function listCampaigns() {
  await requireAdmin();
  return prisma.newsletterCampaign.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
  });
}

export async function subscriberCount() {
  await requireAdmin();
  return prisma.subscriber.count({ where: { confirmed: true, unsubscribedAt: null } });
}