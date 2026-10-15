---
title: "imchine/FinTech-Solution"
owner: "imchine"
name: "FinTech-Solution"
fullName: "imchine/FinTech-Solution"
description: "FinTech AI Solution for SMEs to calculate financial values"
sourceUrl: "https://github.com/imchine/FinTech-Solution"
stars: 133
forks: 941
language: "TypeScript"
topics: ["ai-solution", "fintech", "fintech-ai", "fintech-solution", "solution"]
license: "未标注"
defaultBranch: "main"
snapshotDate: "2026-09-27"
pushedAt: "2026-09-14T07:58:09Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# FinSight AI — AI Financial Assistant for SMEs

> Production-grade SaaS financial intelligence platform powered by GPT-4o, Next.js 15, and PostgreSQL.

[*图片：Next.js*](https://nextjs.org)
[*图片：TypeScript*](https://typescriptlang.org)
[*图片：PostgreSQL*](https://postgresql.org)
[*图片：Clerk*](https://clerk.com)
[*图片：OpenAI*](https://openai.com)

---

## 🚀 Features

### Core Modules
| Module | Description |
|--------|-------------|
| **Financial Dashboard** | Real-time revenue, expenses, profit, invoice metrics |
| **Invoice Management** | Create, send, track, record payments |
| **Expense Tracking** | Manual entry, CSV import, categorization |
| **Transaction Ledger** | Full double-entry transaction history |
| **Bank Statement Analyzer** | Upload PDF/CSV, extract & categorize transactions |
| **AI Financial Assistant** | RAG-based chatbot with real financial data context |
| **AI Insights Engine** | Auto-detected anomalies, risks, opportunities |
| **Cash Flow Forecasting** | Deterministic 3-month linear trend forecasts |
| **Financial Reports** | P&L, Expense Summary, Revenue Trends (PDF/Excel) |
| **Settings & Security** | RBAC, audit logs, MFA, organization management |

### Critical Design Principle
> **AI NEVER calculates financial values.** All calculations are deterministic and performed by the backend using Prisma queries. AI only generates explanations, insights, and narratives based on the pre-calculated data.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Next.js 15 App Router                 │
├──────────────────────┬──────────────────────────────────┤
│   Frontend (RSC)     │        API Routes                 │
│  - Dashboard         │  - /api/dashboard                 │
│  - Invoices          │  - /api/invoices                  │
│  - Expenses          │  - /api/expenses                  │
│  - AI Assistant      │  - /api/ai/chat (SSE streaming)   │
│  - Cash Flow         │  - /api/cash-flow                 │
│  - Reports           │  - /api/reports                   │
│  - Insights          │  - /api/insights                  │
└──────────────────────┴──────────────────────────────────┘
           │                          │
    Clerk Auth                  Prisma ORM
           │                          │
    PostgreSQL DB              OpenAI GPT-4o
           │                          │
    Qdrant Vector DB         RAG Pipeline
```

### RAG Pipeline
```
User Question
→ Intent Classification (GPT-4o-mini)
→ Data Retrieval (Prisma queries = REAL numbers)
→ Context Assembly
→ OpenAI GPT-4o Response Generation
→ Streaming SSE to Frontend
```

---

## 📋 Tech Stack

**Frontend**
- Next.js 15 (App Router, RSC, Streaming)
- TypeScript 5
- Tailwind CSS + ShadCN UI components
- Recharts (interactive financial charts)
- React Query (server state management)
- Zustand (client state)

**Backend**
- Next.js API Routes
- Prisma ORM with PostgreSQL
- Zod validation (all inputs)
- Rate limiting via Redis when `REDIS_URL` is set (in-process fallback otherwise)
- Redis-backed dashboard metrics cache with version invalidation on writes

**AI**
- OpenAI GPT-4o (assistant responses)
- OpenAI text-embedding-3-small (embeddings)
- RAG architecture for financial context
- Qdrant vector database

**Auth & Security**
- Clerk Authentication (OAuth, MFA, RBAC)
- OWASP Top 10 compliant
- CSRF protection in middleware
- SQL injection prevention (Prisma parameterized queries)
- Complete audit logging

---

## 🗄️ Database Schema

```
Organizations ──┬── OrganizationMembers ── Users
                ├── Clients
                ├── Vendors
                ├── Categories
                ├── Transactions ── Categories
                ├── Invoices ─────┬── InvoiceItems
                │                 └── Payments
                ├── Expenses ── Categories
                ├── BankStatements ── Transactions
                ├── Reports
                ├── AIChats ── AIChatMessages
                ├── Insights
                ├── CashFlowForecasts
                ├── Notifications
                ├── AuditLogs
                └── Anomalies
```

---

## 🔒 Security Implementation

| Security Layer | Implementation |
|----------------|---------------|
| Authentication | Clerk JWT + MFA |
| Authorization | RBAC (Admin/Accountant/Employee/Viewer) |
| CSRF Protection | Origin/Host validation in middleware |
| Rate Limiting | Per-IP sliding window (100 req/min default) |
| Input Validation | Zod schemas on all API endpoints |
| SQL Injection | Prisma ORM parameterized queries |
| XSS Prevention | Next.js built-in + CSP headers |
| Audit Logging | All CRUD operations logged with user/IP |
| Sensitive Data | Prisma field-level encryption ready |
| File Upload | Type validation, size limits, S3 signed URLs |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 16+
- OpenAI API key
- Clerk account

### 1. Clone & Install
```bash
git clone https://github.com/imchine/FinTech-Solution.git
cd finsight-ai
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env.local
# Fill in your API keys
```

### 3. Database Setup
```bash
# Apply schema
npx prisma migrate dev --name init

# Generate client
npx prisma generate
```

### 4. Run Development
```bash
npm run dev
# Open http://localhost:3000
```

### 5. Docker (Full Stack)
```bash
docker-compose up -d
```

### Redis (optional)

Redis is optional but recommended for production and multi-instance deployments.

```bash
docker compose up -d redis
# set in .env.local:
REDIS_URL=redis://localhost:6379
```

When `REDIS_URL` is set:

- **Rate limiting** — shared across API routes (`/api/transactions`, `/api/invoices`, `/api/ai/chat`, etc.)
- **Dashboard cache** — metrics cached for 2 minutes; invalidated when transactions, expenses, or invoices change
- **Health check** — `GET /api/health` reports whether Redis is configured

Without Redis, rate limits and dashboard metrics use in-process behaviour only.

---

## 📁 Folder Structure

```
finsight-ai/
├── src/
│   ├── app/
│   │   ├── (auth)/          # Sign in/up pages (Clerk)
│   │   ├── (dashboard)/     # All protected dashboard pages
│   │   │   ├── dashboard/   # Main financial dashboard
│   │   │   ├── invoices/    # Invoice management
│   │   │   ├── expenses/    # Expense tracking
│   │   │   ├── transactions/# Transaction ledger
│   │   │   ├── ai-assistant/# AI chatbot interface
│   │   │   ├── cash-flow/   # Cash flow & forecasting
│   │   │   ├── insights/    # AI insights engine
│   │   │   ├── reports/     # Financial reports
│   │   │   ├── bank-statements/ # Bank statement analyzer
│   │   │   └── settings/    # Account & org settings
│   │   └── api/             # All API routes
│   ├── components/
│   │   ├── ui/              # ShadCN UI components
│   │   ├── charts/          # Recharts wrappers
│   │   ├── dashboard/       # Dashboard-specific components
│   │   ├── layout/          # Sidebar, Header
│   │   └── shared/          # Providers, theme
│   ├── lib/
│   │   ├── prisma.ts        # Database client
│   │   ├── auth.ts          # Auth helpers & audit logging
│   │   ├── openai.ts        # AI integration & RAG
│   │   ├── financial-calculations.ts  # ALL financial math
│   │   ├── validations.ts   # Zod schemas
│   │   ├── rate-limit.ts    # API rate limiting
│   │   └── utils.ts         # Utilities & formatters
│   ├── middleware.ts         # Auth & security middleware
│   └── types/               # TypeScript types
├── prisma/
│   └── schema.prisma        # Complete DB schema
├── docker-compose.yml       # Full stack Docker setup
├── Dockerfile               # Production container
└── .env.example             # Environment template
```

---

## 📊 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/dashboard` | Dashboard metrics |
| GET | `/api/dashboard/trends` | Monthly trends |
| GET | `/api/dashboard/categories` | Expense categories |
| GET/POST | `/api/invoices` | List/create invoices |
| GET/PATCH/DELETE | `/api/invoices/[id]` | Invoice operations |
| GET/POST | `/api/expenses` | List/create expenses |
| GET/POST | `/api/transactions` | List/create transactions |
| POST | `/api/ai/chat` | AI chat (SSE streaming) |
| GET | `/api/ai/chat` | Chat history |
| GET | `/api/cash-flow` | Historical + forecasts |
| GET/POST | `/api/reports` | Report management |
| GET | `/api/insights` | AI insights |

---

## 🚢 Deployment

### Vercel (Frontend)
```bash
vercel deploy --prod
```

### Environment Variables (Production)
Set all variables from `.env.example` in your deployment platform.

### Database Migration (Production)
```bash
npx prisma migrate deploy
```

---

## 🧪 Testing Strategy

- **Unit Tests**: Financial calculation functions (Jest)
- **Integration Tests**: API routes with Prisma mocks
- **E2E Tests**: Playwright for critical user flows
- **Security Tests**: OWASP ZAP scanning
- **Load Tests**: k6 for API performance

---

## 📈 Performance

- Server-side rendering for initial dashboard load
- React Query caching (60s stale time)
- Optimized Prisma queries with proper indexes
- Streaming AI responses (SSE)
- Image optimization via Next.js
- Lazy loading of chart components

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes with tests
4. Submit a PR

---

## 📄 License

MIT License — see LICENSE file.

---

**Built with ❤️ for SMEs worldwide**
