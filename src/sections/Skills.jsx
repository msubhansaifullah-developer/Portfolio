import { Code2, Database, Monitor, Wrench } from "lucide-react";
import { skillGroups } from "../data/content";
import SectionHeading from "../components/SectionHeading";

const icons = {
  backend: Code2,
  frontend: Monitor,
  database: Database,
  tools: Wrench,
};

export default function Skills() {
  return (
    <section id="skills" aria-labelledby="skills-heading" className="shell py-14 sm:py-16">
      <SectionHeading
        id="skills-heading"
        index="02"
        eyebrow="Capabilities"
        title="Technical Skills"
        subtitle="Technologies I use for backend, frontend, database, and day-to-day development work."
      />
      <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {skillGroups.map((group) => {
          const Icon = icons[group.id];
          return (
            <li key={group.id} className="surface ring-card p-5">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-2xl border border-line bg-panel">
                  <Icon className="h-5 w-5 text-paper" aria-hidden="true" />
                </span>
                <h3 className="text-lg text-paper">{group.title}</h3>
              </div>
              <ul className="mt-5 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-line bg-ink px-3 py-1.5 text-sm text-paper transition-colors duration-200 hover:border-[#3f3f46]"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
