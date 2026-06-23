# Инфраструктура и деплой

## Цель

Caddy + systemd + standalone-сборка. Сервис стартует, переживает reboot, отвечает на `127.0.0.1:3000`; снаружи доступен на `https://workisfun.ru/lab`.

## Вход

- `00-monad.md` — раздел 2.8
- `instructions/30-stack.md`

## Что произвести

### Расположение на сервере

```
/opt/lab-community/
├── 00-monad.md
├── instructions/
└── app/                    # Next.js проект
    ├── .env                # секреты (создаёт человек)
    ├── data/leads.db       # SQLite
    └── .next/standalone/   # артефакт сборки
```

### Caddyfile — вариант с доменом

```
your-domain.com {
    reverse_proxy 127.0.0.1:3000
}
```

### Фактический production-вариант `workisfun.ru/lab`

На сервере уже есть Docker Caddy проекта `crisp-dm-quiz`, который занимает `:80` и `:443`.
Лендос лаборатории подключён как отдельный путь:

```caddy
workisfun.ru {
    handle /lab* {
        reverse_proxy 172.17.0.1:3000
    }

    # остальные handle/reverse_proxy существующего сайта не трогать
}
```

Next.js собирается с:

```env
NEXT_PUBLIC_BASE_PATH=/lab
```

### Caddyfile — вариант с голым IP

```
:80 {
    reverse_proxy 127.0.0.1:3000
}
```

Установка Caddy:
```bash
sudo apt -y install debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update && sudo apt -y install caddy
```

### systemd unit `lab.service`

```ini
[Unit]
Description=Lab Community Next.js App
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/lab-community/app/.next/standalone
EnvironmentFile=/opt/lab-community/app/.env
ExecStart=/usr/bin/node server.js
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

Размещение: `/etc/systemd/system/lab.service`

### Шаги сборки standalone

```bash
cd /opt/lab-community/app
npm run build

# Копирование static и public в standalone
cp -r .next/static .next/standalone/.next/static
cp -r public .next/standalone/public

# Запуск
cd .next/standalone
node server.js
# слушает 127.0.0.1:3000
```

### Node 20 LTS

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt -y install nodejs build-essential
```

`build-essential` нужен для компиляции `better-sqlite3`.

### Активация сервиса

```bash
sudo systemctl daemon-reload
sudo systemctl enable lab
sudo systemctl start lab
sudo systemctl reload caddy
```

### Проверка

```bash
curl -I http://127.0.0.1:3000
curl -I https://workisfun.ru/lab
curl -I https://workisfun.ru/lab/apply
systemctl is-active lab
docker ps | grep crisp-dm-caddy
```

## Definition of Done

- [ ] Caddyfile: вариант домен + вариант IP + production `/lab`
- [ ] `lab.service` unit описан
- [ ] Шаги сборки standalone с копированием static/public
- [ ] `data/leads.db` расположение зафиксировано
- [ ] Сервис переживает reboot (`enable`)
- [ ] Отвечает на `127.0.0.1:3000` и `https://workisfun.ru/lab`
