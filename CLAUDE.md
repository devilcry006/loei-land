# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is right now

Loeiland is a planned real-estate listing site for **จังหวัดเลย (Loei province)**, Thailand. The
repo is at the **pre-scaffold** stage:

- `docs/mock-up.html` — a frozen 2,631-line single-file HTML/CSS/JS prototype. It is the **spec**
  for UX, copy, and business rules. Do not build on it or keep editing it; reference it.
  (It was committed as `index.html`; the move to `docs/` is the current uncommitted change.)
- `docs/PLAN.md` — the "why": chosen stack, routes, DB schema, security/PDPA/SEO/mobile plan, phases.
- `docs/tasks/P0-setup.md` … `P6-launch.md` — the "what": 70 checklist items across 7 phases.
- `docs/PROGRESS.md` — the "where we are": **source of truth for status**. Phase P0, nothing started.

There is no `package.json`, framework, or app code yet. The real build starts at task **P0-03**
(`create-next-app`).

## Working rhythm (from docs/tasks/README.md)

1. Do phases in order. P2 / P3 / P4 may run in parallel once P1 is done. P5 needs P4.
2. Closing a task means: tick `- [x]` in the `tasks/Pn-*.md` file, update the progress numbers and
   phase status table in `PROGRESS.md`, and add a dated line to its progress log.
3. Commit messages reference the task code, e.g. `P1-04: add RLS policies for properties`.
4. A decision that needs to be made mid-task → add a row to the "เรื่องที่ติดอยู่" table in
   `PROGRESS.md` immediately. When resolved, move it to the decision log with the reasoning.
5. If `PLAN.md` turns out wrong, fix `PLAN.md` too — don't let docs and code tell different stories.

Docs are written in Thai. Keep new docs and user-facing copy in Thai; the site is bilingual (th/en).

## Commands

None yet — the Next.js project is not scaffolded. After P0-03 the expected set is:

```bash
npm run dev            # local dev server
npm run build          # production build (must pass in CI)
npx tsc --noEmit       # typecheck (must pass in CI)
npm run lint           # ESLint
```

To view the prototype now: open `docs/mock-up.html` directly in a browser.

## Planned architecture (docs/PLAN.md — decided, not yet built)

- **Stack:** Next.js 15 (App Router) + TypeScript + Tailwind, Supabase (Postgres + Auth + Storage),
  Longdo Map API v3, Zod + React Hook Form, Cloudflare Turnstile, deploy target TBD (decision D-1).
- **Routes:** every property gets its own URL (`/property/[slug]`, ISR) — the prototype's
  single-URL-with-drawers approach breaks SEO and sharing. Per-district landing pages
  (`/district/[district]`, 14 of them) are the real traffic target.
- **Design tokens:** the `:root` CSS variables in `docs/mock-up.html` (`--bg --paper --ink --muted
  --line --brand --brand-2 --soft --danger --shadow --radius`) move into the Tailwind theme (P0-05).
- **Data model:** the prototype's `starterProperties` array (~24 fields/listing) becomes the DB
  schema. Thai land units (ไร่ / งาน / ตร.ว.) and price-per-rai / price-per-wah math are spec.
- **Mobile:** design mobile-first. Do **not** carry over `body { overflow: hidden }` or the
  desktop-only two-column grid from the prototype.

## Hard rules

**Privacy is the product.** The site shows approximate *zones*, never precise locations or
owner-identifying data.

- Public listing data and secret data live in **separate tables**: `properties` (public) vs
  `property_private` (exact coords, deed number, `owner_name`, `owner_contact`, `admin_note`,
  consent record). `property_private` is closed to the `anon` role via RLS. Never join owner
  contact / exact coordinates / deed numbers into anything served to the public.
- Exact coordinates are blurred **server-side** on approval (random 500–1,000 m offset) and stored
  only in `property_private`. Never trust a client-supplied "zone" coordinate.
- Store consent as data (`consent_at` + `consent_version`), not just a checkbox.
- Public forms (lead / submit / buyer-request) do **not** insert with the anon key. They go through
  a Server Action that runs Zod + Turnstile + rate-limit, then writes with the service role.
- `SUPABASE_SERVICE_ROLE_KEY` must **never** be prefixed `NEXT_PUBLIC_` and must never reach the
  client bundle. `.env*.local` stays out of git; maintain `.env.example`.
- No `dangerouslySetInnerHTML` in admin pages — user-submitted text is rendered as text only.

**Do not port these from the prototype** (they are why the rewrite exists): `localStorage` as the
datastore; the client-side `adminPin` "2468"; `innerHTML` injection of user input in the admin
queue; merging owner fields into public listing objects on approve; the hand-rolled map
projection + direct OSM tile fetching (violates OSM usage policy for commercial use → Longdo).

## Skills

`.claude/skills/` vendors `frontend-design` and `vercel-react-best-practices` (pinned in
`skills-lock.json`). Use the React/Next.js performance skill when writing or reviewing components.
