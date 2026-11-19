import {
  allSkills,
  findProject,
  projects,
  site,
} from "./data/content.js";

export { site };

export function normalizePath(pathname = "/") {
  const path = String(pathname).split("?")[0].split("#")[0] || "/";
  if (path.length > 1 && path.endsWith("/")) return path.slice(0, -1);
  return path || "/";
}

export function absoluteUrl(pathname = "/") {
  const path = normalizePath(pathname);
  return path === "/" ? `${site.url}/` : `${site.url}${path}`;
}

export function publicPaths() {
  return ["/", ...projects.map((project) => `/projects/${project.slug}`)];
}

export function resolvePage(pathname) {
  const path = normalizePath(pathname);
  if (path === "/") return { type: "home", path };
  const match = path.match(/^\/projects\/([^/]+)$/);
  if (match) {
    const project = findProject(match[1]);
    if (project) return { type: "project", path, project };
  }
  return { type: "notfound", path };
}

export function getSeo(pathname) {
  const page = resolvePage(pathname);
  const image = absoluteUrl(site.ogImage);
  const imageAlt = `${site.name}, Full Stack Developer in ${site.location}`;

  if (page.type === "home") {
    return {
      title: `${site.name} | Full Stack Developer in Pakistan`,
      description: site.description,
      canonical: absoluteUrl("/"),
      robots: "index,follow,max-image-preview:large",
      ogType: "profile",
      image,
      imageAlt,
      indexable: true,
    };
  }

  if (page.type === "project") {
    return {
      title: `${page.project.name} | ${site.name}`,
      description: page.project.seoDescription,
      canonical: absoluteUrl(page.path),
      robots: "index,follow,max-image-preview:large",
      ogType: "website",
      image,
      imageAlt: `${page.project.name}. ${imageAlt}`,
      indexable: true,
    };
  }

  return {
    title: `Page not found | ${site.name}`,
    description: `This page is not part of ${site.name}'s portfolio.`,
    canonical: "",
    robots: "noindex, follow",
    ogType: "website",
    image,
    imageAlt,
    indexable: false,
  };
}

function externalProfile(value) {
  if (!value) return "";
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" && url.protocol !== "http:") return "";
    return url.href;
  } catch {
    return "";
  }
}

export function configuredProfiles() {
  return [externalProfile(site.github), externalProfile(site.linkedin)].filter(Boolean);
}

export function configuredEmail() {
  const email = site.email.trim();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "";
  return email;
}

function personNode() {
  const person = {
    "@type": "Person",
    "@id": `${site.url}/#person`,
    name: site.name,
    alternateName: site.shortName,
    givenName: site.givenName,
    familyName: site.familyName,
    jobTitle: site.title,
    description: site.description,
    url: `${site.url}/`,
    image: absoluteUrl(site.portrait),
    worksFor: {
      "@type": "Organization",
      name: site.company,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: site.locality,
      addressCountry: site.countryCode,
    },
    knowsAbout: allSkills,
  };

  const email = configuredEmail();
  if (email) person.email = email;
  if (site.phoneHref) person.telephone = site.phoneHref.replace(/^tel:/, "");

  const sameAs = configuredProfiles();
  if (sameAs.length) person.sameAs = sameAs;

  return person;
}

export function getJsonLd(pathname) {
  const page = resolvePage(pathname);
  const seo = getSeo(pathname);

  if (page.type === "home") {
    return {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebSite",
          "@id": `${site.url}/#website`,
          url: `${site.url}/`,
          name: site.name,
          description: site.description,
          inLanguage: "en",
          publisher: { "@id": `${site.url}/#person` },
        },
        {
          "@type": "ProfilePage",
          "@id": `${site.url}/#profile`,
          url: `${site.url}/`,
          name: seo.title,
          description: seo.description,
          isPartOf: { "@id": `${site.url}/#website` },
          about: { "@id": `${site.url}/#person` },
          mainEntity: { "@id": `${site.url}/#person` },
          inLanguage: "en",
        },
        personNode(),
      ],
    };
  }

  if (page.type === "project") {
    const canonical = absoluteUrl(page.path);
    return {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          "@id": `${canonical}#webpage`,
          url: canonical,
          name: seo.title,
          description: seo.description,
          isPartOf: { "@id": `${site.url}/#website` },
          about: {
            "@type": "Person",
            name: site.name,
            url: `${site.url}/`,
          },
          inLanguage: "en",
        },
        {
          "@type": "BreadcrumbList",
          "@id": `${canonical}#breadcrumb`,
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: `${site.url}/`,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Projects",
              item: `${site.url}/#projects`,
            },
            {
              "@type": "ListItem",
              position: 3,
              name: page.project.name,
              item: canonical,
            },
          ],
        },
      ],
    };
  }

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: seo.title,
    description: seo.description,
    isPartOf: { "@id": `${site.url}/#website` },
    inLanguage: "en",
  };
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function renderHeadTags(seo) {
  const lines = [
    `<title>${escapeHtml(seo.title)}</title>`,
    `<meta name="description" content="${escapeHtml(seo.description)}" />`,
    `<meta name="robots" content="${escapeHtml(seo.robots)}" />`,
    `<meta name="author" content="${escapeHtml(site.name)}" />`,
  ];

  if (seo.canonical) {
    lines.push(`<link rel="canonical" href="${escapeHtml(seo.canonical)}" />`);
  }

  const pageUrl = seo.canonical || `${site.url}/`;
  lines.push(
    `<meta property="og:type" content="${escapeHtml(seo.ogType)}" />`,
    `<meta property="og:site_name" content="${escapeHtml(site.name)}" />`,
    `<meta property="og:locale" content="en_US" />`,
    `<meta property="og:title" content="${escapeHtml(seo.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(seo.description)}" />`,
    `<meta property="og:url" content="${escapeHtml(pageUrl)}" />`,
    `<meta property="og:image" content="${escapeHtml(seo.image)}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${escapeHtml(seo.imageAlt)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(seo.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(seo.description)}" />`,
    `<meta name="twitter:image" content="${escapeHtml(seo.image)}" />`,
    `<meta name="twitter:image:alt" content="${escapeHtml(seo.imageAlt)}" />`,
  );

  if (seo.ogType === "profile") {
    lines.push(
      `<meta property="profile:first_name" content="${escapeHtml(site.givenName)}" />`,
      `<meta property="profile:last_name" content="${escapeHtml(site.familyName)}" />`,
    );
  }

  return lines.join("\n    ");
}

export function renderSitemap(lastmod = new Date().toISOString().slice(0, 10)) {
  const urls = publicPaths()
    .map((pathname) => {
      const priority = pathname === "/" ? "1.0" : "0.8";
      return `  <url>
    <loc>${absoluteUrl(pathname)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${priority}</priority>
  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

export function renderRobots() {
  return `User-agent: *
Allow: /

Sitemap: ${site.url}/sitemap.xml
`;
}
