"use client";

import { useActionState } from "react";
import { subscribeNewsletter } from "@/lib/newsletter";

type State = { ok: boolean; error: string; message: string };
const initial: State = { ok: false, error: "", message: "" };

export default function NewsletterForm() {
  const [state, action, pending] = useActionState(
    async (prev: State, data: FormData): Promise<State> => {
      try {
        return await subscribeNewsletter(prev, data);
      } catch {
        return { ok: false, error: "Could not subscribe right now. Please try again later.", message: "" };
      }
    },
    initial,
  );
  return (
    <form action={action} className="input-group form-subcriber mt-30 d-flex flex-column">
      <div className="d-flex w-100">
        <input
          type="email"
          name="email"
          required
          maxLength={254}
          className="form-control bg-white font-small"
          placeholder="Enter your email"
          autoComplete="email"
        />
        <button className="btn bg-primary text-white text-nowrap" type="submit" disabled={pending}>
          {pending ? "Subscribing…" : "Subscribe"}
        </button>
      </div>
      <label className="mt-20 font-small">
        <input className="mr-5" name="consent" type="checkbox" required />{" "}
        I agree to the <a href="/terms" target="_blank">terms &amp; conditions</a>
      </label>
      <label className="mt-20 font-small">
        <input className="mr-5" name="consent" type="checkbox" required />{" "}
        I agree to the <a href="/terms" target="_blank">terms &amp; conditions</a>
      </label>
      {state.error && <p role="alert" className="text-danger font-small mb-0">{state.error}</p>}
      {state.ok && state.message && <p role="status" className="text-success font-small mb-0">{state.message}</p>}
    </form>
  );
}