import { z } from "zod";

export const applySchema = z.object({
  name: z.string().min(2, "Укажи имя"),
  contact: z.string().min(3, "Укажи Telegram @ или email"),
  role: z.string().optional(),
  ai_level: z
    .enum(["building", "automating", "researching", "advanced"])
    .optional(),
  diploma_idea: z
    .string()
    .min(20, "Опиши проект подробнее (минимум 20 символов)"),
  contributions: z.array(z.string()).optional(),
  desired_tier: z.enum(["student", "listener", "team"]),
  portfolio_url: z.string().url().optional().or(z.literal("")),
  source: z.string().optional(),
  website: z.string().max(0).optional(),
});

export type ApplyInput = z.infer<typeof applySchema>;

export const aiLevelLabels: Record<string, string> = {
  building: "Строю продукты",
  automating: "Автоматизирую",
  researching: "Исследую",
  advanced: "Продвинутый юзер",
};

export const tierLabels: Record<string, string> = {
  student: "Резидент",
  listener: "Вольнослушатель",
  team: "Команда",
};

export const contributionOptions = [
  { id: "talks", label: "Выступления" },
  { id: "hosting", label: "Хостинг встреч" },
  { id: "mentoring", label: "Менторство" },
  { id: "content", label: "Контент" },
  { id: "residents", label: "Орг. резидентов" },
];
