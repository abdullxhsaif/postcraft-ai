# PostCraft AI

🔗 **Live demo: https://postcraft-ai-zqr3.vercel.app**

Turn rough notes into viral LinkedIn posts with AI. React + Vite + Tailwind frontend, Firebase Auth/Firestore, Stripe subscriptions, and serverless functions on Vercel.

## Stack
- **Frontend:** React 18, Vite, Tailwind CSS, React Router, react-hot-toast
- **Auth + DB:** Firebase Authentication + Cloud Firestore (free Spark plan)
- **Payments:** Stripe Checkout + Billing Portal + Webhooks
- **AI:** Google Gemini (`gemini-2.0-flash`, free tier) via a secure serverless proxy — the key never reaches the browser
- **Hosting:** Vercel (static frontend + `/api` serverless functions)

## Architecture
```
Browser ──> Firebase Auth (sign in / sign up)
        ──> /api/generate                 (verifies Firebase token, enforces credits, calls OpenAI)
        ──> /api/create-checkout-session  (Stripe Checkout)
        ──> /api/create-portal-session    (Stripe Billing Portal)
Stripe  ──> /api/webhook                  (updates plan/subscription in Firestore)
```
All secret keys live in server-only env vars. Subscription state is the source of truth in Firestore, written only by the Admin SDK.

## Setup

### 1. Install
```bash
npm install
cp .env.example .env   # then fill in values
```

### 2. Firebase (free)
1. Create a project at https://console.firebase.google.com
2. Enable **Authentication → Email/Password**
3. Create a **Firestore** database (production mode) and paste `firestore.rules`
4. Project settings → general → copy the web config into the `VITE_FIREBASE_*` vars
5. Project settings → service accounts → **Generate new private key**. Paste the whole JSON (as one line) into `FIREBASE_SERVICE_ACCOUNT`

### 3. Stripe
1. Create 4 recurring prices (Pro monthly/yearly, Team monthly/yearly) → put their IDs in the `VITE_STRIPE_PRICE_*` vars
2. Copy your publishable + secret keys
3. After deploy, add a webhook endpoint `https://YOUR_DOMAIN/api/webhook` for events: `checkout.session.completed`, `customer.subscription.created/updated/deleted` → copy the signing secret into `STRIPE_WEBHOOK_SECRET`

### 4. Google Gemini (free)
Get a free key at https://aistudio.google.com/apikey and add it to `GEMINI_API_KEY`.

### 5. Run / deploy
```bash
npm run dev      # local (serverless /api needs `vercel dev`)
vercel           # deploy
```
Add every variable from `.env.example` in **Vercel → Project → Settings → Environment Variables**.

## Plans
| Plan | Price | AI posts | Tones |
|------|-------|----------|-------|
| Free | $0 | 5 / month | 2 |
| Pro | $19/mo | Unlimited | All 6 |
| Team | $49/mo | Unlimited | All 6 + 5 seats |

## Roadmap
- Post history + saved drafts (Firestore)
- Multiple variations per generation
- Scheduled posting via LinkedIn API
- Team workspaces & brand voice
