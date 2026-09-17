"use client";
import { useActionState } from "react";
import { submitComment } from "@/app/public-actions";

export default function CommentForm({ postId }: { postId: string }) {
  const [state, action, pending] = useActionState(submitComment.bind(null, postId), { ok: false, error: "" });
  return <form action={action} className="mt-30">
    <label className="d-block mb-15">Your name
      <input className="form-control mt-5" name="name" required minLength={2} maxLength={60} />
    </label>
    <label className="d-block mb-15">Comment
      <textarea className="form-control mt-5" name="content" required minLength={5} maxLength={2000} rows={4} />
    </label>
    {state.ok ? <p role="status" className="text-success">Thanks — your comment is awaiting moderation.</p>
      : state.error ? <p role="alert" className="text-danger">{state.error}</p> : null}
    <button type="submit" className="button button-contactForm" disabled={pending}>
      {pending ? "Submitting…" : "Post comment"}</button>
  </form>;
}
