"use client";

import { useActionState } from "react";
import Link from "next/link";
import { resetPassword } from "@/lib/reader-auth";

type State = { ok: boolean; error: string; message: string };
const initial: State = { ok: false, error: "", message: "" };

export default function ResetPasswordForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState(
    async (_prev: State, data: FormData): Promise<State> => {
      try {
        const result = await resetPassword(data);
        if (result.ok) return { ok: true, error: "", message: "Your password has been updated." };
        return { ok: false, error: result.error ?? "Reset failed.", message: "" };
      } catch (error) {
        return { ok: false, error: error instanceof Error ? error.message : "Reset failed. Please try again.", message: "" };
      }
    },
    initial,
  );
  return (
    <form action={action}>
      <input type="hidden" name="token" value={token} />
      <div className="form-group">
        <input type="email" required className="form-control" name="email" placeholder="Your Email" autoComplete="email" maxLength={254} />
        <small className="text-muted">Confirm the email the reset link was sent to.</small>
      </div>
      <div className="form-group">
        <input className="form-control" required type="password" name="password" placeholder="New password" autoComplete="new-password" minLength={12} />
        <small className="text-muted">At least 12 characters with a number, an uppercase letter, and a lowercase letter.</small>
      </div>
      <div className="form-group">
        <input className="form-control" required type="password" name="password_confirm" placeholder="Confirm new password" autoComplete="new-password" minLength={12} />
      </div>
      {state.error && <p role="alert" className="text-danger">{state.error}</p>}
      {state.ok && state.message && (
        <p role="status" className="text-success">
          {state.message} <Link href="/login">Sign in</Link>
        </p>
      )}
      <div className="form-group">
        <button type="submit" className="button button-contactForm btn-block" disabled={pending || state.ok}>
          {pending ? "Updating…" : "Set new password"}
        </button>
      </div>
    </form>
  );
}