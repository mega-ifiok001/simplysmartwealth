"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  return <form onSubmit={async event => {
    event.preventDefault();
    setPending(true); setError("");
    const data = new FormData(event.currentTarget);
    try {
      const result = await signIn("admin", {
        email: data.get("email"), password: data.get("password"), redirect: false,
      });
      if (result?.ok && !result.error) { router.replace("/admin"); router.refresh(); }
      else setError("Sign-in failed. Check your credentials or wait 15 minutes after repeated attempts.");
    } catch { setError("Sign-in is unavailable. Please try again later."); }
    finally { setPending(false); }
  }}>
    <label>Email<input name="email" type="email" autoComplete="username" required maxLength={254} /></label>
    <label>Password<input name="password" type="password" autoComplete="current-password" required minLength={12} /></label>
    {error && <p role="alert" className="admin-error">{error}</p>}
    <button disabled={pending} type="submit">{pending ? "Signing in…" : "Sign in"}</button>
  </form>;
}
