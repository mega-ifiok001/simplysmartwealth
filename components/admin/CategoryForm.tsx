"use client";
import { useActionState } from "react";
import { saveCategory, deleteCategory } from "@/app/admin/actions";

export default function CategoryForm({ category }: { category?: { id: string; name: string; slug: string; description: string } }) {
  const [state, action, pending] = useActionState(saveCategory.bind(null, category?.id ?? null), { error: "" });
  const [deletion, remove, deleting] = useActionState(deleteCategory.bind(null, category?.id ?? ""), { error: "" });
  return <>
    <form action={action}>
      <fieldset disabled={pending || deleting}>
        <label>Name<input name="name" defaultValue={category?.name} required minLength={2} maxLength={60} /></label>
        <label>URL slug<input name="slug" defaultValue={category?.slug} required minLength={3} maxLength={160} pattern="[a-z0-9]+(-[a-z0-9]+)*" placeholder="travel-tips" /></label>
        <label>Description (optional)<textarea name="description" defaultValue={category?.description} maxLength={300} rows={3} /></label>
        {state.error && <p role="alert" className="admin-error">{state.error}</p>}
        <button type="submit">{pending ? "Saving…" : "Save category"}</button>
      </fieldset>
    </form>
    {category && <form action={remove} onSubmit={event => {
      if (!window.confirm("Delete this category? It will be removed from all posts. This cannot be undone.")) event.preventDefault();
    }}>
      {deletion.error && <p role="alert" className="admin-error">{deletion.error}</p>}
      <button className="admin-danger" disabled={deleting || pending} type="submit">{deleting ? "Deleting…" : "Delete category"}</button>
    </form>}
  </>;
}
