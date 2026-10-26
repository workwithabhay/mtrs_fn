# Review Management SaaS — Next.js Frontend

A modern, production-oriented multi-tenant SaaS frontend built with Next.js App Router, TypeScript, and Tailwind CSS.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (App Router)
- **UI & Runtime**: React 19 with React Server Components (RSC) by default
- **Language**: TypeScript with strict mode enabled
- **Styling**: Tailwind CSS v4 with unified design tokens
- **Icons**: Lucide React
- **Testing**: Vitest, React Testing Library, and jsdom
- **Typography**: Inter / Google Sans accessible fallback stack

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js >= 20 (tested with v26.9.0)
- npm >= 10 (tested with v11.19.1)

### 2. Environment Configuration
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Configured default:
```env
NEXT_PUBLIC_API_URL=http://localhost:5050/api/v1
```

> **IMPORTANT**: Variables prefixed with `NEXT_PUBLIC_` are exposed in browser JavaScript. Never store database credentials, private API keys, or session secrets in this file.

### 3. Development Server
Run the local Next.js development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Available Scripts

| Script | Purpose |
| :--- | :--- |
| `npm run dev` | Starts Next.js development server on port 3000 |
| `npm run build` | Compiles an optimized production build |
| `npm run start` | Starts the production server |
| `npm run lint` | Runs ESLint for code standard enforcement |
| `npm run typecheck` | Runs `tsc --noEmit` to verify TypeScript strict types |
| `npm run test` | Executes unit and component tests with Vitest |
| `npm run test:watch` | Runs Vitest in interactive watch mode |
| `npm run verify:backend` | Executes an isolated health probe against the running Express backend |

---

## 🏥 Backend Connectivity Probe

To verify connectivity with the Express backend:
```bash
npm run verify:backend
```
- Checks `GET http://localhost:5050/api/health`.
- Gracefully reports standby status if the backend is not running locally.
