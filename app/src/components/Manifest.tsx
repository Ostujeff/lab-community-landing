import { manifest } from "@/lib/copy";

export default function Manifest() {
  return (
    <section id="manifest" className="section-pad border-b border-[var(--line)]">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-10 text-3xl font-semibold md:text-4xl">{manifest.title}</h2>
        <div className="grid gap-8 md:grid-cols-3">
          {manifest.items.map((item) => (
            <article key={item.num} className="rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--bg-panel)] p-6">
              <div className="numbered-marker mb-4">{item.num}</div>
              <p className="leading-relaxed text-[var(--text-secondary)]">{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
