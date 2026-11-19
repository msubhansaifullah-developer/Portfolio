import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { getSeo, renderHeadTags } from "./src/seo.js";

function seoPlugin() {
  return {
    name: "portfolio-seo",
    transformIndexHtml(html) {
      const block = `<!--SEO-->\n    ${renderHeadTags(getSeo("/"))}\n    <!--/SEO-->`;
      return html.replace("<!--SEO:inject-->", () => block);
    },
  };
}

export default defineConfig({
  plugins: [react(), seoPlugin()],
  build: {
    sourcemap: false,
    target: "es2020",
    emptyOutDir: true,
  },
});
