import fs from "node:fs";
import path from "node:path";
import { site } from "../src/data/content.js";
import { publicPaths } from "../src/seo.js";
import { validateContact } from "../src/lib/validateContact.js";

const dist = path.resolve("dist");
const failures = [];

function assert(condition, message) {
  if (!condition) failures.push(message);
}

function read(file) {
  return fs.readFileSync(path.join(dist, file), "utf8");
}

function pageFile(route) {
  if (route === "/") return "index.html";
  return path.join(route.slice(1), "index.html");
}

assert(Object.keys(validateContact({ name: "", email: "", subject: "", message: "" })).length === 4, "empty form should fail");
assert(validateContact({ name: "Ab", email: "a@b", subject: "Hi", message: "Hello there" }).email, "email without a domain should fail");
assert(
  Object.keys(
    validateContact({
      name: "Abdul Subhan",
      email: "hello@example.com",
      subject: "Portfolio",
      message: "I would like to talk about a project.",
    }),
  ).length === 0,
  "valid form should pass",
);

for (const route of publicPaths()) {
  const file = pageFile(route);
  assert(fs.existsSync(path.join(dist, file)), `missing ${file}`);
  const html = read(file);
  assert(html.includes("<html lang=\"en\""), `${route} missing language`);
  assert((html.match(/<title>/g) || []).length === 1, `${route} should have one title`);
  assert((html.match(/<h1[\s>]/g) || []).length === 1, `${route} should have one h1`);
  assert(html.includes('rel="canonical"'), `${route} missing canonical`);
  assert(html.includes(site.url), `${route} missing production origin`);
  assert(!/localhost|127\.0\.0\.1/i.test(html), `${route} contains a local URL`);
  assert(!html.replaceAll("http://www.w3.org/2000/svg", "").includes("http://"), `${route} contains an http URL`);
  const jsonMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  assert(jsonMatch, `${route} missing JSON-LD`);
  if (jsonMatch) {
    const data = JSON.parse(jsonMatch[1]);
    assert(data["@context"] === "https://schema.org", `${route} JSON-LD context`);
  }
  const assetRefs = [...html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)].map((match) => match[1]);
  for (const asset of assetRefs) {
    assert(fs.existsSync(path.join(dist, asset.slice(1))), `${route} missing asset ${asset}`);
  }
}

const home = read("index.html");
assert(home.includes("Abdul Subhan Durrani | Full Stack Developer in Pakistan"), "home title");
assert(home.includes(site.description), "home meta description");
assert(home.includes(`rel="canonical" href="${site.url}/"`), "home canonical");
assert(home.includes("Building"), "home heading text");
assert(home.includes("Digital Experiences"), "highlighted heading");
assert(home.includes("Shape Solutions"), "experience content in initial HTML");
assert(home.includes("Eloquent"), "skills content in initial HTML");
assert(home.includes("Build Something Great Together."), "contact heading");
assert(home.includes('data-netlify="true"'), "Netlify form attribute");
assert(home.includes('name="form-name"'), "Netlify form-name field");
assert(home.includes('name="bot-field"'), "honeypot field");
assert(home.includes('name="email"'), "email field");
assert(home.includes('id="about"') && home.includes('id="skills"') && home.includes('id="experience"'), "section ids");
assert(home.includes('id="projects"') && home.includes('id="contact"'), "more section ids");
assert(home.includes("/projects/proforce-security-system"), "project link");
assert(home.includes("View My Work") && home.includes("Download CV") && home.includes("Contact Me"), "hero actions");

const homeJson = JSON.parse(home.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
const types = homeJson["@graph"].map((node) => node["@type"]);
assert(types.includes("Person") && types.includes("WebSite") && types.includes("ProfilePage"), "home schema types");
const person = homeJson["@graph"].find((node) => node["@type"] === "Person");
assert(person.name === site.name, "person name");
assert(person.jobTitle === site.title, "person job title");
if (site.email) assert(person.email === site.email, "person email");
else assert(!person.email, "schema should not invent an email");
if (site.linkedin || site.github) {
  assert(Array.isArray(person.sameAs), "person sameAs");
  if (site.linkedin) assert(person.sameAs.includes(site.linkedin), "linkedin profile in schema");
  if (site.github) assert(person.sameAs.includes(site.github), "github profile in schema");
} else {
  assert(!person.sameAs, "schema should not invent social profiles");
}

const project = read("projects/proforce-security-system/index.html");
assert(project.includes("Proforce Security System"), "project title text");
assert(!project.includes("My contribution"), "project page should not show the contribution section");
assert(project.includes("Shift Scheduling and Management"), "project feature in HTML");
assert(project.includes(`href="${site.url}/projects/proforce-security-system"`), "project canonical");

const notFound = read("404.html");
assert(notFound.includes("noindex"), "404 robots");
assert(!notFound.includes('rel="canonical"'), "404 should not declare a canonical");
assert(notFound.includes("This page could not be found."), "404 copy");

const robots = read("robots.txt");
assert(robots.includes("User-agent: *") && robots.includes(`${site.url}/sitemap.xml`), "robots.txt");
const sitemap = read("sitemap.xml");
for (const route of publicPaths()) {
  const loc = route === "/" ? `${site.url}/` : `${site.url}${route}`;
  assert(sitemap.includes(`<loc>${loc}</loc>`), `sitemap missing ${loc}`);
}
assert(!sitemap.includes("/404"), "sitemap should not list 404");

const resume = fs.readFileSync(path.join(dist, "resume.pdf"));
assert(resume.subarray(0, 5).toString() === "%PDF-", "resume.pdf");
assert(resume.length > 800, "resume.pdf looks empty");

const og = path.join(dist, "images/og-abdul-subhan-durrani.png");
assert(fs.existsSync(og), "OG image missing");
if (fs.existsSync(og)) {
  const signature = fs.readFileSync(og).subarray(0, 8).toString("hex");
  assert(signature === "89504e470d0a1a0a", "OG image is not a PNG");
}

const banned = ["lorem ipsum", "testimonial", "years of experience", "certified", "bachelor", "99%", "100%"];
const searchable = `${home}\n${project}`.toLowerCase();
for (const phrase of banned) assert(!searchable.includes(phrase), `unexpected phrase: ${phrase}`);

if (!site.github) assert(!home.includes("github.com"), "home links to a GitHub profile that was not configured");
if (!site.linkedin) assert(!home.includes("linkedin.com"), "home links to a LinkedIn profile that was not configured");
if (!site.email) assert(!home.includes("mailto:"), "home contains a mailto link without an email");

function resolveRoute(urlPath) {
  const rel = decodeURIComponent(urlPath.split("?")[0]).replace(/^\//, "");
  if (!rel) return { status: 200, file: path.join(dist, "index.html") };
  const direct = path.join(dist, rel);
  if (fs.existsSync(direct) && fs.statSync(direct).isFile()) return { status: 200, file: direct };
  const index = path.join(dist, rel, "index.html");
  if (fs.existsSync(index)) return { status: 200, file: index };
  return { status: 404, file: path.join(dist, "404.html") };
}

assert(resolveRoute("/").status === 200, "home route");
assert(resolveRoute("/projects/report-automation").file.endsWith(`${path.sep}index.html`), "project route file");
assert(resolveRoute("/does-not-exist").status === 404, "unknown route 404");
assert(resolveRoute("/sitemap.xml").status === 200, "sitemap route");
assert(resolveRoute("/robots.txt").status === 200, "robots route");
assert(resolveRoute("/resume.pdf").status === 200, "resume route");

if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exit(1);
}

console.log("verify: content, metadata, routes, and form checks passed");
