import Link from "next/link";
import { pricing } from "@/lib/copy";

export default function Pricing() {
  return (
    <section id="pricing" className="section-pad border-b border-[var(--line)]">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-10 text-3xl font-semibold md:text-4xl">{pricing.title}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pricing.tiers.map((tier) => (
            <article
              key={tier.id}
              className={`flex flex-col rounded-[var(--radius-sm)] border p-6 ${
                tier.highlight
                  ? "border-[#00c75833] bg-[var(--bg-panel)]"
                  : "border-[var(--line)] bg-[var(--bg-card)]"
              }`}
            >
              <h3 className="text-lg font-semibold">{tier.name}</h3>
              <div className="mt-2 font-[family-name:var(--font-unbounded)] text-2xl">
                {tier.price}
              </div>
              <p className="mt-3 flex-1 text-sm text-[var(--text-secondary)]">{tier.desc}</p>
              <ul className="mt-4 space-y-2 text-sm text-[var(--text-muted)]">
                {tier.features.map((f) => (
                  <li key={f} className="check-item">
                    {f}
                  </li>
                ))}
              </ul>
              {tier.href.startsWith("http") ? (
                <a
                  href={tier.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline mt-6 justify-center text-sm"
                >
                  {tier.cta}
                </a>
              ) : (
                <Link href={tier.href} className="btn btn-main mt-6 justify-center text-sm">
                  {tier.cta}
                </Link>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
