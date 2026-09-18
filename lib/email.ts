import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

export interface SendEmailParams {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

let transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (transporter) return transporter;
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) {
    throw new Error(
      "SMTP is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS (and EMAIL_FROM), or set EMAIL_MODE=console.",
    );
  }
  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    pool: true,
    maxConnections: 3,
    maxMessages: 100,
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  });
  return transporter;
}

function sender(): string {
  return process.env.EMAIL_FROM ?? "Simply Smart Wealth <noreply@localhost>";
}

/**
 * Sends an email through SMTP. In development (EMAIL_MODE=console) the
 * message is printed to the server log instead of being delivered.
 */
export async function sendEmail(params: SendEmailParams): Promise<void> {
  const mode =
    process.env.EMAIL_MODE ??
    (process.env.NODE_ENV === "production" ? "smtp" : "console");

  if (mode === "console") {
    console.log("\n===== EMAIL (console mode) =====");
    console.log("From:", sender());
    console.log("To:", params.to);
    console.log("Subject:", params.subject);
    console.log(params.html ?? params.text);
    console.log("================================\n");
    return;
  }

  if (mode !== "smtp") {
    throw new Error(`Unknown EMAIL_MODE "${mode}" (expected "smtp" or "console").`);
  }

  const info = await getTransporter().sendMail({
    from: sender(),
    to: params.to,
    subject: params.subject,
    text: params.text,
    html: params.html,
  });
  console.log(`Email sent to ${params.to} (${info.messageId})`);
}
