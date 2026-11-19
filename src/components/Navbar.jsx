import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Download, Menu, X } from "lucide-react";
import { navLinks, site } from "../data/content";

const sectionIds = navLinks.map((link) => link.id);

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [section, setSection] = useState(() => {
    const id = location.hash.replace("#", "");
    return sectionIds.includes(id) ? id : "home";
  });
  const menuButtonRef = useRef(null);
  const panelRef = useRef(null);

  const active =
    location.pathname.startsWith("/projects") ? "projects" : location.pathname === "/" ? section : "";

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      if (location.pathname !== "/") return;
      const marker = 128;
      let current = "home";
      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (!element) continue;
        if (element.getBoundingClientRect().top - marker <= 0) current = id;
      }
      setSection(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [location.pathname]);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const panel = panelRef.current;
    const getItems = () => [...(panel?.querySelectorAll("a, button") ?? [])];
    const first = getItems()[0];
    first?.focus();

    function onKey(event) {
      if (event.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
        return;
      }
      if (event.key !== "Tab" || !panel) return;
      const items = getItems();
      const firstItem = items[0];
      const lastItem = items[items.length - 1];
      if (!firstItem || !lastItem) return;
      if (event.shiftKey && document.activeElement === firstItem) {
        event.preventDefault();
        lastItem.focus();
      } else if (!event.shiftKey && document.activeElement === lastItem) {
        event.preventDefault();
        firstItem.focus();
      }
    }

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  function jumpTo(event, id) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    setOpen(false);
    setSection(id);
    if (location.pathname === "/" && location.hash === `#${id}`) {
      document.getElementById(id)?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
      return;
    }
    navigate(`/#${id}`);
  }

  const linkClass = (id, mobile = false) =>
    [
      mobile ? "flex min-h-11 items-center rounded-xl px-3 text-base" : "relative py-1 text-sm",
      active === id ? "text-paper" : "text-mist hover:text-paper",
    ].join(" ");

  return (
    <>
      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/55 lg:hidden"
          aria-label="Close menu"
          onClick={() => {
            setOpen(false);
            menuButtonRef.current?.focus();
          }}
        />
      ) : null}
      <header className={`fixed inset-x-0 top-0 z-50 border-b transition-colors ${scrolled || open ? "border-line bg-ink/95" : "border-transparent bg-ink/80"} backdrop-blur-md`}>
        <div className="shell flex h-16 items-center justify-between gap-4">
          <Link to="/#home" className="flex min-w-0 items-center gap-3 rounded-xl" onClick={(event) => jumpTo(event, "home")}>
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-line bg-card font-serif text-sm text-paper">
              AS
            </span>
            <span className="truncate text-sm font-medium tracking-tight text-paper">
              Abdul Subhan
              <span className="hidden font-normal text-mist sm:inline"> Durrani</span>
            </span>
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-6 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.id}
                to={link.href}
                className={linkClass(link.id)}
                aria-current={active === link.id ? "true" : undefined}
                onClick={(event) => jumpTo(event, link.id)}
              >
                {link.label}
                {active === link.id ? (
                  <span className="absolute -bottom-2 left-1/2 h-px w-6 -translate-x-1/2 bg-gradient-to-r from-accent to-signal" />
                ) : null}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a className="btn btn-secondary hidden px-4 sm:inline-flex" href={site.resumePath} download={site.resumeDownloadName}>
              <Download className="h-4 w-4" aria-hidden="true" />
              Resume
            </a>
            <button
              ref={menuButtonRef}
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line text-paper lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((value) => !value)}
            >
              <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
              {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open ? (
            <motion.div
              id="mobile-menu"
              ref={panelRef}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="absolute inset-x-0 top-full border-b border-line bg-ink px-5 py-4 lg:hidden"
            >
              <nav aria-label="Mobile" className="flex flex-col">
                {navLinks.map((link) => (
                  <Link
                    key={link.id}
                    to={link.href}
                    className={linkClass(link.id, true)}
                    aria-current={active === link.id ? "true" : undefined}
                    onClick={(event) => jumpTo(event, link.id)}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <a className="btn btn-secondary mt-3 w-full" href={site.resumePath} download={site.resumeDownloadName}>
                <Download className="h-4 w-4" aria-hidden="true" />
                Download resume
              </a>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </header>
    </>
  );
}
