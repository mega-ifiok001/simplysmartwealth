/**
 * Estimates reading time in milliseconds for a body of text,
 * based on ~200 words per minute.
 */
export function readingTimeMs(text: string | undefined): number {
  if (!text) return 0;
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = words / 200;
  return Math.max(1, Math.round(minutes)) * 60 * 1000;
}