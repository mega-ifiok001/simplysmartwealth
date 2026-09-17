"use server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { validateSettings } from "@/lib/settings-validation";
export async function saveSettings(_state: { error: string; saved: boolean }, data: FormData) {
  const admin = await requireAdmin();
  const permission = await prisma.admin.findUnique({ where: { id: admin.id }, select: { role: true } });
  if (permission?.role !== "ADMIN") return { error: "Administrator permissions are required.", saved: false };
  let values;
  try { values = validateSettings(data); }
  catch (error) { return { error: error instanceof Error ? error.message : "Invalid settings.", saved: false }; }
  try {
    await prisma.$transaction(async tx => {
      for (const [key, value] of Object.entries(values)) await tx.siteSetting.upsert({ where: { key }, create: { key, value }, update: { value } });
      await tx.auditLog.create({ data: { adminId: admin.id, action: "UPDATE", entity: "SiteSettings", entityId: "site" } });
    });
  } catch { return { error: "Could not save settings. Please try again.", saved: false }; }
  revalidatePath("/", "layout");
  return { error: "", saved: true };
}
