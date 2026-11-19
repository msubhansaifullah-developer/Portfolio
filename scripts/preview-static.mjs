import fs from "node:fs";
import http from "node:http";
import path from "node:path";

const dist = path.resolve("dist");
const port = Number(process.env.PORT || 4173);
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".pdf": "application/pdf",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ico": "image/x-icon",
};

function resolve(urlPath) {
  const rel = decodeURIComponent(urlPath.split("?")[0]).replace(/^\/+/, "");
  if (!rel) return { status: 200, file: path.join(dist, "index.html") };
  const direct = path.normalize(path.join(dist, rel));
  if (!direct.startsWith(dist)) return { status: 404, file: path.join(dist, "404.html") };
  if (fs.existsSync(direct) && fs.statSync(direct).isFile()) return { status: 200, file: direct };
  const index = path.join(direct, "index.html");
  if (fs.existsSync(index)) return { status: 200, file: index };
  return { status: 404, file: path.join(dist, "404.html") };
}

const server = http.createServer((request, response) => {
  const match = resolve(request.url || "/");
  const body = fs.readFileSync(match.file);
  const type = types[path.extname(match.file)] || "application/octet-stream";
  response.writeHead(match.status, { "Content-Type": type, "Cache-Control": "no-store" });
  response.end(body);
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Serving dist at http://127.0.0.1:${port}`);
});
