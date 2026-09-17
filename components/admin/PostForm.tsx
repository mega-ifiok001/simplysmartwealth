"use client";
import { useActionState } from "react";
import { savePost, deletePost } from "@/app/admin/actions";

type CategoryOption = { id: string; name: string };
type EditablePost = {
  id: string; title: string; slug: string; excerpt: string; content: string;
  featured: boolean; publicationDate: string;
  status: "DRAFT" | "PUBLISHED"; coverUrl: string | null; coverAlt: string; selectedCategoryIds: string[];
};
export default function PostForm({ post, categories }: { post?: EditablePost; categories: CategoryOption[] }) {
  const [state, action, pending] = useActionState(savePost.bind(null, post?.id ?? null), { error: "" });
  const [deletion, remove, deleting] = useActionState(deletePost.bind(null, post?.id ?? ""), { error: "" });
  return <>
    <form action={action}>
      <fieldset disabled={pending || deleting}>
        <label>Title<input name="title" defaultValue={post?.title} required minLength={3} maxLength={180} /></label>
        <label>URL slug<input name="slug" defaultValue={post?.slug} required minLength={3} maxLength={160} pattern="[a-z0-9]+(-[a-z0-9]+)*" placeholder="my-first-post" /></label>
        <label>Excerpt<textarea name="excerpt" defaultValue={post?.excerpt} required minLength={10} maxLength={500} rows={3} /></label>
        <label>Article content (plain text)<textarea name="content" defaultValue={post?.content} required minLength={20} maxLength={100000} rows={18} /></label>
        <label>Status<select name="status" defaultValue={post?.status ?? "DRAFT"}><option value="DRAFT">Draft (private)</option><option value="PUBLISHED">Published (public)</option></select></label>
        <label>Publication date and time (UTC)<input name="publicationDate" type="datetime-local" min="2000-01-01T00:00" defaultValue={post?.publicationDate ?? ""} /></label>
        <p>Choose Published and a future UTC time to schedule. Leave blank to preserve the existing date, or publish a new post immediately. Drafts remain private and clear their publication date.</p>
        <label className="admin-check"><input name="featured" type="checkbox" defaultChecked={post?.featured ?? false} /> Feature on homepage when published</label>
        <fieldset><legend>Categories (up to 5)</legend>
          {categories.length ? categories.map(category => <label key={category.id} className="admin-check">
            <input type="checkbox" name="categoryIds" value={category.id}
              defaultChecked={post?.selectedCategoryIds.includes(category.id)} /> {category.name}</label>)
            : <p>No categories yet. <a href="/admin/categories/new">Create one</a>.</p>}
        </fieldset>
        {post?.coverUrl && <img src={post.coverUrl} alt={post.coverAlt} className="admin-cover" />}
        <label>Cover image (JPEG, PNG or WebP, up to 4 MB)<input type="file" name="cover" accept="image/jpeg,image/png,image/webp" /></label>
        <label>Cover image description<input name="coverAlt" defaultValue={post?.coverAlt ?? ""} maxLength={250} /></label>
        <p>Uploading a new image replaces this post’s cover. Existing Cloudinary assets are retained.</p>
        {state.error && <p role="alert" className="admin-error">{state.error}</p>}
        <button type="submit">{pending ? "Saving…" : "Save post"}</button>
      </fieldset>
    </form>
    {post && <form action={remove} onSubmit={event => {
      if (!window.confirm("Permanently delete this post? This cannot be undone.")) event.preventDefault();
    }}>
      {deletion.error && <p role="alert" className="admin-error">{deletion.error}</p>}
      <button className="admin-danger" disabled={deleting || pending} type="submit">{deleting ? "Deleting…" : "Delete post"}</button>
    </form>}
  </>;
}
