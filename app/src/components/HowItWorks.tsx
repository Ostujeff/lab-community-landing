"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { howItWorks } from "@/lib/copy";

const formatDetails: Record<string, string> = {
  Разбор:
    "Приносишь свой процесс или узкое место: где агент ошибается, почему пайплайн не сходится, что мешает довести проект до рабочей версии.",
  "Мастер-класс":
    "Короткая практическая сессия по конкретному навыку: спецификация, агентный контур, RAG, eval, деплой или ревью результата.",
  Звезда:
    "Приглашённый практик разбирает тему, в которой уже набил шишки: архитектура, продукт, GTM, локальные модели или внедрение в команду.",
  Защита:
    "Показываешь, что получилось: рабочую версию, ограничения, следующие шаги и вопросы, на которые нужна обратная связь группы.",
};

export default function HowItWorks() {
  const [activeFormat, setActiveFormat] = useState(howItWorks.rhythm.weeks[0]);
  const [arrowLeft, setArrowLeft] = useState(34);
  const pillRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const activeDescription = formatDetails[activeFormat];

  useEffect(() => {
    function updateArrow() {
      const activePill = pillRefs.current[activeFormat];
      const popover = popoverRef.current;
      if (!activePill || !popover) return;

      const pillRect = activePill.getBoundingClientRect();
      const popoverRect = popover.getBoundingClientRect();
      const nextLeft = pillRect.left + pillRect.width / 2 - popoverRect.left;

      setArrowLeft(Math.max(22, Math.min(nextLeft, popoverRect.width - 22)));
    }

    updateArrow();
    window.addEventListener("resize", updateArrow);
    return () => window.removeEventListener("resize", updateArrow);
  }, [activeFormat]);

  return (
    <section id="how" className="section-pad border-b border-[var(--line)]">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-12 text-3xl font-semibold md:text-4xl">{howItWorks.title}</h2>

        <div className="mb-16 grid gap-10 lg:grid-cols-2">
          <div>
            <h3 className="mb-4 text-xl font-semibold">{howItWorks.rhythm.title}</h3>
            <p className="mb-6 leading-relaxed text-[var(--text-secondary)]">
              {howItWorks.rhythm.text}
            </p>
            <div className="flex flex-wrap gap-2" role="tablist" aria-label="Форматы семинара">
              {howItWorks.rhythm.weeks.map((week) => (
                <button
                  key={week}
                  type="button"
                  className={`status-pill rhythm-pill ${
                    activeFormat === week ? "rhythm-pill-active" : ""
                  }`}
                  ref={(node) => {
                    pillRefs.current[week] = node;
                  }}
                  aria-pressed={activeFormat === week}
                  onClick={() => setActiveFormat(week)}
                >
                  {week}
                </button>
              ))}
            </div>
            <div
              ref={popoverRef}
              className="rhythm-popover"
              style={{ "--rhythm-arrow-left": `${arrowLeft}px` } as CSSProperties}
              aria-live="polite"
            >
              <div className="rhythm-popover-arrow" />
              <h4>{activeFormat}</h4>
              <p>{activeDescription}</p>
            </div>
          </div>

          <div>
            <h3 className="mb-6 text-xl font-semibold">{howItWorks.arc.title}</h3>
            <ol className="space-y-4">
              {howItWorks.arc.steps.map((step) => (
                <li
                  key={step.num}
                  className="flex gap-4 rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--bg-panel)] p-4"
                >
                  <span className="numbered-marker shrink-0">{step.num}</span>
                  <div>
                    <div className="mb-1 font-medium">{step.title}</div>
                    <p className="text-sm text-[var(--text-secondary)]">{step.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
