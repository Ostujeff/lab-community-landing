import Link from "next/link";
import { nav } from "@/lib/copy";

export default function SiteHeader() {
  return (
    <header className="relative z-30 flex items-start justify-between gap-7 px-[var(--landing-gutter)] pt-6">
      <Link href="/" className="flex items-start gap-3 text-inherit no-underline">
        <span className="rounded border border-[var(--line)] px-2 py-1 font-[family-name:var(--font-unbounded)] text-sm font-bold">
          GK
        </span>
        <strong className="text-sm font-normal leading-tight">
          ИИ-лаборатория
          <br />
          Глеба Кудрявцева
        </strong>
      </Link>
      <nav
        className="hidden items-center gap-6 text-sm text-[var(--text-secondary)] md:flex"
        aria-label="Основное меню"
      >
        {nav.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="text-inherit no-underline transition-colors hover:text-[var(--text-primary)]"
          >
            {item.label}
          </a>
        ))}
      </nav>
      <Link href="/apply" className="btn btn-main py-2.5 text-sm">
        Подать заявку →
      </Link>
    </header>
  );
}
