<div align="center">

# 🛍️ Tenhive

**A full-stack e-commerce store with an integrated admin panel — built on Next.js 15, Supabase, and Paystack.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)]()
[![GitHub](https://img.shields.io/badge/Source%20Code-GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/your-username/shopwave)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=flat-square&logo=supabase&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Screenshots](#-screenshots)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Database Setup](#database-setup)
  - [Running the App](#running-the-app)
- [Project Structure](#-project-structure)
- [Technical Challenges](#-technical-challenges)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)
- [Acknowledgements](#-acknowledgements)

---

## 🌟 Overview

Tenhive is a full-stack e-commerce web application featuring a customer-facing storefront and a full-featured admin panel. It supports product browsing, cart management, Paystack-powered checkout, order tracking, user authentication, and transactional emails — all built on Next.js 15 with Supabase as the backend.

---

## ✨ Features

### 🛒 Customer Storefront

- Product listing with search, category filtering, and load-more pagination
- Product detail pages with image gallery, stock status, and ratings
- Persistent cart with quantity controls (survives page refresh via Zustand + localStorage)
- Checkout flow with shipping form and Paystack payment integration
- Order confirmation page with order tracking status
- Authentication — Sign up, Login, Logout, Forgot Password
- User dashboard — order history, order details, and profile settings
- Welcome email on signup and order confirmation email after payment (EmailJS)

### 🔧 Admin Panel

- Dashboard overview with live metrics (total users, orders, revenue)
- User management — view all users, suspend/unsuspend accounts
- Product management — view products, create new products via API
- Order management — view all orders, filter by status, update order status inline

### ⚡ UX & Developer Experience

- Skeleton loading states on all data-heavy pages
- Toast notifications for all user-facing actions
- Empty states with helpful calls-to-action
- Show/hide password toggle on all auth forms
- Fully responsive — mobile, tablet, and desktop

---

## 🛠 Tech Stack

| Layer            | Technology                              |
| ---------------- | --------------------------------------- |
| Framework        | Next.js 15 (App Router)                 |
| Language         | TypeScript                              |
| Styling          | Tailwind CSS                            |
| Backend & Auth   | Supabase (PostgreSQL + Auth)            |
| State Management | Zustand (with localStorage persistence) |
| Form Validation  | React Hook Form + Zod                   |
| Payment          | Paystack (test mode)                    |
| Email            | EmailJS (client-side)                   |
| Deployment       | Vercel                                  |
| Product Data     | DummyJSON API                           |

---

## 📸 Screenshots

![](/public/homepage-screenshot.png)

---

## 🚀 Getting Started

### Prerequisites

Ensure the following are installed and/or available:

- [Node.js](https://nodejs.org/) v18+
- [npm](https://npmjs.com/) v9+
- A [Supabase](https://supabase.com) account (free tier works)
- A [Paystack](https://paystack.com) account (free)
- An [EmailJS](https://emailjs.com) account (free)

---

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/your-username/shopwave.git
cd shopwave
```

**2. Install dependencies**

```bash
npm install
```

---

### Environment Variables

**3. Copy the example environment file**

```bash
cp .env.example .env.local
```

**4. Fill in your values in `.env.local`**

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Paystack
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_your-key

# EmailJS
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_xxxxxxx
NEXT_PUBLIC_EMAILJS_WELCOME_TEMPLATE_ID=template_xxxxxxx
NEXT_PUBLIC_EMAILJS_ORDER_TEMPLATE_ID=template_xxxxxxx
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxx
```

| Variable                                  | Where to Get It                   |
| ----------------------------------------- | --------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`                | Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`           | Supabase → Project Settings → API |
| `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`         | Paystack → Settings → API Keys    |
| `NEXT_PUBLIC_EMAILJS_SERVICE_ID`          | EmailJS → Email Services          |
| `NEXT_PUBLIC_EMAILJS_WELCOME_TEMPLATE_ID` | EmailJS → Email Templates         |
| `NEXT_PUBLIC_EMAILJS_ORDER_TEMPLATE_ID`   | EmailJS → Email Templates         |
| `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`          | EmailJS → Account → General       |

---

### Database Setup

**5. Create a Supabase project** at [supabase.com](https://supabase.com), then navigate to **SQL Editor → New Query** and run the following schema:

```sql
-- Profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  address TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  is_suspended BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (
    status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')
  ),
  total_amount NUMERIC(10, 2) NOT NULL,
  payment_reference TEXT,
  payment_status TEXT NOT NULL DEFAULT 'unpaid' CHECK (
    payment_status IN ('unpaid', 'paid', 'refunded')
  ),
  shipping_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Order items table
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_id INTEGER NOT NULL,
  product_title TEXT NOT NULL,
  product_image TEXT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

**6. Grant yourself admin access** (after signing up via the app):

```sql
UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';
```

---

### Running the App

**7. Start the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
Tenhive/
├── src/
│   ├── app/
│   │   ├── (auth)/              # Auth pages — login, signup, forgot-password
│   │   ├── (store)/             # Customer storefront
│   │   │   ├── page.tsx         # Homepage
│   │   │   ├── products/        # Product listing & detail pages
│   │   │   ├── cart/            # Cart page
│   │   │   ├── checkout/        # Checkout flow & success page
│   │   │   └── dashboard/       # User dashboard
│   │   └── (admin)/             # Admin panel
│   │       └── admin/
│   │           ├── page.tsx     # Overview / metrics
│   │           ├── users/       # User management
│   │           ├── products/    # Product management
│   │           └── orders/      # Order management
│   ├── components/
│   │   ├── ui/                  # Reusable UI components
│   │   └── layout/              # Navbar, Footer
│   ├── hooks/                   # Custom React hooks
│   ├── lib/
│   │   ├── supabase/            # Supabase clients (browser + server)
│   │   └── emailjs/             # EmailJS sending functions
│   ├── store/                   # Zustand state stores
│   ├── types/                   # TypeScript type definitions
│   └── utils/                   # Helper functions (formatting, validation)
├── .env.example                 # Environment variable template
└── README.md
```

---

## 🧩 Technical Challenges

### Keeping Cart State Consistent Across Auth Boundaries

**The problem:** When a guest user adds items to the cart and then signs in, the cart state needed to persist seamlessly without duplicating items or resetting to empty. Because the cart is managed client-side with Zustand and persisted to `localStorage`, there was a mismatch window between when the auth session hydrated on the client and when the Zustand store rehydrated from storage — causing brief cart flickers and, in some cases, a full cart wipe on login redirect.

**The solution:** A custom `useCartHydration` hook was added to explicitly control rehydration order. It listens for Supabase's `onAuthStateChange` event and only triggers the Zustand `persist` rehydration call _after_ the auth state is confirmed. On login, the hook merges any pre-login guest cart items with the user's existing cart (summing quantities for duplicate products) before committing the final state to the store. This ensures the cart is always correct regardless of whether the user was already signed in, signs in mid-session, or refreshes the page at any point in the flow.

```ts
// hooks/useCartHydration.ts (simplified)
useEffect(() => {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === "SIGNED_IN") {
      const guestItems = useCartStore.getState().items;
      await useCartStore.persist.rehydrate();
      const persistedItems = useCartStore.getState().items;
      useCartStore.getState().mergeItems(guestItems, persistedItems);
    }
    if (event === "SIGNED_OUT") {
      useCartStore.getState().clearCart();
    }
  });
  return () => subscription.unsubscribe();
}, []);
```

---

## 🧪 Testing

### Paystack Test Card

Use the following details on the Paystack checkout (test mode only):

| Field       | Value                 |
| ----------- | --------------------- |
| Card Number | `4084 0840 8408 4081` |
| CVV         | `408`                 |
| Expiry      | Any future date       |
| PIN         | `0000`                |
| OTP         | `123456`              |

---

## 🌐 Deployment

This project is optimised for deployment on **Vercel**.

**Steps:**

1. Push your repository to GitHub.
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import your repo.
3. Add all environment variables from `.env.local` under **Project Settings → Environment Variables**.
4. Click **Deploy**.

Vercel will automatically handle builds and deployments on every push to `main`.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

Please follow the [Conventional Commits](https://www.conventionalcommits.org/) standard for commit messages.

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgements

- [DummyJSON](https://dummyjson.com) — Mock product data API
- [Supabase](https://supabase.com) — Backend-as-a-service and authentication
- [Paystack](https://paystack.com) — Payment processing for African markets
- [EmailJS](https://emailjs.com) — Client-side transactional email
- [Vercel](https://vercel.com) — Deployment and hosting

---

<div align="center">
  <sub>Built with ❤️ using Next.js and Supabase</sub>
</div>
