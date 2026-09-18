"use client";

import { useActionState } from "react";
import Link from "next/link";
import { requestPasswordReset } from "@/lib/reader-auth";

type State = { ok: boolean; error: string; message: string };
const initial: State = { ok: false, error: "", message: "" };

export default function ForgotPasswordForm() {
  const [state, action, pending] = useActionState(
    async (_prev: State, data: FormData): Promise<State> => {
      try {
        const result = await requestPasswordReset(data);
        return { ok: result.ok, error: "", message: result.message };
      } catch {
        return { ok: false, error: "Request failed. Please try again.", message: "" };
      }
    },
    initial,
  );
  return (
    <form action={action}>
      <div className="form-group">
        <input type="email" required className="form-control" name="email" placeholder="Your Email" autoComplete="email" maxLength={254} />
      </div>
      {state.error && <p role="alert" className="text-danger">{state.error}</p>}
      {state.ok && state.message && <p role="status" className="text-success">{state.message}</p>}
      <div className="form-group">
        <button type="submit" className="button button-contactForm btn-block" disabled={pending}>
          {pending ? "Sending…" : "Send reset link"}
        </button>
      </div>
      <div className="text-muted text-center">
        Remembered it? <Link href="/login">Sign in</Link>
      </div>
    </form>
  );
}