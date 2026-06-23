import { stats } from "@/lib/copy";

export default function StatBar() {
  return (
    <section className="section-pad border-b border-[var(--line)] py-8">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-cell">
            <div className="mb-1 text-xs uppercase tracking-wide text-[var(--text-muted)]">
              {stat.label}
            </div>
            <div className="font-[family-name:var(--font-unbounded)] text-lg font-medium">
              {stat.value}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
