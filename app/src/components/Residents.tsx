import { residents } from "@/lib/copy";

export default function Residents() {
  return (
    <section className="section-pad border-b border-[var(--line)] bg-[var(--bg-panel)]">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-3xl font-semibold md:text-4xl">{residents.title}</h2>
        <p className="mt-2 text-[var(--text-muted)]">{residents.subtitle}</p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {residents.categories.map((c) => (
            <article
              key={c.area}
              className="rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--bg-card)] p-5"
            >
              <h3 className="font-semibold text-[var(--accent-orange)]">{c.area}</h3>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">{c.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
