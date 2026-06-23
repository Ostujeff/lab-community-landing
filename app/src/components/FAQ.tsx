import { faq } from "@/lib/copy";

export default function FAQ() {
  return (
    <section id="faq" className="section-pad border-b border-[var(--line)] bg-[var(--bg-panel)]">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-10 text-3xl font-semibold md:text-4xl">{faq.title}</h2>
        <div className="max-w-3xl space-y-4">
          {faq.items.map((item) => (
            <details
              key={item.q}
              className="group rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--bg-card)]"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between p-5 font-semibold">
                {item.q}
                <span className="text-[var(--text-muted)] transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="px-5 pb-5 text-sm leading-relaxed text-[var(--text-secondary)]">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
