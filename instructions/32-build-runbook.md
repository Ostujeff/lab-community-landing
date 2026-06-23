# Build Runbook — пошаговая сборка и деплой

## Цель

Последовательность команд от scaffold до живого сайта. После прогона: сайт открывается, форма пишет лид и шлёт TG.

## Вход

- `instructions/30-stack.md`
- `instructions/31-infra-deploy.md`
- `00-monad.md` — раздел 6 (RUNBOOK)

## Что произвести

### Порядок BUILD (строго последовательно)

#### Фаза 0: Подготовка (человек)

1. Telegram-бот: `@BotFather` → `TG_BOT_TOKEN`
2. Написать боту → при необходимости проверить `getUpdates`; admin chat_id в реализации захардкожен, а для обхода блокировки Telegram API используется `TG_API_IP`
3. Создать `/opt/lab-community/app/.env` с секретами и production basePath:

```env
TG_BOT_TOKEN=
TG_API_IP=149.154.167.220
DATABASE_PATH=/opt/lab-community/app/data/leads.db
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_BASE_PATH=/lab
```

#### Фаза 1: Scaffold (по 20 + 21 + 30)

```bash
sudo mkdir -p /opt/lab-community && sudo chown -R $USER /opt/lab-community
cd /opt/lab-community

# EXPANSION уже выполнен — instructions/ на месте
# Scaffold Next.js:
cd app
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --yes
npm install better-sqlite3 zod
npm install -D @types/better-sqlite3
```

Далее по `30-stack.md`:
- Настроить `next.config.ts` (standalone)
- Создать `globals.css` с токенами из `20-design-system.md`
- Создать `layout.tsx` с шрифтами
- Создать все компоненты из `21-information-architecture.md`
- Создать `lib/` модули

#### Фаза 2: Контент (по 12)

- Заполнить `lib/copy.ts` текстами из `12-copy.md`
- Подключить тексты в компоненты

#### Фаза 3: Backend (по 30)

- Реализовать `lib/db.ts`, `lib/telegram.ts`, `lib/rate-limit.ts`, `lib/validation.ts`
- Реализовать `api/apply/route.ts`
- Реализовать `ApplyForm.tsx` (client, honeypot, состояния)

#### Фаза 4: Сборка

```bash
cd /opt/lab-community/app
npm run build
cp -r .next/static .next/standalone/.next/static
cp -r public .next/standalone/public
mkdir -p data
```

#### Фаза 5: Деплой (по 31)

```bash
# systemd
sudo cp deploy/lab.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now lab

# Production на workisfun.ru/lab:
# добавить в существующий Docker Caddyfile:
# handle /lab* { reverse_proxy 172.17.0.1:3000 }
docker restart crisp-dm-caddy
```

#### Фаза 6: Верификация

```bash
# 1. Приложение отвечает
curl -I http://127.0.0.1:3000

# 2. Сайт открывается в браузере
# https://workisfun.ru/lab

# 3. Тестовая заявка через /lab/apply

# 4. Проверка БД
sqlite3 /opt/lab-community/app/data/leads.db \
  "SELECT id, created_at, name, desired_tier, status FROM leads;"

# 5. Проверка Telegram (сообщение админу + автоответ заявителю, если бот может написать)
```

### Чек-лист готовности

- [ ] `npm run build` без ошибок
- [ ] `curl http://127.0.0.1:3000` → 200
- [ ] `curl https://workisfun.ru/lab` → 200
- [ ] Лендинг: все 12 секций на месте
- [ ] `/lab/apply`: форма отправляется
- [ ] Строка в `leads.db`
- [ ] Сообщение в Telegram админу (если `.env` заполнен)
- [ ] `systemctl is-active lab` → active
- [ ] Сайт доступен снаружи через Docker Caddy

## Definition of Done

- [ ] Последовательность команд от scaffold до живого сайта
- [ ] Шаги верификации описаны
- [ ] После прогона: сайт открывается, форма пишет лид и шлёт TG
