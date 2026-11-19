import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getJsonLd, getSeo, site } from "../seo";

function upsertMeta(attribute, key, content) {
  const selector = `meta[${attribute}="${key}"]`;
  let element = document.head.querySelector(selector);
  if (!content) {
    element?.remove();
    return;
  }
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

function upsertCanonical(href) {
  let element = document.head.querySelector('link[rel="canonical"]');
  if (!href) {
    element?.remove();
    return;
  }
  if (!element) {
    element = document.createElement("link");
    element.rel = "canonical";
    document.head.appendChild(element);
  }
  element.href = href;
}

export default function SeoHead() {
  const { pathname } = useLocation();
  const seo = getSeo(pathname);
  const jsonLd = getJsonLd(pathname);

  useEffect(() => {
    document.title = seo.title;
    upsertMeta("name", "description", seo.description);
    upsertMeta("name", "robots", seo.robots);
    upsertMeta("name", "author", site.name);
    upsertCanonical(seo.canonical);
    upsertMeta("property", "og:type", seo.ogType);
    upsertMeta("property", "og:site_name", site.name);
    upsertMeta("property", "og:locale", "en_US");
    upsertMeta("property", "og:title", seo.title);
    upsertMeta("property", "og:description", seo.description);
    upsertMeta("property", "og:url", seo.canonical || `${site.url}/`);
    upsertMeta("property", "og:image", seo.image);
    upsertMeta("property", "og:image:width", "1200");
    upsertMeta("property", "og:image:height", "630");
    upsertMeta("property", "og:image:alt", seo.imageAlt);
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", seo.title);
    upsertMeta("name", "twitter:description", seo.description);
    upsertMeta("name", "twitter:image", seo.image);
    upsertMeta("name", "twitter:image:alt", seo.imageAlt);
    upsertMeta("property", "profile:first_name", seo.ogType === "profile" ? site.givenName : "");
    upsertMeta("property", "profile:last_name", seo.ogType === "profile" ? site.familyName : "");
  }, [pathname]);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
    />
  );
}
