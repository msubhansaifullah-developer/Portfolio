import fs from "node:fs";
import path from "node:path";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

const root = path.resolve(".");
const outfit = fs.readFileSync(path.join(root, "node_modules/@fontsource/outfit/files/outfit-latin-400-normal.woff"));
const outfitMedium = fs.readFileSync(path.join(root, "node_modules/@fontsource/outfit/files/outfit-latin-500-normal.woff"));
const serif = fs.readFileSync(
  path.join(root, "node_modules/@fontsource/instrument-serif/files/instrument-serif-latin-400-normal.woff"),
);

const fonts = [
  { name: "Outfit", data: outfit, weight: 400, style: "normal" },
  { name: "Outfit", data: outfitMedium, weight: 500, style: "normal" },
  { name: "Instrument Serif", data: serif, weight: 400, style: "normal" },
];

function element(type, style, children) {
  return { type, props: { style, children } };
}

async function rasterize(node, width, height, file) {
  const svg = await satori(node, { width, height, fonts });
  const png = new Resvg(svg, { fitTo: { mode: "width", value: width } }).render().asPng();
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, png);
  console.log(`wrote ${file}`);
}

const card = element(
  "div",
  {
    width: "1200px",
    height: "630px",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#09090B",
    backgroundImage: "linear-gradient(135deg, rgba(139,92,246,0.32) 0%, rgba(9,9,11,0) 46%, rgba(59,130,246,0.18) 100%)",
    color: "#FAFAFA",
    padding: "68px 72px",
    fontFamily: "Outfit",
  },
  [
    element("div", { display: "flex", fontSize: 22, letterSpacing: 5, color: "#A1A1AA", fontWeight: 500 }, "FULL STACK DEVELOPER"),
    element("div", { display: "flex", flexDirection: "column", marginTop: 78 }, [
      element(
        "div",
        { display: "flex", fontSize: 72, lineHeight: 1.05, fontFamily: "Instrument Serif", color: "#FAFAFA" },
        "Abdul Subhan Durrani",
      ),
      element(
        "div",
        { display: "flex", marginTop: 20, fontSize: 32, color: "#C4B5FD" },
        "Laravel, PHP, MySQL, and JavaScript",
      ),
    ]),
    element("div", { display: "flex", flexDirection: "column", marginTop: 78, fontSize: 26, color: "#FAFAFA" }, [
      element("div", { display: "flex" }, "Islamabad, Pakistan"),
      element("div", { display: "flex", marginTop: 10 }, "abdulsubhan.netlify.app"),
    ]),
  ],
);

const icon = element(
  "div",
  {
    width: "180px",
    height: "180px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#09090B",
    color: "#FAFAFA",
    fontFamily: "Instrument Serif",
    fontSize: 72,
    border: "8px solid #27272A",
  },
  "AS",
);

await rasterize(card, 1200, 630, path.join(root, "public/images/og-abdul-subhan-durrani.png"));
await rasterize(icon, 180, 180, path.join(root, "public/images/apple-touch-abdul-subhan-durrani.png"));
