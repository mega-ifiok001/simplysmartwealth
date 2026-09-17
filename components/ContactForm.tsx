"use client";
import { useActionState } from "react";
import { submitContact } from "@/app/public-actions";

export default function ContactForm() {
  const [state, action, pending] = useActionState(submitContact, { ok: false, error: "" });
  return <form action={action} className="form-contact comment_form" id="commentForm">
    <div className="row">
      <div className="col-sm-6">
        <div className="form-group"><input className="form-control" name="name" type="text" placeholder="Name" required minLength={2} maxLength={80} /></div>
      </div>
      <div className="col-sm-6">
        <div className="form-group"><input className="form-control" name="email" type="email" placeholder="Email" required maxLength={254} /></div>
      </div>
      <div className="col-12">
        <div className="form-group"><input className="form-control" name="phone" type="text" placeholder="Phone" maxLength={40} /></div>
      </div>
      <div className="col-12">
        <div className="form-group"><input className="form-control" name="subject" type="text" placeholder="Subject" maxLength={150} /></div>
      </div>
      <div className="col-12">
        <div className="form-group"><textarea className="form-control w-100" name="message" cols={30} rows={9} placeholder="Message" required minLength={10} maxLength={5000} /></div>
      </div>
    </div>
    <div className="form-group"><button type="submit" className="button button-contactForm" disabled={pending}>{pending ? "Sending…" : "Send message"}</button></div>
    {state.ok ? <p role="status" className="text-success mt-15">Thank you — your message has been received.</p>
      : state.error ? <p role="alert" className="text-danger mt-15">{state.error}</p> : null}
  </form>;
}
