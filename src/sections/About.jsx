import { about } from "../data/content";
import SectionHeading from "../components/SectionHeading";

export default function About() {
  return (
    <section id="about" aria-labelledby="about-heading" className="shell py-14 sm:py-16">
      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(16rem,0.62fr)] lg:gap-16">
        <div>
          <SectionHeading id="about-heading" index="01" eyebrow="Profile" title={about.title} subtitle={about.subtitle} />
          <div className="mt-8 space-y-5 text-base leading-7 text-mist sm:text-[17px]">
            {about.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
        <dl className="divide-y divide-line border-y border-line lg:mt-16">
          {about.facts.map((fact) => (
            <div key={fact.label} className="py-4">
              <dt className="text-xs font-medium uppercase tracking-[0.16em] text-mist">{fact.label}</dt>
              <dd className="mt-1 text-lg leading-7 text-paper">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
