---
title: "Elias569/fintech-dashboard"
owner: "Elias569"
name: "fintech-dashboard"
fullName: "Elias569/fintech-dashboard"
description: "fintech dashboard for personal finance management which track income and expenses, leverage AI-powered analytics, manage budgets and financial goals, enjoy a dark theme"
sourceUrl: "https://github.com/Elias569/fintech-dashboard"
stars: 135
forks: 0
language: "TypeScript"
topics: ["ai-dashboard", "dashboard", "fintech", "fintech-ai", "fintech-dashboard"]
license: "未标注"
homepage: "https://fintech-dashboard-six.vercel.app/"
defaultBranch: "main"
snapshotDate: "2026-09-27"
pushedAt: "2026-09-14T07:58:00Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# FinTech Dashboard

**Личный финансовый кабинет с AI-аналитикой и полной адаптивностью.**

*图片：Next.js*
*图片：React*
*图片：TypeScript*
*图片：Prisma*
*图片：Turso*
*图片：Tailwind CSS*
*图片：OpenRouter*
*图片：License*
*图片：Vercel*

---

> **🌐 Деплой:** [fintech-dashboard-six.vercel.app](https://fintech-dashboard-six.vercel.app/)

## Оглавление

- Описание проекта
- Основные возможности
- Архитектура проекта
- Технологии
- Требования к окружению
- Установка и настройка
- Переменные окружения
- Запуск AI-ассистента
- Тестирование
- Деплой
- Безопасность
- Roadmap

---

## Описание проекта

### Проблема

Управление личными финансами — хаос: куча чеков, разрозненные заметки, отсутствие аналитики. Сложно понять, куда уходят деньги и как оптимизировать бюджет.

### Решение

FinTech Dashboard — единое окно для учёта финансов с AI-помощником. Спросите ассистента — он проанализирует ваши траты и даст совет. Всё работает бесплатно, на русском языке, на компьютере и телефоне.

---

## Основные возможности

- **📊 Дашборд** — баланс, доходы/расходы, KPI, графики, тренды
- **💬 AI-ассистент** — floating-чат, анализирует ваши транзакции, даёт советы (OpenRouter)
- **🖼️ Распознавание чеков** *(планируется)* — AI будет заполнять форму по фото чека
- **💡 AI-инсайты** — автоматические рекомендации по оптимизации бюджета
- **📋 Управление транзакциями** — CRUD, фильтры, поиск, сортировка
- **💰 Бюджеты** — установите лимиты по категориям, контроль перерасхода
- **🎯 Цели** — отслеживание финансовых целей
- **📈 Мониторинг** — cash flow, норма сбережения, долговая безопасность
- **📤 Экспорт** — CSV и PDF
- **🌙 Тёмная тема** — переключение светлой/тёмной темы
- **📱 PWA** — установка на телефон как приложение
- **🔐 Авторизация** — GitHub OAuth + демо-вход по email

---

## Архитектура проекта

```
┌────────────────────────────────────────────────────┐
│              Frontend (Next.js)                    │
│  ┌──────────┐  ┌──────────┐                        │
│  │ Dashboard│  │ AI Chat  │                        │
│  │ (виджеты)│  │(floating)│                        │
│  └────┬─────┘  └────┬─────┘                        │
│       │             │                              │
│  ┌────▼─────────────▼──────────────────────────┐   │
│  │           API Routes (Next.js)              │   │
│  │  /api/chat  /api/insights                   │   │
│  │  /api/transactions  /api/budgets  /api/auth │   │
│  └────────────────────┬────────────────────────┘   │
└───────────────────────┼────────────────────────────┘
                        │
┌───────────────────────▼──────────────────────────────┐
│              OpenRouter API (облако)                 │
│  ┌──────────────────────────────────────────────┐    │ 
│  │  Chat/Insights: ling-2.6-1t                  │    │
│  └──────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────┘
                        │
┌───────────────────────▼──────────────────────────────┐
│              Turso (libSQL, облачная SQLite)         │
│  ┌────────────────────────────────────────────────┐  │
│  │  Prisma ORM + @prisma/adapter-libsql           │  │
│  │  fintech-db-lina-whm (Frankfurt)               │  │
│  └────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
```

### Ключевые модули

| Модуль | Путь | Описание |
|--------|------|----------|
| **Виджеты** | `widgets/` | Dashboard, AI-чат, графики, таблицы |
| **Фичи** | `features/` | Транзакции, бюджеты, фильтры, цели, мониторинг |
| **Сущности** | `entities/` | Модели, API-запросы, типы транзакций |
| **Shared** | `shared/` | UI-компоненты (shadcn/ui), утилиты |
| **API Routes** | `app/api/` | Эндпоинты чата, транзакций, авторизации |

---

## Технологии

### Frontend
- **Next.js 15.5** (App Router) — фреймворк
- **React 19** — UI
- **TypeScript 5.6** — типизация
- **Tailwind CSS 3.4** — стилизация
- **shadcn/ui** (Radix UI) — компоненты
- **TanStack React Query** — управление состоянием сервера
- **Zustand** — клиентское состояние
- **React Hook Form** + **Zod** — формы и валидация
- **Recharts** — графики
- **Lucide React** — иконки

### Backend
- **Next.js API Routes** — серверные эндпоинты
- **Prisma 6** — ORM
- **Turso (libSQL)** — облачная SQLite (бесплатно, 9 ГБ)
- **NextAuth v5** — аутентификация (GitHub OAuth + Credentials)

### AI
- **OpenRouter API** — облачные AI-модели
  - `inclusionai/ling-2.6-1t:free` — чат и инсайты

### Тестирование
- **Vitest** — unit-тесты
- **Playwright** — E2E-тесты
- **Testing Library** — тестирование React-компонентов

### Инфраструктура
- **Docker** — контейнеризация (опционально)
- **GitHub Actions** — CI/CD
- **Gitleaks** — сканирование секретов

---

## Требования к окружению

- **Node.js** 18+ (рекомендуется 20+)
- **npm** 9+ (или yarn/pnpm)
- **Git** — для клонирования репозитория
- **Turso CLI** (опционально) — для управления облачной БД

> База данных — **Turso (libSQL)**, облачная SQLite. Регистрация через GitHub, бесплатно до 9 ГБ. Не требует локального PostgreSQL.

---

## Установка и настройка

### 1. Клонирование

```bash
git clone https://github.com/davi12399/fintech-dashboard.git
cd fintech-dashboard
```

### 2. Установка зависимостей

```bash
npm install
```

### 3. Переменные окружения

Скопируйте `.env.example` в `.env.local` и заполните:

```bash
cp .env.example .env.local
```

Подробнее — в разделе Переменные окружения.

### 4. Генерация Prisma Client

```bash
npx prisma generate
```

### 5. Настройка базы данных (Turso)

1. Зарегистрируйтесь на [turso.tech](https://turso.tech) через GitHub
2. Создайте базу данных:
   ```bash
   turso db create fintech-db
   ```
3. Получите URL и токен:
   ```bash
   turso db show fintech-db --url
   turso db tokens create fintech-db
   ```
4. Добавьте в `.env.local`:
   ```env
   DATABASE_URL="libsql://[ваша-база].turso.io"
   TURSO_AUTH_TOKEN="[ваш-токен]"
   ```

### 6. Запуск

```bash
npm run dev
```

Откройте http://localhost:3000.

---

## Переменные окружения

Создайте файл `.env.local` в корне проекта:

```env
# === База данных (Turso / libSQL) ===
DATABASE_URL="libsql://[ваша-база].turso.io"
TURSO_AUTH_TOKEN="[ваш-токен]"

# === NextAuth ===
NEXTAUTH_SECRET="[ВАШ_SECRET_МИНИМУМ_32_СИМВОЛА]"
NEXTAUTH_URL="http://localhost:3000"

# === GitHub OAuth (опционально) ===
GITHUB_CLIENT_ID="[ВАШ_GITHUB_CLIENT_ID]"
GITHUB_CLIENT_SECRET="[ВАШ_GITHUB_CLIENT_SECRET]"

# === OpenRouter (AI) ===
OPENROUTER_API_KEY="sk-or-v1-[ВАШ_OPENROUTER_КЛЮЧ]"
OPENROUTER_MODEL="inclusionai/ling-2.6-1t:free"

# === Redis (опционально) ===
# Общий rate limit и кэш AI-ответов между инстансами приложения.
# Без Redis используется in-process лимитер (достаточно для одного процесса).
REDIS_URL="redis://localhost:6379"
```

### Redis

Redis опционален. При наличии `REDIS_URL`:

- **Rate limiting** — `/api/chat`, `/api/insights`, `/api/weekly-report` делят лимиты по IP между всеми инстансами Next.js.
- **Кэш AI** — инсайты и еженедельный отчёт кэшируются на 5–10 минут; версия данных сбрасывается при изменении транзакций.
- **Docker Compose** — сервис `redis` уже включён; приложение получает `REDIS_URL=redis://redis:6379`.

Локально:

```bash
docker run -d --name fintech-redis -p 6379:6379 redis:7-alpine
```

> **Важно:** Никогда не коммитьте `.env.local` в репозиторий. Он уже добавлен в `.gitignore`.

---

## Запуск AI-ассистента

AI-ассистент использует **OpenRouter API** — облачные модели, доступные бесплатно.

### Получение ключа OpenRouter

1. Зарегистрируйтесь на [openrouter.ai/keys](https://openrouter.ai/keys)
2. Создайте API-ключ (бесплатные модели имеют лимит запросов в день)
3. Добавьте ключ в `.env.local`:

```env
OPENROUTER_API_KEY=sk-or-v1-[ВАШ_КЛЮЧ]
```

### Модели

| Функция | Модель | Тип |
|---------|--------|-----|
| AI-чат | `inclusionai/ling-2.6-1t:free` | Текст |
| AI-инсайты | `inclusionai/ling-2.6-1t:free` | Текст |

### Floating AI-чат

AI-чат отображается как плавающая кнопка в правом нижнем углу. Нажмите на неё — откроется окно чата. На мобильных устройствах чат открывается на весь экран. На странице входа чат автоматически скрывается.

---

## Тестирование

### Unit-тесты (Vitest)

```bash
# Запустить все unit-тесты
npm test

# Запустить с детальным выводом
npx vitest run --reporter=verbose

# Режим watch
npx vitest
```

**Покрытие тестами:**

| Модуль | Файл | Тестов |
|--------|------|--------|
| TransactionService | `tests/unit/transaction-service.test.ts` | 16 |
| Finance utils | `tests/unit/finance.test.ts` | 11 |
| AI utils | `tests/unit/ai.test.ts` | 11 |
| Transaction service | `tests/unit/transaction.service.test.ts` | 4 |
| **Всего** | | **42** |

### E2E-тесты (Playwright)

```bash
# Запустить E2E-тесты (требуется запущенный dev-сервер)
npm run test:e2e
```

---

## Деплой

### Vercel (рекомендуется)

Проект задеплоен на **Vercel**: [fintech-dashboard-six.vercel.app](https://fintech-dashboard-six.vercel.app)

При пуше в ветку `main` деплой происходит автоматически через Vercel Git Integration.

**Настройка вручную:**

[*图片：Deploy with Vercel*](https://vercel.com/new)

1. Подключите GitHub-репозиторий
2. Добавьте переменные окружения (см. Переменные окружения)
3. Укажите `DATABASE_URL` и `TURSO_AUTH_TOKEN` от Turso
4. Деплой

> **Важно:** На Vercel не требуется `prisma db push` или `prisma migrate` — Prisma Client генерируется на этапе сборки, а Turso работает через `@prisma/adapter-libsql`.

### Docker

```bash
docker-compose up -d --build
```

---

## Безопасность

- **Gitleaks** — pre-commit hook и CI-проверка на утечку секретов
- `.env.local` — добавлен в `.gitignore`
- Все чувствительные данные в README заменены на заглушки `[ВАШ_ЗНАЧЕНИЕ]`
- **GitHub OAuth Secret** — отозван и перевыпущен при обнаружении утечки
- **История git** — очищена от секретов через `git filter-repo`
- **CI** — запускает Gitleaks на каждый push, блокирует коммиты с утечками

---

## Roadmap

- [x] AI-чат с историей диалога
- [x] Floating AI-чат (сворачиваемый виджет)
- [x] Экспорт в PDF
- [x] PWA (установка на телефон)
- [ ] Распознавание чеков через AI (Vision)
- [ ] Множественные счета/кошельки
- [ ] Импорт банковских выписок (CSV/OFX)
- [ ] Уведомления о превышении бюджета
- [ ] Семейный доступ (общие бюджеты)
- [ ] Локализация (EN)
