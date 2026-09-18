"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerReader } from "@/lib/reader-auth";

type State = { ok: boolean; error: string; message: string };
const initial: State = { ok: false, error: "", message: "" };

export default function ReaderRegisterForm() {
  const [state, action, pending] = useActionState(
    async (_prev: State, data: FormData): Promise<State> => {
      try {
        const result = await registerReader(data);
        if (result.ok) return { ok: true, error: "", message: result.message ?? "" };
        return { ok: false, error: result.error ?? "Registration failed.", message: "" };
      } catch (error) {
        return { ok: false, error: error instanceof Error ? error.message : "Registration failed.", message: "" };
      }
    },
    initial,
  );
  return (
    <form action={action}>
      <div className="form-group">
        <input type="text" required className="form-control" name="name" placeholder="Your name" minLength={2} maxLength={60} />
      </div>
      <div className="form-group">
        <input type="email" required className="form-control" name="email" placeholder="Email" autoComplete="email" maxLength={254} />
      </div>
      <div className="form-group">
        <input className="form-control" required type="password" name="password" placeholder="Password (12+ characters)" autoComplete="new-password" minLength={12} />
        <small className="text-muted">At least 12 characters with a number, an uppercase letter, and a lowercase letter.</small>
      </div>
      <div className="form-group">
        <input className="form-control" required type="password" name="password_confirm" placeholder="Confirm password" autoComplete="new-password" minLength={12} />
      </div>
      {error_1(state)}
      <div className="form-group">
        <button type="submit" className="button button-contactForm btn-block" disabled={pending}>
          {pending ? "Creating account…" : "Submit & Register"}
        </button>
      </div>
      <div className="text-muted text-center">
        Already have an account? <Link href="/login">Sign in</Link>
      </div>
    </form>
  );
}

function error_1(state: State) {
  if (state.error) return <p role="alert" className="text-danger">{state.error}</p>;
  if (state.ok && state.message) return <p role="status" className="text-success">{state.message}</p>;
  return null;
}