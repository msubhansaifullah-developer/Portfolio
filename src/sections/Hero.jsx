import { Download, MapPin } from "lucide-react";
import { hero, site } from "../data/content";
import SocialLinks from "../components/SocialLinks";

export default function Hero() {
  return (
    <section id="home" className="shell flex min-h-[100svh] flex-col justify-center pb-16 pt-24">
      <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-14">
        <div>
          <p className="flex items-center gap-3 text-xs font-medium tracking-[0.22em] text-mist">
            <span className="h-px w-8 bg-line" aria-hidden="true" />
            {hero.eyebrow}
          </p>
          <h1 className="mt-6 max-w-3xl font-serif text-[clamp(2.45rem,6vw,4.6rem)] leading-[1.04] tracking-tight text-balance text-paper">
            <span className="block">
              {hero.headingLead}{" "}
              <span className="text-gradient inline-block px-0.5 italic">{hero.headingHighlight}</span>
            </span>
            <span className="block">{hero.headingTail}</span>
          </h1>
          <p className="mt-6 text-base text-paper sm:text-lg">{hero.role}</p>
          <p className="mt-5 max-w-xl text-base leading-7 text-mist sm:text-[17px]">{hero.summary}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a className="btn btn-primary" href="/#projects">
              View My Work
            </a>
            <a className="btn btn-secondary" href={site.resumePath} download={site.resumeDownloadName}>
              <Download className="h-4 w-4" aria-hidden="true" />
              Download CV
            </a>
            <a className="btn btn-secondary" href="/#contact">
              Contact Me
            </a>
          </div>
          <div className="mt-8 flex flex-col gap-5 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2 text-sm text-mist">
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-paper" aria-hidden="true" />
                {site.location}
              </p>
              <p className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#34d399]" aria-hidden="true" />
                Full Stack Developer at Shape Solutions since {site.employmentStart}
              </p>
            </div>
            <SocialLinks items={["linkedin"]} />
          </div>
        </div>
        <figure className="mx-auto w-full max-w-[22rem] lg:mx-0">
          <div className="rounded-[1.75rem] bg-gradient-to-br from-accent/70 via-line to-signal/60 p-px">
            <div className="rounded-[1.7rem] bg-ink p-2">
              <img
                src={site.portrait}
                alt="Portrait of Abdul Subhan Durrani"
                width="682"
                height="1024"
                fetchPriority="high"
                decoding="async"
                className="aspect-[4/5] w-full rounded-[1.35rem] object-cover object-[center_16%]"
              />
            </div>
          </div>
          <figcaption className="mt-4 px-1">
            <p className="text-sm text-paper">{site.name}</p>
            <p className="text-xs text-mist">{site.title}</p>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
