import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { createHash } from "node:crypto";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { validCredentials } from "@/lib/validation";
import { overLimit } from "@/lib/rate-limit";

// A fixed bcrypt hash keeps missing-account comparisons expensive too.
const DUMMY_HASH = "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxD6jIQivAiHnHHIHfL8VH3D6Re";

/**
 * Administrators are the only accounts on this site. There is no public
 * sign-up, sign-in, or account recovery; readers comment anonymously.
 */
export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt", maxAge: 60 * 60 * 8 },
  pages: { signIn: "/admin/login" },
  providers: [
    CredentialsProvider({
      id: "admin",
      name: "Admin credentials",
      credentials: { email: { type: "email" }, password: { type: "password" } },
      async authorize(credentials) {
        const email = credentials?.email?.trim().toLowerCase() ?? "";
        const password = credentials?.password ?? "";
        if (!validCredentials(email, password)) return null;
        const key = createHash("sha256").update(email).digest("hex");
        // Shared Postgres-backed limiter (same primitive as public forms).
        if (await overLimit(`login:${key}`, 5, 15 * 60 * 1000)) return null;
        const admin = await prisma.admin.findUnique({ where: { email } });
        const matches = await compare(password, admin?.passwordHash ?? DUMMY_HASH);
        if (!admin?.active || !matches) return null;
        return { id: admin.id, name: admin.name, email: admin.email };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.sub = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user) session.user.id = token.sub ?? "";
      return session;
    },
  },
};

export async function getAdmin() {
  const session = await getServerSession(authOptions);
  const id = session?.user?.id;
  if (!id) return null;
  return prisma.admin.findFirst({ where: { id, active: true }, select: { id: true, name: true, email: true } });
}

export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}