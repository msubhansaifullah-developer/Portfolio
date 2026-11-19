# Abdul Subhan Durrani — Portfolio

Production-ready personal site for a Full Stack Developer in Islamabad. The public site is intended for:

https://abdulsubhan.netlify.app/

Stack: React, Vite, Tailwind CSS, Framer Motion, and Lucide. Pages are prerendered during `npm run build`, so the main copy is in the HTML that search engines receive.

## Before you launch

Open `src/data/content.js` and set the three empty values:

- `email` — the address you want shown on the site
- `github` — full profile URL, starting with `https://`
- `linkedin` — full profile URL, starting with `https://`

Empty values stay hidden as links. The contact section shows “Not added yet” until you fill them in. No profile was invented.

If Netlify gives you a different domain, change `url` in that same file and rebuild. Canonical URLs, Open Graph tags, `sitemap.xml`, `robots.txt`, and JSON-LD all come from `url`.

Replace `public/resume.pdf` with your own CV if you have one. `npm run resume` rebuilds the included CV from the site content and overwrites that file. The generated CV uses only the role, skills, and projects recorded in `src/data/content.js`. It does not add education, certifications, or earlier jobs.

Project thumbnails are interface illustrations. Do not replace them with internal production screenshots, employee data, or private source code.

## Scripts

```bash
npm install
npm run dev
```

`npm run dev` starts the Vite development server.

```bash
npm run build
npm run serve
```

`npm run build` creates `dist`, prerenders each route, and checks metadata, the sitemap, the CV, and the contact form. `npm run serve` hosts `dist` at http://127.0.0.1:4173 and returns the real 404 page for unknown URLs.

Netlify settings:

- Build command: `npm run build`
- Publish directory: `dist`
- Node 20 (set in `netlify.toml`)

No environment variables are required.

## Contact form

The form posts to Netlify Forms. The prerendered homepage includes `data-netlify="true"`, a `form-name` field, and a honeypot field named `bot-field`.

Validation runs in the browser: name, email, subject, and message are required, and the email must contain a domain. A local preview validates the fields and then tells you the message was not sent. Messages are delivered only from a `*.netlify.app` host.

After the first production deploy:

1. Open the site in Netlify.
2. Go to **Forms** and confirm a form named `contact`.
3. Open **Form notifications** and send submissions to your real inbox.

Until that notification is saved, messages stay in the Netlify Forms dashboard. reCAPTCHA is not included because it needs API keys that were not provided. The honeypot is the built-in spam control. You can also turn on Netlify’s spam filter in the form settings.

## Deploy on Netlify

1. Push this project to a Git host, or deploy the `dist` folder manually. A manual upload must be the contents of `dist` after `npm run build`, not the source folder. `_redirects` and `_headers` are copied into `dist`, so either method keeps the 404 rule and security headers. `netlify.toml` is used when Netlify runs the build itself.
2. In Netlify, add a new site from the repository, or run `npx netlify-cli deploy --prod --dir=dist` after `netlify login`.
3. Confirm the build command is `npm run build` and the publish directory is `dist`.
4. Deploy.
5. Open **Site configuration → Site details → Change site name** and set the name to `abdulsubhan`. The public URL becomes `https://abdulsubhan.netlify.app/`.
6. HTTPS is provided by Netlify for the `netlify.app` subdomain. You do not need a certificate setting for that hostname.

### If that site name is taken

Netlify will reject the name when another account already uses it. This project does not reserve `abdulsubhan`. If the name is unavailable:

- Pick another site name, or use a site your team already owns that has this name.
- Set `url` in `src/data/content.js` to the exact origin, with no path and no trailing slash. Example: `https://your-actual-name.netlify.app`
- Run `npm run build` again and redeploy.

Canonical tags, the sitemap, and structured data will then match the domain that is actually live.

Direct links such as `/projects/proforce-security-system` are real files, so refreshing them works. Unknown paths serve `404.html` with a 404 status. There is no blanket rewrite to `index.html`.

## Google Search Console

Rankings are not guaranteed. Use Search Console to see how Google reads the site after it has been deployed.

1. Open [Google Search Console](https://search.google.com/search-console) and add a property.
2. Choose **URL prefix** and enter `https://abdulsubhan.netlify.app/` (or the origin you actually deployed). URL prefix is enough. A domain property also works, but it requires a DNS TXT record.
3. Verify with the HTML tag method: copy the `google-site-verification` meta tag, paste it in `index.html` directly above `<!--SEO:inject-->`, commit, and redeploy. You can instead download Google’s HTML file, put it in `public/`, and redeploy.
4. After verification, open **Sitemaps** and submit `sitemap.xml`. The full address is `https://abdulsubhan.netlify.app/sitemap.xml`.
5. Open **URL inspection**, enter the homepage URL, run the live test, and choose **Request indexing**.
6. Repeat inspection for the project URLs if you want them crawled sooner:
   - `/projects/proforce-security-system`
   - `/projects/employee-onboarding-module`
   - `/projects/report-automation`
7. Use **Performance** for impressions, clicks, and queries. Those reports stay empty until Google has collected data, which can take days or longer.
8. Use **Pages** to see which URLs are indexed and why any URL was excluded.

`robots.txt` allows crawling and points at the sitemap. Pages that should be indexed use `index,follow`. The 404 page uses `noindex`.

## What the site does not claim

The copy is limited to the role at Shape Solutions (Pvt.) Ltd. since December 2025, the listed skills, and the three described projects. There are no testimonials, proficiency percentages, earlier employers, degrees, or certifications.
