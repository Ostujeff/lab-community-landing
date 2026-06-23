"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { hero } from "@/lib/copy";

const traceLines = [
  { time: "09:41:02", command: "load_context", detail: "идея, рынок, ограничения", status: "✓" },
  { time: "09:43:18", command: "write_spec", detail: "MVP и критерии успеха", status: "✓" },
  { time: "09:48:31", command: "spawn_agent", detail: "первый рабочий пайплайн", status: "✓" },
  { time: "10:12:04", command: "review_diff", detail: "узкие места и риски", status: "✓" },
  { time: "10:27:40", command: "demo_ready", detail: "проект готов к защите", status: "●" },
];

export default function Hero() {
  const [visibleLines, setVisibleLines] = useState(0);
  const [showCursor, setShowCursor] = useState(false);
  const [cycleKey, setCycleKey] = useState(0);

  useEffect(() => {
    let stopped = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    function later(callback: () => void, delay: number) {
      const timer = setTimeout(() => {
        if (!stopped) callback();
      }, delay);
      timers.push(timer);
    }

    function runCycle() {
      setVisibleLines(0);
      setShowCursor(false);
      setCycleKey((key) => key + 1);

      traceLines.forEach((_, index) => {
        later(() => setVisibleLines(index + 1), 250 + index * 620);
      });

      later(() => setShowCursor(true), 250 + traceLines.length * 620);

      later(() => {
        setShowCursor(false);
        setVisibleLines(0);
        later(runCycle, 500);
      }, 250 + traceLines.length * 620 + 1700);
    }

    runCycle();

    return () => {
      stopped = true;
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <section className="section-pad border-b border-[var(--line)]">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <h1 className="mb-6 whitespace-pre-line text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
            {hero.title}
          </h1>
          <p className="mb-8 max-w-xl text-lg leading-relaxed text-[var(--text-secondary)]">
            {hero.subtitle}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/apply" className="btn btn-main">
              {hero.ctaPrimary} →
            </Link>
            <a href="#how" className="btn btn-outline">
              {hero.ctaSecondary}
            </a>
          </div>
        </div>

        <div className="agent-trace lab-boot-trace" aria-label="Как проект бустится в лаборатории">
          <div className="trace-window-bar">
            <span>lab_project_boot</span>
            <span className="trace-window-dots">● ● ●</span>
          </div>
          <pre>
            {traceLines.map((line, i) => (
              <span
                key={line.command}
                className={`trace-line ${i < visibleLines ? "trace-line-visible" : ""}`}
              >
                <span className="trace-time">{line.time}</span>
                <span className="trace-command">{line.command}</span>
                <span className="trace-detail">{line.detail}</span>
                <span className="trace-status">{line.status}</span>
              </span>
            ))}
            <span className={`trace-cursor ${showCursor ? "trace-cursor-visible" : ""}`}>
              ready for demo_
            </span>
          </pre>
          <div className="trace-progress" aria-hidden="true">
            <span key={cycleKey} />
          </div>
        </div>
      </div>
    </section>
  );
}
