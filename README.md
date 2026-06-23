# AI Lab Community Landing

Лендинг тестового раздела «Сообщество / Лаборатория» для glebkudr.com.

Живая версия: https://workisfun.ru/lab

## Что это

Это не общий клуб про AI, а страница закрытой лаборатории для людей, которые уже пробуют делать AI-продукты и хотят довести один проект до рабочей версии.

Ключевая логика продукта:

- главный клиент: AI-фаундер, продакт, инженер или автоматизатор с идеей, прототипом или демо;
- боль: демо есть, но нет ясной задачи, ревью, ритма и давления среды, чтобы довести проект до результата;
- обещание: выбрать одну задачу, собрать рабочий агентный контур, пройти ревью и защитить результат;
- активное участие называется `Резидент` — 10 000 ₽/мес;
- пассивное участие называется `Вольнослушатель` — 20 000 ₽/мес;
- командный тариф — по запросу.

## Как собирался проект

Проект стартовал из `00-monad.md`. По нему сначала был выполнен `EXPANSION`: созданы дочерние инструкции в `instructions/`.

Дальше BUILD выполнялся по этим инструкциям:

1. `10-market-research.md` — рынок AI-сообществ, причины смерти клубов, бенчмарки.
2. `11-product-spec.md` — модель лаборатории, роли, устав, недельный ритм.
3. `12-copy.md` — копирайт лендинга и формы.
4. `20-design-system.md` — визуальные токены и компоненты в стиле glebkudr.com.
5. `21-information-architecture.md` — маршруты, секции, форма, API.
6. `30-stack.md` — Next.js, SQLite, Telegram, структура проекта.
7. `31-infra-deploy.md` и `32-build-runbook.md` — standalone build, systemd, Caddy.

После первичной сборки тексты были дополнительно переработаны:

- обращение к читателю переведено на `ты`;
- термин `Студент` заменён на `Резидент`;
- убран тариф `Кандидат`;
- вольнослушатель зафиксирован как 20 000 ₽/мес;
- hero-хук сфокусирован на боли «AI-проект застрял на уровне демо»;
- убраны LLM-клише и формулы вида «не А, а Б»;
- добавлены интерактивные элементы: анимированный терминал в hero и кликабельные форматы семинара.

## Техническая структура

```text
/opt/lab-community
├── 00-monad.md
├── README.md
├── instructions/
└── app/
    ├── src/app/              # Next.js App Router
    ├── src/components/       # секции лендинга и форма
    ├── src/lib/              # copy, validation, db, telegram, rate-limit
    ├── deploy/lab.service    # systemd unit
    └── next.config.ts        # standalone + basePath /lab
```

## Запуск локально

```bash
cd app
npm install
cp .env.example .env
npm run dev
```

Для локального запуска без `/lab` можно убрать `NEXT_PUBLIC_BASE_PATH` из `.env`.

## Production

Production-сборка:

```bash
cd /opt/lab-community/app
npm run build
cp -r .next/static .next/standalone/.next/static
cp -r public .next/standalone/public
sudo systemctl restart lab
```

Сервис `lab` слушает `127.0.0.1:3000` / `0.0.0.0:3000`.

На домене `workisfun.ru` трафик идёт через существующий Docker Caddy:

```caddy
handle /lab* {
    reverse_proxy 172.17.0.1:3000
}
```

## Переменные окружения

```env
TG_BOT_TOKEN=
TG_API_IP=149.154.167.220
DATABASE_PATH=/opt/lab-community/app/data/leads.db
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_BASE_PATH=/lab
```

`TG_API_IP` используется потому, что прямой `api.telegram.org:443` с сервера таймаутится, а `149.154.167.220` доступен.

Секреты и база не коммитятся.

## Проверка

```bash
curl -I https://workisfun.ru/lab
curl -I https://workisfun.ru/lab/apply
curl -s -X POST https://workisfun.ru/lab/api/apply \
  -H 'Content-Type: application/json' \
  -d '{"name":"Тест","contact":"@test","diploma_idea":"Проверка формы через домен","desired_tier":"student"}'
```

Лид сохраняется в SQLite: `app/data/leads.db`.

