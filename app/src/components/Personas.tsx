import { personas } from "@/lib/copy";

export default function Personas() {
  return (
    <section className="section-pad border-b border-[var(--line)]">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-10 text-3xl font-semibold md:text-4xl">{personas.title}</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {personas.items.map((item) => (
            <article
              key={item.title}
              className="rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--bg-card)] p-6"
            >
              <h3 className="mb-3 text-lg font-semibold">{item.title}</h3>
              <p className="leading-relaxed text-[var(--text-secondary)]">{item.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
