import fs from "node:fs";
import path from "node:path";
import { about, experience, hero, projects, site, skillGroups } from "../src/data/content.js";

const pageWidth = 612;
const pageHeight = 792;
const left = 54;
const right = 558;
const bottom = 48;

function ascii(text) {
  return String(text)
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, "-")
    .replace(/[^\x20-\x7E\n]/g, "");
}

function pdfEscape(text) {
  return ascii(text).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function wrap(text, maxChars) {
  const words = ascii(text).split(/\s+/).filter(Boolean);
  const lines = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines.length ? lines : [""];
}

const pages = [[]];
let y = 742;

function ensure(height) {
  if (y - height < bottom) {
    pages.push([]);
    y = 742;
  }
}

function maxChars(size, indent = 0) {
  const width = right - left - indent;
  return Math.max(24, Math.floor(width / (size * 0.52)));
}

function addText(text, { size = 10.5, font = "F1", color = [0.12, 0.12, 0.14], indent = 0, gap = 4 } = {}) {
  const lines = wrap(text, maxChars(size, indent));
  for (const line of lines) {
    ensure(size + gap);
    pages.at(-1).push({ type: "text", text: line, x: left + indent, y, size, font, color });
    y -= size + gap;
  }
}

function addGap(amount) {
  y -= amount;
  if (y < bottom) {
    pages.push([]);
    y = 742;
  }
}

function addRule() {
  ensure(12);
  pages.at(-1).push({
    type: "line",
    x1: left,
    y1: y,
    x2: right,
    y2: y,
    color: [0.545, 0.361, 0.965],
    width: 1,
  });
  y -= 16;
}

const ink = [0.1, 0.1, 0.12];
const muted = [0.28, 0.28, 0.32];
const purple = [0.36, 0.24, 0.72];

addText(site.name, { size: 22, font: "F2", color: ink, gap: 6 });
addText(site.title, { size: 12, font: "F2", color: purple, gap: 5 });
const contactBits = [site.location, site.url];
if (site.phoneDisplay) contactBits.push(site.phoneDisplay);
if (site.email.trim()) contactBits.push(site.email.trim());
if (site.github.trim()) contactBits.push(site.github.trim());
if (site.linkedin.trim()) contactBits.push(site.linkedin.trim());
addText(contactBits.join("  |  "), { size: 10, color: muted, gap: 8 });
addRule();

addText("Profile", { size: 13, font: "F2", color: ink, gap: 8 });
addText(hero.summary, { size: 10.5, color: ink, gap: 3 });
addGap(8);
for (const paragraph of about.paragraphs.slice(1)) {
  addText(paragraph, { size: 10.5, color: ink, gap: 3 });
  addGap(4);
}

addGap(6);
addText("Experience", { size: 13, font: "F2", color: ink, gap: 8 });
addText(`${experience.position}, ${experience.company}`, { size: 11.5, font: "F2", color: ink, gap: 4 });
addText(`${experience.location}  |  ${experience.start} - ${experience.end}`, { size: 10, color: muted, gap: 8 });
for (const item of experience.responsibilities) {
  const lines = wrap(item, maxChars(10.5, 14) - 2);
  lines.forEach((line, index) => {
    ensure(14);
    pages.at(-1).push({
      type: "text",
      text: `${index === 0 ? "- " : "  "}${line}`,
      x: left,
      y,
      size: 10.5,
      font: "F1",
      color: ink,
    });
    y -= 14;
  });
}

addGap(8);
addText("Technical skills", { size: 13, font: "F2", color: ink, gap: 8 });
for (const group of skillGroups) {
  addText(`${group.title}: ${group.items.join(", ")}`, { size: 10.5, color: ink, gap: 4 });
}

addGap(8);
addText("Selected work", { size: 13, font: "F2", color: ink, gap: 8 });
for (const project of projects) {
  addText(project.name, { size: 11.5, font: "F2", color: ink, gap: 3 });
  addText(project.category, { size: 10, color: muted, gap: 4 });
  addText(project.description, { size: 10.5, color: ink, gap: 3 });
  addText(`Contribution: ${project.contribution}`, { size: 10.5, color: ink, gap: 3 });
  if (project.technologies.length) {
    addText(project.technologies.join(", "), { size: 10, color: muted, gap: 4 });
  }
  addGap(6);
}

function opToPdf(op) {
  if (op.type === "text") {
    const [r, g, b] = op.color;
    return `BT /${op.font} ${op.size} Tf ${r} ${g} ${b} rg 1 0 0 1 ${op.x} ${op.y} Tm (${pdfEscape(op.text)}) Tj ET`;
  }
  const [r, g, b] = op.color;
  return `${r} ${g} ${b} RG ${op.width} w ${op.x1} ${op.y1} m ${op.x2} ${op.y2} l S`;
}

function renderPage(ops, pageIndex, pageCount) {
  const parts = ["0.545 0.361 0.965 rg", "0 0 6 792 re f"];
  if (pageIndex > 0) {
    parts.push(`BT /F1 9 Tf 0.35 0.35 0.38 rg 1 0 0 1 54 758 Tm (${pdfEscape(`${site.name} - CV`)}) Tj ET`);
  }
  for (const op of ops) parts.push(opToPdf(op));
  parts.push(`BT /F1 9 Tf 0.35 0.35 0.38 rg 1 0 0 1 520 32 Tm (${pageIndex + 1} / ${pageCount}) Tj ET`);
  return parts.join("\n");
}

const streams = pages.map((ops, index) => renderPage(ops, index, pages.length));
const objects = [];
objects.push("<< /Type /Catalog /Pages 2 0 R >>");
const kids = streams.map((_, index) => `${5 + index * 2} 0 R`).join(" ");
objects.push(`<< /Type /Pages /Count ${streams.length} /Kids [${kids}] >>`);
objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>");
objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>");
streams.forEach((stream, index) => {
  const contentId = 6 + index * 2;
  objects.push(
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Contents ${contentId} 0 R /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> >>`,
  );
  objects.push(`<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}\nendstream`);
});
objects.push("<< /Title (Abdul Subhan Durrani CV) /Author (Abdul Subhan Durrani) >>");

let output = "%PDF-1.4\n";
const offsets = [0];
objects.forEach((body, index) => {
  offsets.push(Buffer.byteLength(output));
  output += `${index + 1} 0 obj\n${body}\nendobj\n`;
});
const xref = Buffer.byteLength(output);
const count = objects.length + 1;
output += `xref\n0 ${count}\n`;
output += "0000000000 65535 f \n";
for (let index = 1; index < count; index += 1) {
  output += `${String(offsets[index]).padStart(10, "0")} 00000 n \n`;
}
output += `trailer\n<< /Size ${count} /Root 1 0 R /Info ${objects.length} 0 R >>\nstartxref\n${xref}\n%%EOF\n`;

const destination = path.resolve("public/resume.pdf");
fs.writeFileSync(destination, output);
console.log(`wrote ${destination} (${pages.length} page${pages.length === 1 ? "" : "s"})`);
