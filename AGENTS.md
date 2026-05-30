# AGENTS.md — Treehouse Trips

Instructions for AI coding agents working in this repository. For public site context aimed at travel/booking LLMs, see `/public/llms.txt` (served at `/llms.txt`).

## Project overview

Next.js 14 App Router marketplace for curated treehouse rentals. Travelers browse `/properties`; hosts onboard at `/create` and manage listings in `/dashboard`. Firebase Auth + Firestore + Storage; Stripe for host subscriptions.

## Commands

```bash
npm run dev      # local dev server
npm run build    # production build (run before PRs)
npm run start    # serve production build
npm run lint     # ESLint
```

## Environment

Copy `env.example` → `.env.local`. Required for full flows:

- `NEXT_PUBLIC_FIREBASE_*` — Firebase client
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_BASE_URL` — canonical URL for Stripe redirects, sitemap, robots (e.g. `https://treehousetrips.com`)

Optional: `STRIPE_SUBSCRIPTION_PRICE_ID`, `STRIPE_CHECKOUT_LOGO_URL`.

Never commit `.env.local` or secrets.

## Code conventions

- **UI:** Cream/forest palette, `font-serif` (Playfair) for headings, Inter for body. Shared tokens in `lib/app-ui.ts`.
- **Paths:** `@/` alias to project root.
- **Firestore writes:** Use `stripUndefined` and `PROPERTY_WRITE_KEYS` / `sanitizePropertyForWrite` in `lib/firestore.ts`.
- **Minimal diffs:** Match existing patterns; avoid unrelated refactors.

## Key directories

| Area | Location |
|------|----------|
| App routes | `app/` |
| UI components | `components/`, `components/home/`, `components/host/`, `components/properties/` |
| Firebase / data | `lib/firebase.ts`, `lib/firestore.ts`, `lib/auth.ts` |
| Stripe | `lib/stripe-server.ts`, `lib/stripe-host-checkout-session.ts`, `app/api/create-checkout-session/` |
| Demo listings JSON | `data/properties.json` |
| Site discovery | `public/llms.txt`, `app/robots.ts`, `app/sitemap.ts` |

## Auth & privacy

- Google and email sign-in via `lib/auth.ts` and `contexts/AuthContext.tsx`.
- Host contact email/phone: only when `showContactEmail` / `showContactPhone` and user is signed in (`lib/host-contact-visibility.ts`).
- `createUser` uses Firestore doc id = Firebase Auth `uid`.

## Testing changes

1. `npm run build` must pass.
2. Manually verify affected routes in dev (`npm run dev`).
3. Do not push or commit unless the user asks.

## Boundaries

- Do not change git config or force-push `main`/`master`.
- Do not add dependencies without a clear need.
- Property detail for live Firestore listings may still fall back to `data/properties.json` for static demo slugs — check `app/properties/[id]/page.tsx` when changing listing data flow.
