import Link from "next/link";
import { cta } from "@/lib/copy";

export default function BottomCTA() {
  return (
    <section className="bottom-cta-section section-pad border-b border-[var(--line)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-semibold md:text-4xl">{cta.title}</h2>
          <p className="mt-3 max-w-lg text-[var(--text-secondary)]">{cta.subtitle}</p>
        </div>
        <Link href="/apply" className="btn btn-main shrink-0">
          {cta.button} →
        </Link>
      </div>
    </section>
  );
}
