import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mx-[var(--landing-gutter)] flex flex-col justify-between gap-6 border-t border-[var(--line)] py-7 md:flex-row">
      <div>
        <strong className="text-sm">ИИ-лаборатория Глеба Кудрявцева</strong>
        <p className="mt-2 max-w-sm text-sm text-[var(--text-muted)]">
          Закрытое сообщество для тех, кто доводит AI-проекты до рабочей версии.
        </p>
      </div>
      <nav className="flex flex-wrap gap-4 text-sm text-[var(--text-secondary)]" aria-label="Нижнее меню">
        <a href="https://glebkudr.com/courses" className="text-inherit no-underline hover:text-[var(--text-primary)]">
          Курсы
        </a>
        <a href="https://glebkudr.com/b2b" className="text-inherit no-underline hover:text-[var(--text-primary)]">
          B2B
        </a>
        <Link href="/apply" className="text-inherit no-underline hover:text-[var(--text-primary)]">
          Заявка
        </Link>
        <a href="https://glebkudr.com/privacy" className="text-inherit no-underline hover:text-[var(--text-primary)]">
          Политика
        </a>
        <a href="https://glebkudr.com/oferta" className="text-inherit no-underline hover:text-[var(--text-primary)]">
          Оферта
        </a>
      </nav>
    </footer>
  );
}
