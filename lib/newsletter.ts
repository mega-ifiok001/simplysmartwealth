"use server";

import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { validateEmailAddress } from "@/lib/validation";
import { overLimit } from "@/lib/rate-limit";
import { getClientIp, UNKNOWN_IP_BUCKET } from "@/lib/request-ip";
import { sendEmail } from "@/lib/email";
import { issueToken, consumeToken } from "@/lib/tokens";

function baseUrl(): string {
  return process.env.NEXTAUTH_URL ?? process.env.APP_URL ?? "http://localhost:3000";
}

/**
 * Double-opt-in newsletter subscription. Every request gets a neutral
 * success response so the form cannot be used to probe addresses; only
 * genuinely new or unconfirmed addresses trigger a confirmation email.
 */
export async function subscribeNewsletter(
  _prev: { ok: boolean; error: string; message: string },
  data: FormData,
): Promise<{ ok: boolean; error: string; message: string }> {
  try {
    const email = validateEmailAddress((data.get("email") ?? "").toString());
    const consent = data.get("consent") === "on";
    if (!consent) {
      return { ok: false, error: "Please accept the terms to subscribe.", message: "" };
    }
    const hdrs = await headers();
    const ip = getClientIp(hdrs, { trustProxy: process.env.TRUST_PROXY === "true" });
    if (await overLimit(`newsletter:${ip ?? UNKNOWN_IP_BUCKET}`, 5, 60 * 60 * 1000)) {
      return { ok: false, error: "Too many attempts. Please try again later.", message: "" };
    }
    const existing = await prisma.subscriber.findUnique({ where: { email } });
    if (existing?.confirmed && !existing.unsubscribedAt) {
      return { ok: true, error: "", message: "You are already subscribed. Watch your inbox!" };
    }
    if (existing?.unsubscribedAt) {
      await prisma.subscriber.update({
        where: { email },
        data: { unsubscribedAt: null, confirmed: false },
      });
    } else if (!existing) {
      await prisma.subscriber.create({ data: { email } });
    }
    const token = await issueToken(email, "NEWSLETTER_CONFIRM", 72 * 60 * 60 * 1000);
    const link = `${baseUrl()}/newsletter/confirm?token=${encodeURIComponent(token)}`;
    await sendEmail({
      to: email,
      subject: "Confirm your newsletter subscription",
      text: `Hi,\n\nPlease confirm your subscription to the Simply Smart Wealth newsletter by visiting:\n${link}\n\nThis link expires in 72 hours. If you did not subscribe, you can ignore this message.\n\nThanks,\nSimply Smart Wealth`,
      html: `<p>Hi,</p><p>Please confirm your subscription to the <strong>Simply Smart Wealth</strong> newsletter:</p><p><a href="${link}">Confirm subscription</a></p><p>This link expires in 72 hours. If you did not subscribe, you can ignore this message.</p><p>Thanks,<br>Simply Smart Wealth</p>`,
    });
    return { ok: true, error: "", message: "Almost done — check your email to confirm your subscription." };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Could not subscribe right now. Please try again later.",
      message: "",
    };
  }
}

export async function confirmNewsletter(rawToken: string) {
  const consumed = await consumeToken(rawToken, "NEWSLETTER_CONFIRM");
  if (!consumed) {
    return { ok: false, message: "That confirmation link is not valid or has expired." };
  }
  await prisma.subscriber.update({
    where: { email: consumed.email },
    data: { confirmed: true, unsubscribedAt: null },
  });
  return { ok: true, message: "Your subscription is confirmed. Welcome aboard!" };
}

export async function unsubscribeNewsletter(rawToken: string) {
  const consumed = await consumeToken(rawToken, "NEWSLETTER_UNSUB");
  if (!consumed) {
    return { ok: false, message: "That unsubscribe link is not valid or has expired." };
  }
  await prisma.subscriber.update({
    where: { email: consumed.email },
    data: { unsubscribedAt: new Date() },
  });
  return { ok: true, message: "You have been unsubscribed. Sorry to see you go." };
}