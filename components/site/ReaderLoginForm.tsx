"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ReaderLoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  return (
    <form onSubmit={async event => {
      event.preventDefault();
      setPending(true);
      setError("");
      const data = new FormData(event.currentTarget);
      try {
        const result = await signIn("reader", {
          email: data.get("email"),
          password: data.get("password"),
          redirect: false,
        });
        if (result?.ok && !result.error) {
          router.replace("/");
          router.refresh();
        } else {
          setError("Sign-in failed. Check your credentials, confirm your email, or wait 15 minutes after repeated attempts.");
        }
      } catch {
        setError("Sign-in is unavailable. Please try again later.");
      } finally {
        setPending(false);
      }
    }}>
      <div className="form-group">
        <input type="email" required className="form-control" name="email" placeholder="Your Email" autoComplete="email" maxLength={254} />
      </div>
      <div className="form-group">
        <input className="form-control" required type="password" name="password" placeholder="Password" autoComplete="current-password" minLength={12} />
      </div>
      <div className="login_footer form-group">
        <div className="chek-form">
          <div className="custome-checkbox">
            <input className="form-check-input" type="checkbox" name="remember" id="readerRemember" />
            <label className="form-check-label" htmlFor="readerRemember"><span>Remember me</span></label>
          </div>
        </div>
        <Link className="text-muted" href="/forgot-password">Forgot password?</Link>
      </div>
      {error && <p role="alert" className="text-danger">{error}</p>}
      <div className="form-group">
        <button type="submit" className="button button-contactForm btn-block" disabled={pending}>
          {pending ? "Signing in…" : "Log in"}
        </button>
      </div>
      <div className="text-muted text-center">Don&apos;t have an account? <Link href="/register">Sign up now</Link></div>
    </form>
  );
}