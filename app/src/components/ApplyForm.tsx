"use client";

import { useState } from "react";
import { applySchema, contributionOptions } from "@/lib/validation";
import { apply as applyCopy } from "@/lib/copy";

export default function ApplyForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrors({});

    const form = new FormData(e.currentTarget);
    const payload = {
      name: form.get("name") as string,
      contact: form.get("contact") as string,
      role: (form.get("role") as string) || undefined,
      ai_level: (form.get("ai_level") as string) || undefined,
      diploma_idea: form.get("diploma_idea") as string,
      contributions: form.getAll("contributions") as string[],
      desired_tier: form.get("desired_tier") as string,
      portfolio_url: (form.get("portfolio_url") as string) || "",
      source: (form.get("source") as string) || undefined,
      website: (form.get("website") as string) || "",
    };

    const parsed = applySchema.safeParse(payload);
    if (!parsed.success) {
      setErrors(parsed.error.flatten().fieldErrors as Record<string, string[]>);
      setStatus("idle");
      return;
    }

    try {
      const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
      const res = await fetch(`${basePath}/api/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-[var(--radius-sm)] border border-[#00c75833] bg-[var(--bg-card)] p-8 text-center">
        <div className="mb-4 text-4xl text-[var(--accent-green)]">✓</div>
        <h2 className="text-2xl font-semibold">{applyCopy.success.title}</h2>
        <p className="mt-4 text-[var(--text-secondary)]">{applyCopy.success.text}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="pointer-events-none absolute h-0 w-0 opacity-0"
        aria-hidden
      />

      <Field label="Имя *" error={errors.name}>
        <input name="name" required className="input" />
      </Field>

      <Field label="Контакт (Telegram @ или email) *" error={errors.contact}>
        <input name="contact" required placeholder="@username или email" className="input" />
      </Field>

      <Field label="Роль / чем занимаешься" error={errors.role}>
        <input name="role" className="input" />
      </Field>

      <Field label="Уровень с AI" error={errors.ai_level}>
        <select name="ai_level" className="input">
          <option value="">Выбери</option>
          <option value="building">Строю продукты</option>
          <option value="automating">Автоматизирую</option>
          <option value="researching">Исследую</option>
          <option value="advanced">Продвинутый юзер</option>
        </select>
      </Field>

      <Field label="Идея дипломного проекта *" error={errors.diploma_idea}>
        <textarea
          name="diploma_idea"
          required
          rows={4}
          placeholder="Что хочешь довести до рабочего продукта?"
          className="input"
        />
      </Field>

      <Field label="Как хочешь участвовать" error={errors.contributions}>
        <div className="flex flex-wrap gap-3">
          {contributionOptions.map((opt) => (
            <label key={opt.id} className="flex cursor-pointer items-center gap-2 text-sm">
              <input type="checkbox" name="contributions" value={opt.id} />
              {opt.label}
            </label>
          ))}
        </div>
      </Field>

      <Field label="Желаемый тариф *" error={errors.desired_tier}>
        <select name="desired_tier" required className="input">
          <option value="student">Резидент (10 000 ₽/мес)</option>
          <option value="listener">Вольнослушатель (20 000 ₽/мес)</option>
          <option value="team">Команда (B2B)</option>
        </select>
      </Field>

      <Field label="Ссылка на своё (портфолио, GitHub)" error={errors.portfolio_url}>
        <input name="portfolio_url" type="url" placeholder="https://" className="input" />
      </Field>

      <Field label="Откуда узнали" error={errors.source}>
        <input name="source" className="input" />
      </Field>

      {status === "error" && (
        <p className="text-sm text-red-400">{applyCopy.error}</p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="btn btn-main w-full justify-center disabled:opacity-50"
      >
        {status === "loading" ? "Отправка…" : "Отправить заявку"}
      </button>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string[];
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium">{label}</label>
      {children}
      {error?.[0] && <p className="mt-1 text-xs text-red-400">{error[0]}</p>}
    </div>
  );
}
