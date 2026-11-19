export default function SectionHeading({ id, index, eyebrow, title, subtitle }) {
  return (
    <div className="max-w-2xl">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-mist">
        {index} <span aria-hidden="true">/</span> {eyebrow}
      </p>
      <h2 id={id} className="mt-3 font-serif text-[clamp(2.1rem,4vw,3.4rem)] leading-[1.08] tracking-tight text-paper">
        {title}
      </h2>
      {subtitle ? <p className="mt-4 text-lg leading-8 text-mist">{subtitle}</p> : null}
    </div>
  );
}
