"use server";

import { hash } from "bcryptjs";
import { prisma } from "@/lib/db";
import {
  validateReaderRegister,
  validatePasswordResetRequest,
  validatePasswordReset,
} from "@/lib/validation";
import { overLimit } from "@/lib/rate-limit";
import { sendEmail } from "@/lib/email";
import { issueToken, consumeToken } from "@/lib/tokens";

function baseUrl(): string {
  return process.env.NEXTAUTH_URL ?? process.env.APP_URL ?? "http://localhost:3000";
}

function emailKey(email: string): string {
  return Buffer.from(email).toString("base64url");
}

/**
 * Sends and never throws: a mail outage must not break account flows or
 * leak delivery state to the client. Failures are logged for operators.
 */
async function trySendEmail(params: Parameters<typeof sendEmail>[0]): Promise<boolean> {
  try {
    await sendEmail(params);
    return true;
  } catch (error) {
    console.error("[email] delivery failed:", error instanceof Error ? error.message : error);
    return false;
  }
}

/**
 * Reader account actions. Registration and password recovery always respond
 * with a neutral success message so the forms cannot be used to enumerate
 * which email addresses have accounts.
 */

export async function registerReader(data: FormData) {
  const input = validateReaderRegister(data);
  if (await overLimit(`reader-register:${emailKey(input.email)}`, 3, 60 * 60 * 1000)) {
    return { ok: false, error: "Too many attempts. Please try again later." };
  }
  const existing = await prisma.reader.findUnique({ where: { email: input.email } });
  if (existing?.emailVerified) {
    return { ok: true, message: "Check your email to confirm your account." };
  }
  const passwordHash = await hash(input.password, 12);
  const reader = existing
    ? await prisma.reader.update({
        where: { email: input.email },
        data: { passwordHash, name: input.name },
      })
    : await prisma.reader.create({
        data: { email: input.email, passwordHash, name: input.name },
      });
  const token = await issueToken(reader.email, "VERIFY_EMAIL");
  const link = `${baseUrl()}/auth/verify?token=${encodeURIComponent(token)}`;
  const delivered = await trySendEmail({
    to: reader.email,
    subject: "Confirm your account on Simply Smart Wealth",
    text: `Hi ${input.name ?? "there"},\n\nPlease confirm your email address by visiting:\n${link}\n\nThis link expires in 24 hours. If you did not create an account, you can ignore this message.\n\nThanks,\nSimply Smart Wealth`,
    html: `<p>Hi ${input.name ?? "there"},</p><p>Please confirm your email address by clicking the link below:</p><p><a href="${link}">Confirm email address</a></p><p>This link expires in 24 hours. If you did not create an account, you can ignore this message.</p><p>Thanks,<br>Simply Smart Wealth</p>`,
  });
  if (!delivered) {
    // The account row exists; re-registering updates it and re-issues a token.
    return {
      ok: false,
      error: "We could not send the confirmation email right now. Please try again in a few minutes.",
    };
  }
  return { ok: true, message: "Check your email to confirm your account." };
}

export async function requestPasswordReset(data: FormData) {
  const input = validatePasswordResetRequest(data);
  if (await overLimit(`reader-reset:${emailKey(input.email)}`, 3, 60 * 60 * 1000)) {
    return { ok: true, message: "If that email exists, we have sent reset instructions." };
  }
  const reader = await prisma.reader.findUnique({ where: { email: input.email } });
  if (reader?.emailVerified) {
    const token = await issueToken(reader.email, "PASSWORD_RESET");
    const link = `${baseUrl()}/auth/reset?token=${encodeURIComponent(token)}`;
    await trySendEmail({
      to: reader.email,
      subject: "Reset your password on Simply Smart Wealth",
      text: `Hi ${reader.name ?? "there"},\n\nYou requested a password reset. Use this link:\n${link}\n\nThis link expires in 24 hours. If you did not request this, you can ignore this message.\n\nThanks,\nSimply Smart Wealth`,
      html: `<p>Hi ${reader.name ?? "there"},</p><p>You requested a password reset. Use the link below:</p><p><a href="${link}">Reset password</a></p><p>This link expires in 24 hours. If you did not request this, you can ignore this message.</p><p>Thanks,<br>Simply Smart Wealth</p>`,
    });
  }
  return { ok: true, message: "If that email exists, we have sent reset instructions." };
}

export async function resetPassword(data: FormData) {
  const input = validatePasswordReset(data);
  const consumed = await consumeToken(input.token, "PASSWORD_RESET");
  if (!consumed || consumed.email !== input.email) {
    return { ok: false, error: "That reset link is not valid or has expired." };
  }
  await prisma.reader.update({
    where: { email: consumed.email },
    data: { passwordHash: await hash(input.password, 12) },
  });
  return { ok: true, message: "Your password has been updated. You can now sign in." };
}

export async function verifyEmail(rawToken: string) {
  const consumed = await consumeToken(rawToken, "VERIFY_EMAIL");
  if (!consumed) {
    return { ok: false, error: "That confirmation link is not valid or has expired." };
  }
  await prisma.reader.update({
    where: { email: consumed.email },
    data: { emailVerified: new Date() },
  });
  return { ok: true, message: "Your email is confirmed. You can now sign in." };
}