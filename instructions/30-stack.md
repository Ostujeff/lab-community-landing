# Стек и структура кода

## Цель

Зафиксировать стек, дерево проекта, контракты API/БД/Telegram. Компилируется, типобезопасно.

## Вход

- `00-monad.md` — разделы 2.6–2.7
- `instructions/20-design-system.md`
- `instructions/21-information-architecture.md`

## Что произвести

### Зависимости

```json
{
  "dependencies": {
    "next": "16.x",
    "react": "19.x",
    "react-dom": "19.x",
    "better-sqlite3": "latest",
    "zod": "latest"
  },
  "devDependencies": {
    "@types/better-sqlite3": "latest",
    "typescript": "5.x",
    "tailwindcss": "4.x"
  }
}
```

### Дерево проекта

```
app/
├── next.config.ts          # output: 'standalone', basePath, serverExternalPackages
├── package.json
├── tsconfig.json           # paths: @/* → ./src/*
├── .env.example
├── data/                   # leads.db (gitignored)
├── public/
└── src/
    ├── app/
    │   ├── layout.tsx      # шрифты Unbounded + Commissioner
    │   ├── globals.css     # токены + @theme
    │   ├── page.tsx        # лендинг (production: /lab)
    │   ├── apply/page.tsx  # форма
    │   └── api/apply/route.ts
    ├── components/
    │   ├── SiteHeader.tsx
    │   ├── Hero.tsx
    │   ├── StatBar.tsx
    │   ├── Manifest.tsx
    │   ├── HowItWorks.tsx  # client: кликабельные форматы семинара
    │   ├── Personas.tsx
    │   ├── Charter.tsx
    │   ├── DiplomaProjects.tsx
    │   ├── Residents.tsx
    │   ├── Pricing.tsx
    │   ├── FAQ.tsx
    │   ├── BottomCTA.tsx
    │   ├── Footer.tsx
    │   └── ApplyForm.tsx   # client component
    └── lib/
        ├── copy.ts         # тексты из 12-copy.md
        ├── validation.ts   # zod-схема
        ├── db.ts           # better-sqlite3 init + insert
        ├── telegram.ts     # sendMessage
        └── rate-limit.ts   # in-memory по IP
```

### next.config.ts

```ts
const nextConfig = {
  output: "standalone",
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  serverExternalPackages: ["better-sqlite3"],
};
```

### Контракт API `POST /api/apply`

**Request:** JSON, поля по схеме zod (см. 21-information-architecture.md)

**Response 200:** `{ "ok": true }`
**Response 400:** `{ "ok": false, "errors": { field: string[] } }`
**Response 429:** `{ "ok": false, "error": "rate_limit" }`

### Модуль БД (`lib/db.ts`)

- Путь: `process.env.DATABASE_PATH` или `./data/leads.db`
- Init-схема при первом подключении (CREATE TABLE IF NOT EXISTS)
- Функция `insertLead(lead)` → `lastInsertRowid`

Схема `leads` — см. `00-monad.md` раздел 2.7.

### Модуль Telegram (`lib/telegram.ts`)

- `sendLeadNotification(lead)` → admin notification в chat_id `305264938`
- `sendApplicantConfirmation(contact, name)` → автоответ заявителю, если в контакте Telegram username/chat_id
- HTTP-запрос идёт через `https.request` на `TG_API_IP` с `Host`/SNI `api.telegram.org`, потому что прямой `api.telegram.org:443` на сервере таймаутится
- HTML-формат: имя, контакт, роль, идея диплома, тариф, вклад
- Если `TG_BOT_TOKEN` не задан — warn в лог, не падать

### Переменные окружения

```
TG_BOT_TOKEN=
TG_API_IP=149.154.167.220
DATABASE_PATH=/opt/lab-community/app/data/leads.db
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_BASE_PATH=/lab
```

## Definition of Done

- [ ] Дерево проекта полное и однозначное
- [ ] `next.config` с `standalone` и production basePath `/lab`
- [ ] Tailwind v4 + токены из 20-design-system.md
- [ ] API-контракт `/api/apply` описан
- [ ] Модули БД и Telegram специфицированы (admin + applicant notifications)
- [ ] zod-схема покрывает все поля формы + honeypot
