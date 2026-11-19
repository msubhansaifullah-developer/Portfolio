import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col justify-center px-5 pb-20 pt-28 sm:px-8">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-mist">404</p>
      <h1 className="mt-4 max-w-xl font-serif text-[clamp(2.6rem,6vw,4.5rem)] leading-[1.05] tracking-tight text-paper">
        This page could not be found.
      </h1>
      <p className="mt-5 max-w-lg text-base leading-7 text-mist">The link may be mistyped, or the page may have moved.</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link className="btn btn-primary" to="/">
          Back to home
        </Link>
        <Link className="btn btn-secondary" to="/#projects">
          View projects
        </Link>
      </div>
    </section>
  );
}
