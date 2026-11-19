import { Mail } from "lucide-react";
import { configuredEmail, site } from "../seo";

function GithubIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65S8.93 17.5 9 18v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function LinkedinIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.24 8.48h4.52V24H.24V8.48zM8.34 8.48h4.33v2.12h.06c.6-1.14 2.08-2.34 4.28-2.34 4.58 0 5.42 3.01 5.42 6.93V24h-4.51v-7.67c0-1.83-.03-4.18-2.55-4.18-2.55 0-2.94 1.99-2.94 4.05V24H8.34V8.48z" />
    </svg>
  );
}

const icons = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  email: Mail,
};

function resolveHref(key) {
  if (key === "email") {
    const email = configuredEmail();
    return email ? `mailto:${email}` : "";
  }
  if (key === "github") return safe(site.github);
  if (key === "linkedin") return safe(site.linkedin);
  return "";
}

function safe(value) {
  if (!value) return "";
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" && url.protocol !== "http:") return "";
    return url.href;
  } catch {
    return "";
  }
}

export default function SocialLinks({ items = ["github", "linkedin"], className = "" }) {
  return (
    <ul className={`flex items-center gap-2 ${className}`}>
      {items.map((key) => {
        const Icon = icons[key];
        const href = resolveHref(key);
        const label = key === "email" ? "Email" : key === "github" ? "GitHub" : "LinkedIn";
        const classNames =
          "inline-flex h-11 w-11 items-center justify-center rounded-full border border-line text-paper transition hover:border-[#3f3f46] hover:bg-white/[0.04]";

        return (
          <li key={key}>
            {href ? (
              <a
                href={href}
                className={classNames}
                target={key === "email" ? undefined : "_blank"}
                rel={key === "email" ? undefined : "me noopener noreferrer"}
                aria-label={key === "email" ? "Email" : `${label} (opens in a new tab)`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
              </a>
            ) : (
              <span role="img" className={`${classNames} cursor-default text-mist hover:border-line hover:bg-transparent`} title={`${label} has not been added yet`} aria-label={`${label} has not been added yet`}>
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
