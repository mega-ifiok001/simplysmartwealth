export type PostInput = {
  title: string; slug: string; excerpt: string; content: string;
  status: "DRAFT" | "PUBLISHED"; coverAlt: string; categoryIds: string[];
  featured: boolean; publicationDate: Date | null;
};

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function validSlug(slug: string): boolean {
  return slug.length >= 3 && slug.length <= 160 && SLUG.test(slug);
}

export function validateCategory(data: FormData) {
  const name = (data.get("name") ?? "").toString().trim();
  if (name.length < 2 || name.length > 60) throw new Error("Category name must contain 2–60 characters.");
  const slug = (data.get("slug") ?? "").toString().trim();
  if (!validSlug(slug)) throw new Error("Slug must use lowercase letters, numbers, and single hyphens.");
  const description = (data.get("description") ?? "").toString().trim();
  if (description.length > 300) throw new Error("Description must contain at most 300 characters.");
  return { name, slug, description };
}

export function parsePublicationDate(value: FormDataEntryValue | null): Date | null {
  if (value === null || value === "") return null;
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) {
    throw new Error("Publication date must be a valid UTC date and time.");
  }
  const date = new Date(`${value}:00.000Z`);
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 16) !== value || date.getUTCFullYear() < 2000) {
    throw new Error("Publication date must be a valid UTC date from year 2000 onward.");
  }
  return date;
}

export function publicationTime(status: "DRAFT" | "PUBLISHED", requested: Date | null, previous: Date | null, now = new Date()): Date | null {
  return status === "DRAFT" ? null : requested ?? previous ?? now;
}

export function validatePost(data: FormData): PostInput {
  const text = (key: string, min: number, max: number) => {
    const raw = data.get(key);
    if (typeof raw !== "string") throw new Error(`${key} is required.`);
    const value = raw.trim();
    if (value.length < min || value.length > max) {
      throw new Error(`${key} must contain ${min}–${max} characters.`);
    }
    return value;
  };
  const title = text("title", 3, 180);
  const slug = text("slug", 3, 160);
  if (!SLUG.test(slug)) {
    throw new Error("Slug must use lowercase letters, numbers, and single hyphens.");
  }
  const status = data.get("status");
  if (status !== "DRAFT" && status !== "PUBLISHED") throw new Error("Invalid post status.");
  const categoryIds = data.getAll("categoryIds").filter(
    (id): id is string => typeof id === "string" && id.length >= 20 && id.length <= 40 && /^[a-z0-9]+$/i.test(id),
  );
  return { title, slug, status, excerpt: text("excerpt", 10, 500),
    content: text("content", 20, 100000), coverAlt: text("coverAlt", 0, 250),
    featured: data.get("featured") === "on", publicationDate: parsePublicationDate(data.get("publicationDate")),
    categoryIds: [...new Set(categoryIds)].slice(0, 5) };
}

export function validateComment(data: FormData) {
  const name = (data.get("name") ?? "").toString().trim();
  if (name.length < 2 || name.length > 60) throw new Error("Your name must contain 2–60 characters.");
  const content = (data.get("content") ?? "").toString().trim();
  if (content.length < 5 || content.length > 2000) throw new Error("Comments must contain 5–2000 characters.");
  return { authorName: name, content };
}

export function validateContact(data: FormData) {
  const name = (data.get("name") ?? "").toString().trim();
  if (name.length < 2 || name.length > 80) throw new Error("Your name must contain 2–80 characters.");
  const email = (data.get("email") ?? "").toString().trim().toLowerCase();
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Please enter a valid email address.");
  const phone = (data.get("phone") ?? "").toString().trim();
  if (phone.length > 40) throw new Error("Phone must contain at most 40 characters.");
  const subject = (data.get("subject") ?? "").toString().trim().slice(0, 150);
  const message = (data.get("message") ?? "").toString().trim();
  if (message.length < 10 || message.length > 5000) throw new Error("Messages must contain 10–5000 characters.");
  return { name, email, phone, subject, message };
}

export function validCredentials(email: string, password: string): boolean {
  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    && password.length >= 12 && new TextEncoder().encode(password).length <= 72;
}

export function isPublished(post: { status: string; publishedAt: Date | null }): boolean {
  return post.status === "PUBLISHED" && post.publishedAt !== null && post.publishedAt <= new Date();
}

export function validateEmailAddress(value: string): string {
  const trimmed = value.trim().toLowerCase();
  if (trimmed.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    throw new Error("Enter a valid email address.");
  }
  return trimmed;
}

export function validateReaderPassword(value: string): string {
  if (value.length < 12) throw new Error("Password must contain at least 12 characters.");
  if (new TextEncoder().encode(value).length > 72) throw new Error("Password is too long.");
  if (!/\d/.test(value) || !/[A-Z]/.test(value) || !/[a-z]/.test(value)) {
    throw new Error("Password must include a number, an uppercase letter, and a lowercase letter.");
  }
  return value;
}

export function validateReaderName(value: string): string {
  const trimmed = value.trim();
  if (trimmed.length < 2 || trimmed.length > 60) {
    throw new Error("Name must contain 2–60 characters.");
  }
  return trimmed;
}

export function validateReaderRegister(data: FormData) {
  const name = validateReaderName((data.get("name") ?? "").toString());
  const email = validateEmailAddress((data.get("email") ?? "").toString());
  const password = validateReaderPassword((data.get("password") ?? "").toString());
  const passwordConfirm = (data.get("password_confirm") ?? "").toString();
  if (password !== passwordConfirm) throw new Error("Passwords do not match.");
  return { name, email, password };
}

export function validateReaderSignIn(data: FormData) {
  const email = validateEmailAddress((data.get("email") ?? "").toString());
  const password = (data.get("password") ?? "").toString();
  if (!password) throw new Error("Password is required.");
  return { email, password };
}

/** String-based variant used by the NextAuth "reader" credentials provider. */
export function validateReaderCredentials(
  email: unknown,
  password: unknown,
): { email: string; password: string } {
  if (typeof email !== "string" || typeof password !== "string") {
    throw new Error("Email and password are required.");
  }
  return {
    email: validateEmailAddress(email),
    password,
  };
}

export function validatePasswordResetRequest(data: FormData) {
  return { email: validateEmailAddress((data.get("email") ?? "").toString()) };
}

export function validatePasswordReset(data: FormData) {
  const email = validateEmailAddress((data.get("email") ?? "").toString());
  const password = validateReaderPassword((data.get("password") ?? "").toString());
  const passwordConfirm = (data.get("password_confirm") ?? "").toString();
  const token = (data.get("token") ?? "").toString().trim();
  if (!token) throw new Error("Confirmation token is required.");
  if (password !== passwordConfirm) throw new Error("Passwords do not match.");
  return { email, password, token };
}
