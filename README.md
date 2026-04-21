# EcoSpark Hub — Frontend

A sustainability community portal where members share, discover and vote on eco-friendly ideas.

## 🌿 Live Demo

- **Frontend**: https://ecospark-frontend-gules.vercel.app
- **Backend**: https://ecospark-backend.onrender.com

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn UI
- **State**: Zustand
- **Data Fetching**: TanStack Query
- **Forms**: React Hook Form + Zod
- **Payment**: Stripe
- **Auth**: JWT (via cookies)

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/ecospark-frontend.git
cd ecospark-frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxx
```

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── (auth)/           # Login, Register
│   ├── (main)/           # Home, Ideas, About
│   └── dashboard/        # Member + Admin dashboards
├── components/           # Reusable components
│   ├── ui/               # Shadcn components
│   ├── layout/           # Navbar, Footer, Sidebars
│   ├── idea/             # Idea related components
│   ├── comment/          # Comment components
│   ├── vote/             # Vote buttons
│   ├── payment/          # Payment components
│   ├── dashboard/        # Dashboard components
│   └── shared/           # Shared utilities
├── services/             # API service functions
├── store/                # Zustand stores
├── hooks/                # Custom hooks
├── types/                # TypeScript types
├── constants/            # App constants
├── lib/                  # Axios, utils, queryClient
└── middleware.ts         # Auth + role guard
```

## 🔐 Test Credentials

```
Admin   → admin@ecospark.com   / admin123456
Member  → member@ecospark.com  / member123456
```

## 💳 Stripe Test Card

```
Card    : 4242 4242 4242 4242
Expiry  : 12/34
CVC     : 123
```

## 📄 Pages

| Route | Description | Access |
|-------|-------------|--------|
| `/` | Home page | Public |
| `/ideas` | All approved ideas | Public |
| `/ideas/[id]` | Idea details | Public/Paid |
| `/about` | About page | Public |
| `/login` | Login | Guest |
| `/register` | Register | Guest |
| `/dashboard/member` | Member overview | Member |
| `/dashboard/member/ideas` | My ideas | Member |
| `/dashboard/member/ideas/create` | Create idea | Member |
| `/dashboard/member/payments` | My payments | Member |
| `/dashboard/member/profile` | Profile | Member |
| `/dashboard/admin` | Admin overview | Admin |
| `/dashboard/admin/users` | Manage users | Admin |
| `/dashboard/admin/ideas` | Manage ideas | Admin |
| `/dashboard/admin/categories` | Categories | Admin |
| `/dashboard/admin/payments` | Payments | Admin |
| `/dashboard/admin/newsletter` | Newsletter | Admin |
