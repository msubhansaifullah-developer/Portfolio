import { Link } from "react-router-dom";
import { navLinks, site } from "../data/content";
import SocialLinks from "./SocialLinks";

const footerLinks = [
  ...navLinks,
  { id: "resume", label: "Resume", href: site.resumePath, download: true },
];

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="shell py-8 sm:py-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-serif text-2xl text-paper">{site.name}</p>
            <p className="mt-1 text-sm text-mist">{site.title}</p>
          </div>
          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {footerLinks.map((link) => (
                <li key={link.id}>
                  {link.download ? (
                    <a className="text-sm text-mist hover:text-paper" href={link.href} download={site.resumeDownloadName}>
                      {link.label}
                    </a>
                  ) : (
                    <Link to={link.href} className="text-sm text-mist hover:text-paper">
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="mt-6 flex flex-col gap-4 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-mist">
            © <span suppressHydrationWarning>{new Date().getFullYear()}</span> {site.name}. All rights reserved.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
            <p className="text-sm text-mist">Designed & Developed by Abdul Subhan Durrani.</p>
            <SocialLinks items={["linkedin", "email"]} />
          </div>
        </div>
      </div>
    </footer>
  );
}
