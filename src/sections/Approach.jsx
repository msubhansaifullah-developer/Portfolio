import { Code2, Database, Gauge, Layers, MonitorSmartphone, Puzzle, Workflow } from "lucide-react";
import { principles } from "../data/content";
import SectionHeading from "../components/SectionHeading";

const icons = [Code2, Layers, Database, Gauge, Puzzle, MonitorSmartphone, Workflow];

export default function Approach() {
  return (
    <section id="approach" aria-labelledby="approach-heading" className="shell py-14 sm:py-16">
      <SectionHeading
        id="approach-heading"
        index="05"
        eyebrow="Practice"
        title="Development Approach"
        subtitle="A practical way of building business software."
      />
      <ul className="mt-12 grid gap-x-12 sm:grid-cols-2">
        {principles.map((principle, index) => {
          const Icon = icons[index];
          return (
            <li key={principle.title} className="border-t border-line py-6">
              <div className="flex gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-line bg-card">
                  <Icon className="h-5 w-5 text-paper" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-lg text-paper">{principle.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-mist">{principle.text}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
