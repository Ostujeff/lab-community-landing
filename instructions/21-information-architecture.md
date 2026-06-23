# Информационная архитектура

## Цель

Карта страниц, компонентов и формы. Однозначно реализуемо.

## Вход

- `00-monad.md` — раздел 2.4
- `instructions/12-copy.md`

## Что произвести

### Дерево маршрутов

```
/                    → Лендинг внутри Next-приложения
/apply               → Страница заявки + форма
/api/apply           → POST: приём заявки

Production basePath:
/lab                 → Лендинг на workisfun.ru
/lab/apply           → Страница заявки
/lab/api/apply       → POST: приём заявки
```

### Лендинг `/` — секции-компоненты

| # | ID якоря | Компонент | Источник текста |
|---|---|---|---|
| 1 | — | `SiteHeader` | copy: навигация |
| 2 | — | `Hero` | copy: hero + agent-trace |
| 3 | — | `StatBar` | copy: стат-полоса |
| 4 | `#manifest` | `Manifest` | copy: манифест 01/02/03 |
| 5 | `#how` | `HowItWorks` | copy: ритм + арка + кликабельные форматы семинара |
| 6 | — | `Personas` | copy: 3 персоны |
| 7 | `#charter` | `Charter` | copy: устав |
| 8 | — | `DiplomaProjects` | copy: 4 архетипа |
| 9 | — | `Residents` | copy: приглашённые звёзды и категории экспертизы |
| 10 | `#pricing` | `Pricing` | copy: 3 тарифа |
| 11 | `#faq` | `FAQ` | copy: 6+ Q&A |
| 12 | — | `BottomCTA` + `Footer` | copy: CTA + футер |

### Страница `/apply`

| Состояние | UI |
|---|---|
| `idle` | Интро «что мы ищем» + форма |
| `loading` | Кнопка disabled, текст «Отправка…» |
| `success` | ✓ + «Заявка принята» + что дальше |
| `error` | Сообщение об ошибке, форма остаётся |

### Схема формы

| Поле | Тип | Required | Валидация zod |
|---|---|---|---|
| `name` | text | да | min 2 |
| `contact` | text | да | min 3 (Telegram @ или email) |
| `role` | text | нет | — |
| `ai_level` | select | нет | enum: building / automating / researching / advanced |
| `diploma_idea` | textarea | да | min 20 |
| `contributions` | checkbox[] | нет | array of strings |
| `desired_tier` | select | да | enum: student / listener / team (`student` — технический enum для тарифа «Резидент») |
| `portfolio_url` | url | нет | url или пусто |
| `source` | text | нет | — |
| `website` | text (hidden) | нет | honeypot: max 0 |

### API `/api/apply` — флоу

```
POST JSON → zod validate → honeypot check → rate-limit by IP →
insert lead (SQLite) → Telegram admin notification + applicant confirmation → { ok: true }
```

Если TG упал — всё равно 200 (лид сохранён), ошибка в лог.

## Definition of Done

- [ ] Дерево маршрутов: `/`, `/apply`, `/api/apply`; production basePath `/lab`
- [ ] 12 секций лендинга смаплены на компоненты
- [ ] 4 состояния `/apply` описаны
- [ ] Схема формы с типами и zod-валидацией
- [ ] API-флоу однозначен
