import ContactForm from "@/components/ContactForm";
import PublicPage from "@/components/PublicPage";
import { getSiteSettings } from "@/lib/settings";
export default async function ContactContent() {
  const settings = await getSiteSettings();
  const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.contact_email) ? settings.contact_email : "";
  return <PublicPage><main id="main-content" className="container pt-50 pb-50" style={{ maxWidth: 900 }}>
    <h1 className="mb-30">Contact {settings.site_name}</h1>
    <p>Send your questions or feedback using the form below.</p>
    {email && <p>Email: <a href={`mailto:${email}`}>{email}</a></p>}
    <ContactForm />
  </main></PublicPage>;
}
