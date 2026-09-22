"use client";
import { useActionState } from "react";
import { submitComment } from "@/app/public-actions";

/**
 * Comment form used both for new top-level comments and for replies.
 * `parentId` is bound server-side via the action's first arguments.
 */
export default function CommentForm({
  postId,
  parentId = null,
  compact = false,
}: {
  postId: string;
  parentId?: string | null;
  compact?: boolean;
}) {
  const [state, action, pending] = useActionState(
    submitComment.bind(null, postId, parentId),
    { ok: false, error: "" },
  );
  return <form action={action} className={compact ? "mt-10" : "mt-30"}>
    {/* Honeypot: hidden from people, filled by bots. Real submissions never
        include a value here, so anything with it is silently discarded. */}
    <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", top: 0, height: 0, overflow: "hidden" }}>
      <label>Website<input name="website" type="text" tabIndex={-1} autoComplete="off" /></label>
    </div>
    <label className="d-block mb-15">Your name
      <input className="form-control mt-5" name="name" required minLength={2} maxLength={60} />
    </label>
    <label className="d-block mb-15">{parentId ? "Your reply" : "Comment"}
      <textarea className="form-control mt-5" name="content" required minLength={5} maxLength={2000} rows={compact ? 3 : 4} />
    </label>
    {state.ok ? <p role="status" className="text-success">Thanks — your comment has been posted.</p>
      : state.error ? <p role="alert" className="text-danger">{state.error}</p> : null}
    <button type="submit" className="button button-contactForm" disabled={pending}>
      {pending ? "Submitting…" : parentId ? "Post reply" : "Post comment"}</button>
  </form>;
}
