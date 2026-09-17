"use client";
import { useActionState } from "react";
import { saveSettings } from "@/app/admin/settings/actions";
import { settingFields, type SiteSettings, type SettingKey } from "@/lib/settings-validation";
export default function SettingsForm({ values }: { values: SiteSettings }) {
  const [state, action, pending] = useActionState(saveSettings, { error: "", saved: false });
  return <form action={action}>
    {(Object.keys(settingFields) as SettingKey[]).map(key => <label key={key} className="d-block mb-20" htmlFor={`setting-${key}`}>
      {settingFields[key].label}
      {settingFields[key].max > 500 ? <textarea id={`setting-${key}`} name={key} defaultValue={values[key]} rows={6} maxLength={settingFields[key].max} />
        : <input id={`setting-${key}`} name={key} defaultValue={values[key]} maxLength={settingFields[key].max} />}
    </label>)}
    {state.error && <p role="alert">{state.error}</p>}
    {state.saved && <p role="status">Settings saved.</p>}
    <button disabled={pending}>{pending ? "Saving…" : "Save settings"}</button>
  </form>;
}
