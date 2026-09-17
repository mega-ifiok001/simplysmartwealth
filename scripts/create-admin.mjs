import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const { ADMIN_EMAIL, ADMIN_NAME, ADMIN_PASSWORD } = process.env;
const email = ADMIN_EMAIL?.trim().toLowerCase();
if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254
    || !ADMIN_NAME?.trim() || !ADMIN_PASSWORD || ADMIN_PASSWORD.length < 12
    || Buffer.byteLength(ADMIN_PASSWORD) > 72) {
  console.error("Set ADMIN_EMAIL, ADMIN_NAME and a 12+ character ADMIN_PASSWORD (at most 72 bytes) in .env.");
  process.exit(1);
}
const prisma = new PrismaClient();
try {
  if (await prisma.admin.count()) throw new Error("An admin already exists. Bootstrap only creates the first admin.");
  await prisma.admin.create({ data: { email, name: ADMIN_NAME.trim(), passwordHash: await hash(ADMIN_PASSWORD, 12) } });
  console.log("First admin created. Remove ADMIN_PASSWORD from your environment now.");
} catch {
  console.error("Admin creation failed. Check configuration, migrations, and whether an admin already exists.");
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
