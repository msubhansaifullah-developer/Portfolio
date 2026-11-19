import { Link, useParams } from "react-router-dom";
import { findProject, projectPath, projects } from "../data/content";
import NotFound from "./NotFound";
import ProjectVisual from "../components/ProjectVisual";

export default function ProjectPage() {
  const { slug } = useParams();
  const project = findProject(slug);

  if (!project) return <NotFound />;

  const others = projects.filter((item) => item.slug !== project.slug);

  return (
    <article className="pb-24 pt-28 sm:pb-28">
      <div className="shell">
      <nav aria-label="Breadcrumb" className="text-sm text-mist">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link to="/" className="hover:text-paper">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link to="/#projects" className="hover:text-paper">
              Projects
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-paper">
            {project.name}
          </li>
        </ol>
      </nav>

      <p className="mt-8 text-xs font-medium uppercase tracking-[0.16em] text-mist">{project.category}</p>
      <h1 className="mt-3 max-w-3xl font-serif text-[clamp(2.5rem,5vw,4.25rem)] leading-[1.05] tracking-tight text-paper">
        {project.name}
      </h1>
      <p className="mt-5 max-w-2xl text-base leading-7 text-mist sm:text-lg">{project.description}</p>

      <div className="mt-10 max-w-5xl">
        <ProjectVisual project={project} contained />
        <p className="mt-3 text-xs leading-5 text-mist">
          {project.image
            ? "Product screenshot. Staff names and site addresses are hidden."
            : "Interface illustration, not a production screenshot."}
        </p>

        <div className="mt-12 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_16.5rem]">
          <section aria-labelledby="features-heading">
            <h2 id="features-heading" className="font-serif text-3xl text-paper">
              Key features
            </h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {project.features.map((feature) => (
                <li key={feature} className="flex gap-3 rounded-2xl border border-line bg-card px-4 py-3 text-sm leading-6 text-mist">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </section>
          <section aria-labelledby="tech-heading">
            <h2 id="tech-heading" className="font-serif text-3xl text-paper">
              Technologies
            </h2>
            <ul className="surface mt-6 flex flex-wrap gap-2 p-5">
              {project.technologies.map((technology) => (
                <li key={technology} className="rounded-full border border-line bg-ink px-3 py-1 text-xs text-paper">
                  {technology}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
      </div>

      <section aria-labelledby="other-work-heading" className="shell mt-16 border-t border-line pt-10">
        <h2 id="other-work-heading" className="font-serif text-3xl text-paper">
          Other work
        </h2>
        <ul className="mt-6 grid gap-4 md:grid-cols-2">
          {others.map((item) => (
            <li key={item.slug}>
              <Link to={projectPath(item.slug)} className="surface block p-5 transition-colors hover:border-[#3f3f46]">
                <p className="text-xs uppercase tracking-[0.16em] text-mist">{item.category}</p>
                <p className="mt-2 font-serif text-2xl text-paper">{item.name}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
