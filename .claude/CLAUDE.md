# NEM Life — Project Context

## What this is
Custom code for https://nemlife.com — a Dutch psychology brand by Christel Reus.
Vanilla JS + CSS, no build step. Single CDN entry via `src/init.js`.

## Stack
- Vanilla ES2022+, no build step, no jQuery, no TypeScript
- Webflow hosting + CMS
- Client-First class naming convention
- jsDelivr CDN delivery (commit-hash pinned)
- Swiper for hero slider

## Webflow site
- Site ID: `69bfba56f3622791a798b816`
- Project: `NEMLife.com NEW` (shortName: `nem-life-1`)
- Staging: https://nem-life-1.webflow.io
- Live: https://nemlife.com

## Deployment
- `src/init.js` is the only script tag in Webflow head
- jsDelivr serves files pinned to a commit hash
- Dev mode: `?dev=on` loads from localhost; `?dev=off` reverts to CDN
- On deploy: push, copy commit SHA, update hash + `?v=` in Webflow head

## Code style
- All modules wrapped in IIFE (no global pollution)
- No `console.log` in committed code — use `DEBUG && console.log(...)` pattern
- Named exports only if modules ever need to communicate

## File responsibilities
| File | Responsibility |
|------|----------------|
| `src/init.js` | Loader: dev/CDN URL resolution, CSS + JS module loading |
| `src/global.css` | Resets, fluid typography, rich text, component hover states, utilities |
| `src/blog-share.js` | Email share button on blog articles |
| `src/back-to-top.js` | Scroll-to-top button |

## Version format
`YYYY.M.D.N` — year, month, day, daily build number. Bump `CONFIG.version` in `src/init.js` on each deploy.

## Key constraints
- No custom code unless strictly necessary (per client brief)
- Tone: calm, grounded — no dramatic animation, no excessive motion
- All essential text in DOM at page load (GEO/AEO requirement)
- CSS-only collapsing for expandable sections (no JS hide/show of content)
- Mobile-first responsive
