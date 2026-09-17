// Sets the password for an existing admin (ADMIN_EMAIL) from ADMIN_PASSWORD.
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
const email = ADMIN_EMAIL?.trim().toLowerCase();
if (!email || !ADMIN_PASSWORD || ADMIN_PASSWORD.length < 12 || Buffer.byteLength(ADMIN_PASSWORD) > 72) {
  console.error("Set ADMIN_EMAIL and a 12+ character ADMIN_PASSWORD (at most 72 bytes) in .env.");
  process.exit(1);
}
const prisma = new PrismaClient();
try {
  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin) throw new Error("no such admin");
  await prisma.admin.update({ where: { email }, data: { passwordHash: await hash(ADMIN_PASSWORD, 12), active: true } });
  console.log("Admin password updated for the configured ADMIN_EMAIL. Remove ADMIN_PASSWORD from .env when done.");
} catch {
  console.error("Password update failed. Check ADMIN_EMAIL against the existing admin records.");
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
