import { useState } from "react";
import { Loader2, Mail, MapPin, Phone, Send } from "lucide-react";
import { contactCopy, site } from "../data/content";
import { configuredEmail } from "../seo";
import { isHoneypotTripped, validateContact } from "../lib/validateContact";
import SectionHeading from "../components/SectionHeading";

const fields = ["name", "email", "subject", "message"];

function profileHref(value) {
  if (!value) return "";
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" && url.protocol !== "http:") return "";
    return url.href;
  } catch {
    return "";
  }
}

function ContactMark({ children }) {
  return (
    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-accent to-signal p-px">
      <span className="grid h-full w-full place-items-center rounded-full bg-ink">{children}</span>
    </span>
  );
}

function LinkedInMark() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-4 w-4">
      <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.24 8.48h4.52V24H.24V8.48zM8.34 8.48h4.33v2.12h.06c.6-1.14 2.08-2.34 4.28-2.34 4.58 0 5.42 3.01 5.42 6.93V24h-4.51v-7.67c0-1.83-.03-4.18-2.55-4.18-2.55 0-2.94 1.99-2.94 4.05V24H8.34V8.48z" />
    </svg>
  );
}

function ContactRow({ label, icon, children }) {
  return (
    <div className="border-t border-line py-4">
      <dt className="text-xs font-medium uppercase tracking-[0.16em] text-mist">{label}</dt>
      <dd className="mt-2 text-base text-paper">
        <div className="flex items-center gap-3">
          <ContactMark>{icon}</ContactMark>
          <div className="min-w-0">{children}</div>
        </div>
      </dd>
    </div>
  );
}

export default function Contact() {
  const [errors, setErrors] = useState({});
  const [formState, setFormState] = useState("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const email = configuredEmail();
  const linkedin = profileHref(site.linkedin);

  function clearError(field) {
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  async function onSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const values = {
      name: String(data.get("name") || ""),
      email: String(data.get("email") || ""),
      subject: String(data.get("subject") || ""),
      message: String(data.get("message") || ""),
    };
    const nextErrors = validateContact(values);
    setErrors(nextErrors);
    setStatusMessage("");

    if (Object.keys(nextErrors).length) {
      setFormState("idle");
      const firstInvalid = fields.find((field) => nextErrors[field]);
      document.getElementById(firstInvalid)?.focus();
      return;
    }

    if (isHoneypotTripped(data.get("bot-field"))) {
      form.reset();
      setFormState("success");
      setStatusMessage("Your message has been sent. Thank you.");
      return;
    }

    if (!window.location.hostname.endsWith(".netlify.app")) {
      setFormState("preview");
      setStatusMessage("This preview checked your message, but it does not deliver it. On the Netlify deployment, the same form sends the message.");
      return;
    }

    setFormState("sending");
    try {
      const body = new URLSearchParams();
      for (const [key, value] of data.entries()) {
        body.append(key, typeof value === "string" ? value.trim() : value);
      }
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });
      if (!response.ok) throw new Error("Form request failed");
      form.reset();
      setFormState("success");
      setStatusMessage("Your message has been sent. Thank you.");
    } catch {
      setFormState("error");
      setStatusMessage("The message could not be sent. Please try again in a moment.");
    }
  }

  return (
    <section id="contact" aria-labelledby="contact-heading" className="shell py-14 sm:py-16">
      <div className="grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
        <div>
          <SectionHeading id="contact-heading" index="06" eyebrow="Contact" title={contactCopy.title} subtitle={contactCopy.text} />
          <address className="mt-10 not-italic">
            <dl>
              <ContactRow label="Location" icon={<MapPin className="h-4 w-4" aria-hidden="true" />}>
                {site.location}
              </ContactRow>
              <ContactRow label="Contact" icon={<Phone className="h-4 w-4" aria-hidden="true" />}>
                <a className="hover:text-white" href={site.phoneHref}>
                  {site.phoneDisplay}
                </a>
              </ContactRow>
              <ContactRow label="Email" icon={<Mail className="h-4 w-4" aria-hidden="true" />}>
                {email ? (
                  <a className="break-words underline decoration-line underline-offset-4 hover:decoration-accent" href={`mailto:${email}`}>
                    {email}
                  </a>
                ) : (
                  "Not added yet"
                )}
              </ContactRow>
              <ContactRow label="LinkedIn" icon={<LinkedInMark />}>
                {linkedin ? (
                  <a className="break-all underline decoration-line underline-offset-4 hover:decoration-accent" href={linkedin} target="_blank" rel="me noopener noreferrer">
                    {linkedin.replace(/^https?:\/\//, "")}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                ) : (
                  "Not added yet"
                )}
              </ContactRow>
            </dl>
          </address>
        </div>

        {formState === "success" ? (
          <div className="surface p-8" role="status">
            <h3 className="font-serif text-3xl text-paper">Message sent.</h3>
            <p className="mt-3 leading-7 text-mist">{statusMessage}</p>
            <button
              type="button"
              className="btn btn-secondary mt-6"
              onClick={() => {
                setFormState("idle");
                setStatusMessage("");
                setErrors({});
              }}
            >
              Send another message
            </button>
          </div>
        ) : (
          <form
            className="surface p-6 sm:p-8"
            name="contact"
            method="POST"
            action="/"
            data-netlify="true"
            data-netlify-honeypot="bot-field"
            noValidate
            aria-busy={formState === "sending"}
            onSubmit={onSubmit}
          >
            <input type="hidden" name="form-name" value="contact" />
            <p className="sr-only" aria-hidden="true">
              <label>
                Don’t fill this out if you’re human
                <input name="bot-field" tabIndex={-1} autoComplete="off" />
              </label>
            </p>
            <p className="text-sm text-mist">All fields are required.</p>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <Field id="name" label="Name" autoComplete="name" maxLength={100} error={errors.name} onInput={() => clearError("name")} disabled={formState === "sending"} />
              <Field id="email" label="Email" type="email" autoComplete="email" inputMode="email" maxLength={200} error={errors.email} onInput={() => clearError("email")} disabled={formState === "sending"} />
            </div>
            <div className="mt-5">
              <Field id="subject" label="Subject" autoComplete="off" maxLength={150} error={errors.subject} onInput={() => clearError("subject")} disabled={formState === "sending"} />
            </div>
            <div className="mt-5">
              <Field id="message" label="Message" multiline maxLength={5000} error={errors.message} onInput={() => clearError("message")} disabled={formState === "sending"} />
            </div>
            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <button className="btn btn-primary" type="submit" disabled={formState === "sending"}>
                {formState === "sending" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Send className="h-4 w-4" aria-hidden="true" />}
                {formState === "sending" ? "Sending…" : "Send Message"}
              </button>
              {statusMessage ? (
                <p role={formState === "error" ? "alert" : "status"} className={formState === "error" ? "text-sm text-[#fecaca]" : "text-sm text-mist"}>
                  {statusMessage}
                </p>
              ) : null}
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

function Field({ id, label, type = "text", multiline = false, error, onInput, ...props }) {
  const describedBy = error ? `${id}-error` : undefined;
  const className = `field ${error ? "border-[#fecaca]" : ""}`;
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm text-paper">
        {label}
      </label>
      {multiline ? (
        <textarea id={id} name={id} rows={6} className={className} aria-invalid={error ? "true" : undefined} aria-describedby={describedBy} onInput={onInput} {...props} />
      ) : (
        <input id={id} name={id} type={type} className={className} aria-invalid={error ? "true" : undefined} aria-describedby={describedBy} onInput={onInput} {...props} />
      )}
      {error ? (
        <p id={`${id}-error`} className="mt-2 text-sm text-[#fecaca]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
