import https from "node:https";
import { aiLevelLabels, tierLabels } from "./validation";

/** Админ для уведомлений о новых заявках (garevkv) */
const ADMIN_CHAT_ID = "305264938";

/** IP Telegram DC, доступный с этого сервера (DNS api.telegram.org → заблокирован) */
const TG_API_IP = process.env.TG_API_IP || "149.154.167.220";
const TG_API_HOST = "api.telegram.org";

interface TelegramPayload {
  name: string;
  contact: string;
  role?: string;
  ai_level?: string;
  diploma_idea: string;
  contributions?: string[];
  desired_tier: string;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function getBotToken(): string | null {
  const token = process.env.TG_BOT_TOKEN;
  if (!token) {
    console.warn("TG_BOT_TOKEN not set, skipping Telegram");
    return null;
  }
  return token;
}

/** Извлекает Telegram chat_id или @username из поля контакта */
export function parseTelegramContact(contact: string): string | null {
  const trimmed = contact.trim();

  if (/^\d{5,}$/.test(trimmed)) return trimmed;

  const tme = trimmed.match(/(?:https?:\/\/)?t\.me\/([a-zA-Z0-9_]{5,32})/i);
  if (tme) return `@${tme[1]}`;

  if (trimmed.startsWith("@")) {
    const user = trimmed.slice(1);
    if (/^[a-zA-Z0-9_]{5,32}$/.test(user)) return `@${user}`;
    return null;
  }

  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return null;

  if (/^[a-zA-Z][a-zA-Z0-9_]{4,31}$/.test(trimmed)) return `@${trimmed}`;

  return null;
}

function telegramApiRequest<T>(
  token: string,
  method: string,
  body: Record<string, unknown>
): Promise<T> {
  const payload = JSON.stringify(body);

  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        host: TG_API_IP,
        port: 443,
        path: `/bot${token}/${method}`,
        method: "POST",
        servername: TG_API_HOST,
        headers: {
          Host: TG_API_HOST,
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(payload),
        },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          try {
            const parsed = JSON.parse(data) as T & { ok?: boolean; description?: string };
            if (parsed.ok === false) {
              reject(
                new Error(
                  `Telegram API error: ${parsed.description || data}`
                )
              );
              return;
            }
            resolve(parsed);
          } catch {
            reject(new Error(`Telegram API invalid response: ${data}`));
          }
        });
      }
    );

    req.on("error", reject);
    req.write(payload);
    req.end();
  });
}

async function sendTelegramMessage(
  chatId: string,
  text: string,
  parseMode: "HTML" | undefined = "HTML"
): Promise<void> {
  const token = getBotToken();
  if (!token) return;

  const body: Record<string, unknown> = { chat_id: chatId, text };
  if (parseMode) body.parse_mode = parseMode;

  await telegramApiRequest(token, "sendMessage", body);
}

/** Уведомление админу @garevkv о новой заявке */
export async function sendLeadNotification(lead: TelegramPayload): Promise<void> {
  const contributions = lead.contributions?.length
    ? lead.contributions.join(", ")
    : "—";

  const text = [
    "<b>Новая заявка в лабораторию</b>",
    "",
    `<b>Имя:</b> ${escapeHtml(lead.name)}`,
    `<b>Контакт:</b> ${escapeHtml(lead.contact)}`,
    `<b>Роль:</b> ${escapeHtml(lead.role || "—")}`,
    `<b>Уровень AI:</b> ${escapeHtml(aiLevelLabels[lead.ai_level || ""] || "—")}`,
    `<b>Тариф:</b> ${escapeHtml(tierLabels[lead.desired_tier] || lead.desired_tier)}`,
    `<b>Вклад:</b> ${escapeHtml(contributions)}`,
    "",
    `<b>Идея диплома:</b>`,
    escapeHtml(lead.diploma_idea),
  ].join("\n");

  await sendTelegramMessage(ADMIN_CHAT_ID, text);
}

/** Подтверждение заявителю в Telegram (если указан @ник) */
export async function sendApplicantConfirmation(
  contact: string,
  name: string
): Promise<void> {
  const telegram = parseTelegramContact(contact);
  if (!telegram) return;

  const text = [
    `Привет${name ? `, ${name}` : ""}!`,
    "",
    "Твоя заявка в лабораторию принята. Мы рассмотрим её в ближайшее время.",
    "",
    "Если подойдём друг другу — свяжемся для короткого интервью на 20–30 минут.",
  ].join("\n");

  await sendTelegramMessage(telegram, text, undefined);
}
