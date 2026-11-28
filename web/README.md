# WDYLT web

The marketing site and waitlist for What Did You Learn Today, built with Next.js.
It shares the Convex backend in `../convex` with the Expo app, so waitlist
sign-ups land in the same database the app will use.

This folder is a separate npm project on purpose: it has its own
`package.json` and lockfile, so it installs, builds and deploys on its own
without pulling in the Expo app's dependencies. Later, the full Next.js web
app can grow here too.

## Run it locally

1. Set up Convex once, from the **repo root** (this signs you in and creates a
   dev deployment, then keeps it in sync while it runs):

   ```bash
   npm install
   npx convex dev
   ```

   It writes `EXPO_PUBLIC_CONVEX_URL` to the root `.env.local` and pushes
   `convex/schema.ts` and `convex/waitlist.ts`.

2. In a second terminal, start the site:

   ```bash
   cd web
   cp .env.example .env.local   # then paste your Convex URL as CONVEX_URL
   npm install
   npm run dev
   ```

3. Open http://localhost:3000, sign up with an email, and check the
   `waitlist` table in the Convex dashboard (`npx convex dashboard`).

## Deploying

Any Next.js host works. On Vercel, set the project's root directory to `web`
and add `CONVEX_URL` (your production deployment URL) as an environment
variable. Deploy the Convex functions to production with `npx convex deploy`
from the repo root.

## Where things are

- `app/page.tsx`: the page copy and sections
- `app/globals.css`: the Vermilion Block styles; Paper (light) colours at the
  top, Ink (dark) colours right under them, then the type scale, spacing
  scale and the no-bounce spring curve (`--spring`) every animation uses.
  Motion, type and fallbacks follow the Apple design guide: press feedback
  on pointer-down, only transform and opacity animate, and there are
  reduced-motion, reduced-transparency and high-contrast versions
- `components/masthead-edge.tsx`: shows the header's soft bottom edge once
  the page scrolls under it
- `components/theme-toggle.tsx` and `lib/theme.ts`: the Paper/Ink toggle;
  `app/layout.tsx` applies a stored choice before the page draws
- `components/typed-hero.tsx`: the typed headline and sample learnings
- `components/stack-demo.tsx`: the streak shown as a stack of books
- `components/wordmark.tsx`: the Signature logo, inline so it takes the text
  colour; the same outlines are in `public/brand/`, with the "w." seal stamps.
  The favicon files (`favicon.ico`, `favicon.svg`, `favicon-paper.svg`,
  `apple-touch-icon.png`) sit in `public/`
- `components/waitlist-form.tsx` and `app/actions.ts`: the sign-up form and
  the server action that calls Convex
- `../convex/waitlist.ts`: the mutation that validates and de-duplicates emails

Links can carry a source, for example `?ref=x`, which is saved with the
sign-up so you can see where people came from.
