import { charter } from "@/lib/copy";

export default function Charter() {
  return (
    <section id="charter" className="section-pad border-b border-[var(--line)] bg-[var(--bg-panel)]">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-3xl font-semibold md:text-4xl">{charter.title}</h2>
        <p className="mt-2 text-[var(--text-muted)]">{charter.subtitle}</p>

        <div className="mt-10 grid gap-8 md:grid-cols-2">
          <article className="rounded-[var(--radius-sm)] border border-[#00c75833] bg-[var(--bg-card)] p-6">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-xl font-semibold">{charter.active.title}</h3>
              <span className="status-pill">{charter.active.price}</span>
            </div>
            <ul className="mt-6 space-y-3 text-sm text-[var(--text-secondary)]">
              {charter.active.obligations.map((o) => (
                <li key={o} className="check-item">
                  {o}
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--bg-card)] p-6">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-xl font-semibold">{charter.passive.title}</h3>
              <span className="text-sm text-[var(--text-muted)]">{charter.passive.price}</span>
            </div>
            <ul className="mt-6 space-y-3 text-sm text-[var(--text-secondary)]">
              {charter.passive.rights.map((r) => (
                <li key={r} className="relative pl-5 before:absolute before:left-0 before:text-[var(--text-muted)] before:content-['—']">
                  {r}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}
