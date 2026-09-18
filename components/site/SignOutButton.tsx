"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignOutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  return (
    <button
      type="button"
      className="button button-contactForm btn-block"
      disabled={pending}
      onClick={async () => {
        setPending(true);
        await signOut({ redirect: false });
        router.replace("/");
        router.refresh();
      }}
    >
      {pending ? "Signing out…" : "Sign out"}
    </button>
  );
}