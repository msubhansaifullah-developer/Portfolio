import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { getSeo, publicPaths, renderHeadTags, renderRobots, renderSitemap } from "../src/seo.js";

const dist = path.resolve("dist");
const serverDir = path.resolve("dist-server");

function walk(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full));
    else files.push(full);
  }
  return files;
}

function outputFile(route) {
  if (route === "/") return path.join(dist, "index.html");
  if (route === "/404") return path.join(dist, "404.html");
  return path.join(dist, route.slice(1), "index.html");
}

const template = fs.readFileSync(path.join(dist, "index.html"), "utf8");
if (!template.includes("<!--SEO-->") || !template.includes("<!--/SEO-->")) {
  throw new Error("Built index.html is missing SEO markers.");
}
if (!template.includes('<div id="root"></div>')) {
  throw new Error("Built index.html is missing the root placeholder.");
}

const serverFile = walk(serverDir).find(
  (file) => file.includes("entry-server") && (file.endsWith(".js") || file.endsWith(".mjs")),
);
if (!serverFile) throw new Error("SSR bundle was not found in dist-server.");

const { render } = await import(pathToFileURL(serverFile).href);
const routes = [...publicPaths(), "/404"];

for (const route of routes) {
  const { html } = render(route);
  const head = renderHeadTags(getSeo(route === "/404" ? "/missing-page" : route));
  let page = template.replace(/<!--SEO-->[\s\S]*?<!--\/SEO-->/, () => `<!--SEO-->\n    ${head}\n    <!--/SEO-->`);
  page = page.replace('<div id="root"></div>', () => `<div id="root">${html}</div>`);
  const file = outputFile(route);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, page);
  console.log(`prerendered ${route}`);
}

const lastmod = new Date().toISOString().slice(0, 10);
const sitemap = renderSitemap(lastmod);
const robots = renderRobots();
fs.writeFileSync(path.join(dist, "sitemap.xml"), sitemap);
fs.writeFileSync(path.join(dist, "robots.txt"), robots);
fs.writeFileSync(path.resolve("public/sitemap.xml"), sitemap);
fs.writeFileSync(path.resolve("public/robots.txt"), robots);
fs.rmSync(serverDir, { recursive: true, force: true });
console.log("prerender complete");
