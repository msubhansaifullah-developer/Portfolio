import fs from "node:fs";
import path from "node:path";
import { about, experience, projects, site, skillGroups } from "../src/data/content.js";

const pageWidth = 612;
const pageHeight = 792;
const left = 48;
const right = 564;
const contentWidth = right - left;
const bottom = 54;

const ink = [0.09, 0.09, 0.11];
const muted = [0.33, 0.33, 0.37];
const purple = [0.42, 0.28, 0.78];
const line = [0.82, 0.82, 0.85];
const rule = [0.9, 0.9, 0.92];

const regularWidths = {
  " ": 278, ".": 278, ",": 278, ":": 278, ";": 278, "-": 333, "/": 278, "@": 1015,
  "(": 333, ")": 278, "&": 667, "'": 191, "+": 584,
  "0": 556, "1": 556, "2": 556, "3": 556, "4": 556, "5": 556, "6": 556, "7": 556, "8": 556, "9": 556,
  A: 667, B: 667, C: 722, D: 722, E: 611, F: 556, G: 778, H: 722, I: 278, J: 500, K: 667, L: 556, M: 833,
  N: 722, O: 778, P: 667, Q: 778, R: 722, S: 667, T: 611, U: 722, V: 667, W: 944, X: 667, Y: 667, Z: 611,
  a: 556, b: 556, c: 500, d: 556, e: 556, f: 278, g: 556, h: 556, i: 222, j: 222, k: 500, l: 222, m: 833,
  n: 556, o: 556, p: 556, q: 556, r: 333, s: 500, t: 278, u: 556, v: 500, w: 722, x: 500, y: 500, z: 500,
};

const boldWidths = {
  " ": 278, ".": 278, ",": 278, ":": 333, ";": 333, "-": 333, "/": 278, "@": 975,
  "(": 333, ")": 333, "&": 722, "'": 238, "+": 584,
  "0": 556, "1": 556, "2": 556, "3": 556, "4": 556, "5": 556, "6": 556, "7": 556, "8": 556, "9": 556,
  A: 722, B: 722, C: 722, D: 722, E: 667, F: 611, G: 778, H: 722, I: 278, J: 556, K: 722, L: 611, M: 833,
  N: 722, O: 778, P: 667, Q: 778, R: 722, S: 667, T: 611, U: 722, V: 667, W: 944, X: 667, Y: 667, Z: 611,
  a: 556, b: 611, c: 556, d: 611, e: 556, f: 333, g: 611, h: 611, i: 278, j: 278, k: 556, l: 278, m: 889,
  n: 611, o: 611, p: 611, q: 611, r: 389, s: 556, t: 333, u: 611, v: 556, w: 778, x: 556, y: 556, z: 500,
};

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

function textWidth(text, size, font) {
  const map = font === "F2" ? boldWidths : regularWidths;
  let units = 0;
  for (const char of ascii(text)) units += map[char] ?? 560;
  return (units / 1000) * size;
}

function wrap(text, size, font, maxWidth) {
  const words = ascii(text).split(/\s+/).filter(Boolean);
  const lines = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (textWidth(next, size, font) > maxWidth && line) {
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
let y = 746;

function pageTop(index) {
  return index === 0 ? 746 : 724;
}

function ensure(height) {
  if (y - height < bottom) {
    pages.push([]);
    y = pageTop(pages.length - 1);
  }
}

function text(value, x, yPos, { size = 10, font = "F1", color = ink } = {}) {
  pages.at(-1).push({ type: "text", text: ascii(value), x, y: yPos, size, font, color });
}

function hline(x1, x2, yPos, color, width) {
  pages.at(-1).push({ type: "line", x1, y1: yPos, x2, y2: yPos, color, width });
}

function dot(x, yPos) {
  pages.at(-1).push({ type: "circle", x, y: yPos, r: 1.45, color: purple });
}

const links = [];

function drawParts(parts, yPos, size = 9.5) {
  let x = left;
  parts.forEach((part, index) => {
    if (index > 0) {
      const separator = "   |   ";
      text(separator, x, yPos, { size, color: muted });
      x += textWidth(separator, size, "F1");
    }
    text(part.label, x, yPos, { size, color: muted });
    if (part.url) {
      links.push({
        page: pages.length - 1,
        url: part.url,
        x1: x,
        y1: yPos - 2,
        x2: x + textWidth(part.label, size, "F1"),
        y2: yPos + size,
      });
    }
    x += textWidth(part.label, size, "F1");
  });
}

function addLines(value, { size = 10.5, font = "F1", color = ink, indent = 0, gap = 3.5, width = contentWidth } = {}) {
  const lines = wrap(value, size, font, width - indent);
  for (const line of lines) {
    ensure(size + gap);
    text(line, left + indent, y, { size, font, color });
    y -= size + gap;
  }
  return lines.length;
}

function addGap(amount) {
  y -= amount;
}

function addSection(title) {
  ensure(32);
  addGap(12);
  const label = title.toUpperCase();
  text(label, left, y, { size: 9, font: "F2", color: purple });
  const labelWidth = textWidth(label, 9, "F2");
  hline(left + labelWidth + 10, right, y + 2.5, line, 0.7);
  y -= 16;
}

function addBullet(value) {
  const size = 10.5;
  const gap = 3.6;
  const indent = 14;
  const lines = wrap(value, size, "F1", contentWidth - indent);
  lines.forEach((line, index) => {
    ensure(size + gap);
    if (index === 0) dot(left + 2.2, y + 2.6);
    text(line, left + indent, y, { size, color: ink });
    y -= size + gap;
  });
}

function displayUrl(value) {
  return value.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

text(site.name, left, y, { size: 22, font: "F2", color: ink });
y -= 28;
text(site.title, left, y, { size: 12, font: "F2", color: purple });
y -= 18;
drawParts(
  [
    { label: site.location },
    site.phoneDisplay ? { label: site.phoneDisplay, url: site.phoneHref } : null,
    site.email.trim() ? { label: site.email.trim(), url: `mailto:${site.email.trim()}` } : null,
  ].filter(Boolean),
  y,
);
y -= 14;
drawParts(
  [
    site.linkedin ? { label: displayUrl(site.linkedin), url: site.linkedin } : null,
    site.url ? { label: displayUrl(site.url), url: site.url.endsWith("/") ? site.url : `${site.url}/` } : null,
  ].filter(Boolean),
  y,
);
y -= 12;
hline(left, right, y, rule, 1);
y -= 6;

addSection("Profile");
for (const paragraph of about.paragraphs) {
  addLines(paragraph, { size: 10.5, gap: 3.2 });
  addGap(6);
}

addSection("Experience");
ensure(36);
text(experience.position, left, y, { size: 12, font: "F2", color: ink });
const dates = `${experience.start} - ${experience.end}`;
text(dates, right - textWidth(dates, 10, "F1"), y, { size: 10, color: muted });
y -= 15;
addLines(`${experience.company}  |  ${experience.location}`, { size: 10, color: muted, gap: 3 });
addGap(6);
for (const item of experience.responsibilities) addBullet(item);

addSection("Technical skills");
const columns = [
  [skillGroups[0], skillGroups[2]],
  [skillGroups[1], skillGroups[3]],
];
const columnWidth = (contentWidth - 22) / 2;
const columnTop = y;

function drawSkillColumn(groups, x, startY) {
  let cursor = startY;
  for (const group of groups) {
    pages.at(-1).push({
      type: "text",
      text: group.title,
      x,
      y: cursor,
      size: 10.5,
      font: "F2",
      color: ink,
    });
    cursor -= 15;
    const lines = wrap(group.items.join(", "), 10, "F1", columnWidth);
    for (const line of lines) {
      pages.at(-1).push({ type: "text", text: line, x, y: cursor, size: 10, font: "F1", color: muted });
      cursor -= 13.5;
    }
    cursor -= 8;
  }
  return cursor;
}

const leftEnd = drawSkillColumn(columns[0], left, columnTop);
const rightEnd = drawSkillColumn(columns[1], left + columnWidth + 22, columnTop);
y = Math.min(leftEnd, rightEnd);

addSection("Selected work");
for (const project of projects) {
  const descriptionLines = wrap(project.description, 10.5, "F1", contentWidth);
  const contributionLines = wrap(project.contribution, 10.5, "F1", contentWidth - 14);
  const tech = project.technologies.join(", ");
  const techLines = tech ? wrap(tech, 9.5, "F1", contentWidth) : [];
  const block =
    16 +
    14 +
    descriptionLines.length * 14 +
    4 +
    contributionLines.length * 14 +
    (techLines.length ? 4 + techLines.length * 13 : 0) +
    12;
  ensure(block);

  text(project.name, left, y, { size: 11.5, font: "F2", color: ink });
  const categoryWidth = textWidth(project.category, 9, "F1");
  const nameWidth = textWidth(project.name, 11.5, "F2");
  if (nameWidth + 16 + categoryWidth < contentWidth) {
    text(project.category, right - categoryWidth, y, { size: 9, color: muted });
  }
  y -= 15;
  if (nameWidth + 16 + categoryWidth >= contentWidth) {
    addLines(project.category, { size: 9, color: muted, gap: 3 });
    addGap(2);
  }
  for (const line of descriptionLines) {
    text(line, left, y, { size: 10.5, color: ink });
    y -= 14;
  }
  addGap(2);
  contributionLines.forEach((line, index) => {
    if (index === 0) dot(left + 2.2, y + 2.6);
    text(line, left + 14, y, { size: 10.5, color: ink });
    y -= 14;
  });
  if (techLines.length) {
    addGap(1);
    for (const line of techLines) {
      text(line, left, y, { size: 9.5, color: muted });
      y -= 13;
    }
  }
  addGap(10);
}

function opToPdf(op) {
  if (op.type === "text") {
    const [r, g, b] = op.color;
    return `BT /${op.font} ${op.size} Tf ${r} ${g} ${b} rg 1 0 0 1 ${op.x.toFixed(2)} ${op.y.toFixed(2)} Tm (${pdfEscape(op.text)}) Tj ET`;
  }
  if (op.type === "circle") {
    const [r, g, b] = op.color;
    return `${r} ${g} ${b} rg ${op.x.toFixed(2)} ${op.y.toFixed(2)} ${op.r} 0 360 arc f`;
  }
  const [r, g, b] = op.color;
  return `${r} ${g} ${b} RG ${op.width} w ${op.x1.toFixed(2)} ${op.y1.toFixed(2)} m ${op.x2.toFixed(2)} ${op.y2.toFixed(2)} l S`;
}

function renderPage(ops, pageIndex, pageCount) {
  const parts = ["0.545 0.361 0.965 rg", "0 786 612 6 re f"];
  if (pageIndex > 0) {
    parts.push(
      `BT /F1 9 Tf 0.33 0.33 0.37 rg 1 0 0 1 ${left} 754 Tm (${pdfEscape(site.name)}) Tj ET`,
      `BT /F1 9 Tf 0.33 0.33 0.37 rg 1 0 0 1 ${right - textWidth("Curriculum Vitae", 9, "F1")} 754 Tm (Curriculum Vitae) Tj ET`,
      `0.9 0.9 0.92 RG 0.6 w ${left} 746 m ${right} 746 l S`,
    );
  }
  for (const op of ops) parts.push(opToPdf(op));
  parts.push(
    `0.9 0.9 0.92 RG 0.6 w ${left} 36 m ${right} 36 l S`,
    `BT /F1 8.5 Tf 0.33 0.33 0.37 rg 1 0 0 1 ${left} 22 Tm (${pdfEscape(site.title)}) Tj ET`,
    `BT /F1 8.5 Tf 0.33 0.33 0.37 rg 1 0 0 1 ${(right - textWidth(`${pageIndex + 1} / ${pageCount}`, 8.5, "F1")).toFixed(2)} 22 Tm (${pageIndex + 1} / ${pageCount}) Tj ET`,
  );
  return parts.join("\n");
}

const streams = pages.map((ops, index) => renderPage(ops, index, pages.length));
const objects = [];
objects.push("<< /Type /Catalog /Pages 2 0 R >>");
const kids = streams.map((_, index) => `${5 + index * 2} 0 R`).join(" ");
objects.push(`<< /Type /Pages /Count ${streams.length} /Kids [${kids}] >>`);
objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>");
objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>");
const annotStart = 5 + streams.length * 2;
const annotsByPage = streams.map(() => []);
links.forEach((link, index) => {
  annotsByPage[link.page].push(annotStart + index);
});
streams.forEach((stream, index) => {
  const contentId = 6 + index * 2;
  const annots = annotsByPage[index].length ? ` /Annots [${annotsByPage[index].map((id) => `${id} 0 R`).join(" ")}]` : "";
  objects.push(
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Contents ${contentId} 0 R /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >>${annots} >>`,
  );
  objects.push(`<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}\nendstream`);
});
for (const link of links) {
  objects.push(
    `<< /Type /Annot /Subtype /Link /Rect [${link.x1.toFixed(2)} ${link.y1.toFixed(2)} ${link.x2.toFixed(2)} ${link.y2.toFixed(2)}] /Border [0 0 0] /A << /Type /Action /S /URI /URI (${pdfEscape(link.url)}) >> >>`,
  );
}
objects.push(
  `<< /Title (${pdfEscape(`${site.name} CV`)}) /Author (${pdfEscape(site.name)}) /Subject (Full Stack Developer curriculum vitae) >>`,
);

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
