import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    role?: "admin" | "reader";
  }

  interface Session {
    user: {
      id: string;
      email: string | null;
      name: string | null;
      role: "admin" | "reader";
    } & DefaultSession["user"];
  }
}
