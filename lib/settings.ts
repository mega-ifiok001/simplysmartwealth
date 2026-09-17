import { cache } from "react";
import { prisma } from "@/lib/db";
import { defaultSettings, type SettingKey } from "@/lib/settings-validation";
export const getSiteSettings = cache(async () => {
  const values = { ...defaultSettings };
  if (!process.env.DATABASE_URL) return values;
  const rows = await prisma.siteSetting.findMany({ where: { key: { in: Object.keys(values) } }, select: { key: true, value: true } });
  for (const row of rows) values[row.key as SettingKey] = row.value;
  return values;
});
