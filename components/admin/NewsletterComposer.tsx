"use client";

import { useActionState } from "react";
import { sendNewsletterCampaign } from "@/app/admin/newsletter/actions";

type State = { ok: boolean; error: string; message: string };
const initial: State = { ok: false, error: "", message: "" };

export default function NewsletterComposer() {
  const [state, action, pending] = useActionState(sendNewsletterCampaign, initial);
  return (
    <form action={action}>
      <div className="mb-20">
        <label className="font-small font-weight-600" htmlFor="nl-subject">Subject</label>
        <input
          id="nl-subject"
          name="subject"
          type="text"
          className="form-control"
          required
          maxLength={200}
          placeholder="Monthly wealth digest"
        />
      </div>
      <div className="mb-20">
        <label className="font-small font-weight-600" htmlFor="nl-body">Message</label>
        <textarea
          id="nl-body"
          name="body"
          className="form-control"
          rows={8}
          required
          maxLength={20000}
          placeholder="Write the newsletter body. Plain text plus line breaks is fine."
        />
      </div>
      {state.error && <p role="alert" className="text-danger font-small">{state.error}</p>}
      {state.ok && state.message && <p role="status" className="text-success font-small">{state.message}</p>}
      <button type="submit" className="btn bg-primary text-white" disabled={pending}>
        {pending ? "Sending…" : "Send campaign"}
      </button>
    </form>
  );
}