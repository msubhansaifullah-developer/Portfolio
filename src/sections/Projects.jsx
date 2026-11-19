import { projects } from "../data/content";
import ProjectCard from "../components/ProjectCard";
import SectionHeading from "../components/SectionHeading";

export default function Projects() {
  return (
    <section id="projects" aria-labelledby="projects-heading" className="shell py-14 sm:py-16">
      <SectionHeading
        id="projects-heading"
        index="04"
        eyebrow="Selected work"
        title="Featured Projects"
        subtitle="Business systems I contribute to as a Full Stack Developer at Shape Solutions (Pvt.) Ltd."
      />
      <div className="mt-12 space-y-10">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}
