import { Resend } from "resend";

export interface SendEmailParams {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

let resend: Resend | null = null;

function getResend(): Resend {
  if (resend) return resend;
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Resend is not configured. Set RESEND_API_KEY (and EMAIL_FROM on a domain verified in Resend), or set EMAIL_MODE=console.",
    );
  }
  resend = new Resend(apiKey);
  return resend;
}

function sender(): string {
  return process.env.EMAIL_FROM ?? "Simply Smart Wealth <noreply@localhost>";
}

/**
 * Sends an email through the Resend API. In development (EMAIL_MODE=console)
 * the message is printed to the server log instead of being delivered.
 */
export async function sendEmail(params: SendEmailParams): Promise<void> {
  const mode =
    process.env.EMAIL_MODE ??
    (process.env.NODE_ENV === "production" ? "resend" : "console");

  if (mode === "console") {
    console.log("\n===== EMAIL (console mode) =====");
    console.log("From:", sender());
    console.log("To:", params.to);
    console.log("Subject:", params.subject);
    console.log(params.html ?? params.text);
    console.log("================================\n");
    return;
  }

  if (mode !== "resend") {
    throw new Error(`Unknown EMAIL_MODE "${mode}" (expected "resend" or "console").`);
  }

  const { data, error } = await getResend().emails.send({
    from: sender(),
    to: params.to,
    subject: params.subject,
    text: params.text,
    html: params.html,
  });
  if (error) {
    throw new Error(`Resend rejected the message: ${error.message}`);
  }
  console.log(`Email sent to ${params.to} (${data?.id ?? "no-id"})`);
}
