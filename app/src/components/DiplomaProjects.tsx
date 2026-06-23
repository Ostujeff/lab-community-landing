import { diplomas } from "@/lib/copy";

export default function DiplomaProjects() {
  return (
    <section className="section-pad border-b border-[var(--line)]">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-3xl font-semibold md:text-4xl">{diplomas.title}</h2>
        <p className="mt-2 text-sm text-[var(--text-muted)]">{diplomas.subtitle}</p>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {diplomas.items.map((d) => (
            <article key={d.title} className="agent-trace rounded-[var(--radius-sm)] p-6">
              <span className="status-pill text-xs">{d.tag}</span>
              <h3 className="mt-3 font-[family-name:var(--font-unbounded)] font-semibold">
                {d.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">{d.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
