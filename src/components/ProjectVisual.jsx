function Frame({ title, children }) {
  return (
    <div className="flex h-full min-h-[250px] flex-col rounded-2xl border border-line bg-panel p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-line" />
          <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-line" />
          <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-line" />
          <span className="truncate text-xs text-mist">{title}</span>
        </div>
        <span className="shrink-0 text-[10px] uppercase tracking-[0.16em] text-mist">Illustration</span>
      </div>
      <div className="mt-4 min-h-0 flex-1">{children}</div>
    </div>
  );
}

function Bar({ width = "70%" }) {
  return <span className="block h-1.5 rounded-full bg-line" style={{ width }} />;
}

function Shifts() {
  const columns = [
    { label: "Morning", widths: ["78%", "56%", "68%"] },
    { label: "Evening", widths: ["64%", "80%", "48%"] },
    { label: "Night", widths: ["52%", "70%", "60%"] },
  ];

  return (
    <Frame title="Shift board">
      <div className="grid h-full grid-cols-3 gap-2">
        {columns.map((column) => (
          <div key={column.label} className="rounded-xl border border-line bg-ink p-2.5">
            <p className="text-[11px] text-mist">{column.label}</p>
            <div className="mt-3 space-y-2">
              {column.widths.map((width) => (
                <div key={width} className="rounded-lg border border-line px-2 py-2">
                  <Bar width={width} />
                  <span className="mt-1.5 block h-1.5 w-2/5 rounded-full bg-[#3f3f46]" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Frame>
  );
}

function Onboarding() {
  const steps = ["Personal details", "Employment", "Documents"];

  return (
    <Frame title="Onboarding">
      <div className="grid h-full gap-3 sm:grid-cols-[0.8fr_1.2fr]">
        <ol className="space-y-2">
          {steps.map((step, index) => (
            <li key={step} className="flex items-center gap-2 rounded-xl border border-line bg-ink px-3 py-2">
              <span className="grid h-6 w-6 place-items-center rounded-full border border-line text-[11px] text-paper">
                {index + 1}
              </span>
              <span className="text-xs text-mist">{step}</span>
            </li>
          ))}
        </ol>
        <div className="rounded-xl border border-line bg-ink p-3">
          <Bar width="46%" />
          <div className="mt-3 h-8 rounded-lg border border-line" />
          <div className="mt-2 h-8 rounded-lg border border-line" />
          <div className="mt-3 space-y-2">
            {["Identity document", "Employment form"].map((item) => (
              <div key={item} className="flex items-center justify-between rounded-lg border border-line px-2 py-2">
                <span className="text-[11px] text-mist">{item}</span>
                <span className="h-3 w-3 rounded-full border border-line" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Frame>
  );
}

function Reports() {
  const bars = [42, 68, 50, 84, 60, 74, 48];

  return (
    <Frame title="Reports">
      <div className="grid h-full gap-3 sm:grid-cols-[1.2fr_0.8fr]">
        <div className="flex h-44 items-end gap-2 rounded-xl border border-line bg-ink px-3 py-3">
          {bars.map((height) => (
            <span
              key={height}
              className="flex-1 rounded-t-md bg-gradient-to-t from-accent/80 to-signal/70"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
        <ul className="space-y-2">
          {["Daily report", "Weekly summary", "Exception report"].map((item) => (
            <li key={item} className="rounded-xl border border-line bg-ink px-3 py-3">
              <p className="text-xs text-mist">{item}</p>
              <span className="mt-2 block h-1.5 w-3/5 rounded-full bg-line" />
            </li>
          ))}
        </ul>
      </div>
    </Frame>
  );
}

const visuals = {
  shifts: Shifts,
  onboarding: Onboarding,
  reports: Reports,
};

export default function ProjectVisual({ project, variant = "shifts", contained = false }) {
  if (project?.image) {
    return (
      <img
        src={project.image}
        alt={project.imageAlt}
        width={project.imageWidth}
        height={project.imageHeight}
        loading="lazy"
        decoding="async"
        style={contained ? undefined : { aspectRatio: `${project.imageWidth} / ${project.imageHeight}` }}
        className={
          contained
            ? "max-h-[28rem] w-full rounded-2xl border border-line bg-ink object-contain object-left-top"
            : "w-full rounded-2xl border border-line bg-ink object-cover object-top"
        }
      />
    );
  }

  const Visual = visuals[project?.visual ?? variant] ?? Shifts;
  return (
    <div aria-hidden="true" className="h-full">
      <Visual />
    </div>
  );
}
