import { Link } from "react-router-dom";
import { experience, projectPath, projects } from "../data/content";
import SectionHeading from "../components/SectionHeading";

export default function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-heading" className="shell py-14 sm:py-16">
      <SectionHeading
        id="experience-heading"
        index="03"
        eyebrow="Work"
        title="Experience"
        subtitle="My current role, and the work I do in it."
      />
      <div className="relative mt-12 pl-8">
        <div className="absolute bottom-0 left-[7px] top-2 w-px bg-gradient-to-b from-accent to-transparent" aria-hidden="true" />
        <span className="absolute left-0 top-1.5 h-4 w-4 rounded-full border-2 border-accent bg-ink" aria-hidden="true" />
        <article className="surface ring-card p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="font-serif text-3xl tracking-tight text-paper">{experience.position}</h3>
              <p className="mt-2 text-base text-paper">{experience.company}</p>
              <p className="mt-1 text-sm text-mist">{experience.location}</p>
            </div>
            <p className="w-fit rounded-full border border-line px-3 py-1 text-sm text-paper">
              <time dateTime={experience.startIso}>{experience.start}</time>
              <span aria-hidden="true"> — </span>
              <span className="sr-only"> to </span>
              {experience.end}
            </p>
          </div>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {experience.responsibilities.map((item) => (
              <li key={item} className="flex gap-3 text-sm leading-6 text-mist">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-sm leading-7 text-mist">
            Featured work from this role:{" "}
            {projects.map((project, index) => (
              <span key={project.slug}>
                {index === 0 ? "" : index === projects.length - 1 ? ", and " : ", "}
                <Link
                  to={projectPath(project.slug)}
                  className="text-paper underline decoration-line underline-offset-4 hover:decoration-accent"
                >
                  {project.name}
                </Link>
              </span>
            ))}
            .
          </p>
        </article>
      </div>
    </section>
  );
}
