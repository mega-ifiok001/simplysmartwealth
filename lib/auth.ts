import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { createHash } from "node:crypto";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { validCredentials, validateReaderCredentials } from "@/lib/validation";
import { overLimit } from "@/lib/rate-limit";

// A fixed bcrypt hash keeps missing-account comparisons expensive too, so
// unknown addresses are indistinguishable from wrong passwords by timing.
const DUMMY_HASH = "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxD6jIQivAiHnHHIHfL8VH3D6Re";

function loginKey(email: string): string {
  return createHash("sha256").update(email).digest("hex");
}

/**
 * One NextAuth configuration serves both audiences through two separate
 * credentials providers ("admin" and "reader"). The JWT/session carry a role
 * so admin and reader sessions can never be confused with one another, and
 * every guard below re-checks the database so deleted or deactivated
 * accounts lose access the moment their session is used.
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
        if (await overLimit(`login:${loginKey(email)}`, 5, 15 * 60 * 1000)) return null;
        const admin = await prisma.admin.findUnique({ where: { email } });
        const matches = await compare(password, admin?.passwordHash ?? DUMMY_HASH);
        if (!admin?.active || !matches) return null;
        return { id: admin.id, name: admin.name, email: admin.email, role: "admin" as const };
      },
    }),
    CredentialsProvider({
      id: "reader",
      name: "Reader credentials",
      credentials: { email: { type: "email" }, password: { type: "password" } },
      async authorize(credentials) {
        try {
          const input = validateReaderCredentials(credentials?.email, credentials?.password);
          if (await overLimit(`reader-login:${loginKey(input.email)}`, 6, 15 * 60 * 1000)) return null;
          const reader = await prisma.reader.findUnique({ where: { email: input.email } });
          const matches = await compare(input.password, reader?.passwordHash ?? DUMMY_HASH);
          if (!reader?.emailVerified || !matches) return null;
          return { id: reader.id, name: reader.name ?? input.email, email: reader.email, role: "reader" as const };
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.role = user.role === "reader" ? "reader" : "admin";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = typeof token.sub === "string" ? token.sub : "";
        session.user.role = token.role === "reader" ? "reader" : "admin";
      }
      return session;
    },
  },
};

export async function getAdmin() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin" || !session.user.id) return null;
  return prisma.admin.findFirst({
    where: { id: session.user.id, active: true },
    select: { id: true, name: true, email: true },
  });
}

export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}

export async function getReader() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "reader" || !session.user.id) return null;
  const reader = await prisma.reader.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, emailVerified: true },
  });
  return reader?.emailVerified ? reader : null;
}