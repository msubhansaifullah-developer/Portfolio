import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { projectPath } from "../data/content";
import ProjectVisual from "./ProjectVisual";

export default function ProjectCard({ project }) {
  return (
    <motion.article
      className="project-card group relative grid items-center gap-8 lg:grid-cols-[0.82fr_1.18fr]"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
    >
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-mist">{project.category}</p>
        <h3 className="mt-3 font-serif text-3xl tracking-tight text-paper sm:text-4xl">
          <Link to={projectPath(project.slug)} className="static after:absolute after:inset-0 after:content-['']">
            {project.name}
          </Link>
        </h3>
        <p className="mt-4 max-w-xl text-sm leading-7 text-mist sm:text-base">{project.description}</p>
        <ul className="mt-5 flex flex-wrap gap-2">
          {project.technologies.map((technology) => (
            <li key={technology} className="rounded-full border border-line bg-ink px-3 py-1 text-xs text-paper">
              {technology}
            </li>
          ))}
        </ul>
        <p className="mt-5 inline-flex items-center gap-2 text-sm text-paper">
          View details
          <ArrowUpRight className="h-4 w-4 transition duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
        </p>
      </div>
      <div className="hidden lg:block">
        <ProjectVisual project={project} />
      </div>
    </motion.article>
  );
}
