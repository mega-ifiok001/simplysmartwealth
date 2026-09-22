"use client";
import { useState } from "react";
import CommentForm from "@/components/CommentForm";

export type ThreadComment = {
  id: string;
  authorName: string;
  content: string;
  /** Preformatted on the server so the markup cannot drift while hydrating. */
  createdAt: string;
  replies: ThreadComment[];
};

function CommentBody({ comment, muted = false }: { comment: ThreadComment; muted?: boolean }) {
  return (
    <>
      <p className="mb-10">
        <strong>{comment.authorName}</strong>{" "}
        <span className="ml-10 font-x-small text-muted">{comment.createdAt}</span>
      </p>
      <p
        className={"font-small mb-0" + (muted ? " text-muted" : "")}
        style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}
      >
        {comment.content}
      </p>
    </>
  );
}

/**
 * One top-level comment with its replies and an inline reply form.
 * Replies render a single level deep; the server flattens a reply-to-a-reply
 * onto the same thread so nesting never grows.
 */
export default function CommentThread({ postId, comment }: { postId: string; comment: ThreadComment }) {
  const [replying, setReplying] = useState(false);
  const replyCount = comment.replies.length;
  return (
    <div className="bg-white has-border p-25 border-radius-5 mb-20">
      <CommentBody comment={comment} />
      {replyCount > 0 && (
        <div className="mt-20 pl-20" style={{ borderLeft: "2px solid #e9ecef" }}>
          {comment.replies.map((reply) => (
            <div key={reply.id} className="mb-20">
              <CommentBody comment={reply} muted />
            </div>
          ))}
        </div>
      )}
      <button
        type="button"
        className="button button-contactForm mt-10 font-small"
        onClick={() => setReplying((open) => !open)}
        aria-expanded={replying}
      >
        {replying ? "Cancel reply" : replyCount > 0 ? `Reply (${replyCount})` : "Reply"}
      </button>
      {replying && (
        <div className="mt-20">
          <p className="font-small text-muted mb-10">
            Replying to <strong>{comment.authorName}</strong>
          </p>
          <CommentForm postId={postId} parentId={comment.id} compact />
        </div>
      )}
    </div>
  );
}