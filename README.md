# NEM Life — Custom Code

Custom JavaScript and CSS for [nemlife.com](https://nemlife.com) (Webflow).

## How it works

A single `<script>` tag in the Webflow site head loads `init.js`, which handles loading all CSS and JS modules from jsDelivr CDN (pinned to a specific commit).

### Webflow embed (site-wide head code)

```html
<script src="https://cdn.jsdelivr.net/gh/studiozissou/nem-life@COMMIT_HASH/src/init.js?v=1"></script>
```

Replace `COMMIT_HASH` with the short SHA of the commit you want to deploy.

## Dev mode

Add `?dev=on` to any page URL to switch to your local dev server. Add `?dev=off` to switch back to CDN. The setting persists in localStorage.

```
https://nemlife.com?dev=on          # switch to localhost:8080
https://nemlife.com?dev=off         # switch back to CDN
https://nemlife.com?dev-port=3000   # use a custom port
```

A small olive dot appears top-left when dev mode is active.

### Running a local server

Any HTTPS server serving the repo root on port 8080 will work:

```bash
npx serve . --listen 8080
# or with mkcert for HTTPS:
npx local-ssl-proxy --source 8080 --target 8081
```

### Mobile dev (ngrok)

Set `window.__NEM_BASE` in an inline script before init.js loads:

```html
<script>window.__NEM_BASE = 'https://YOUR-ID.ngrok-free.dev/src';</script>
<script src="https://cdn.jsdelivr.net/gh/studiozissou/nem-life@COMMIT/src/init.js?v=1"></script>
```

## Deploying

1. Make changes, commit, push
2. Copy the commit SHA: `git rev-parse --short HEAD`
3. Update the script URL in Webflow site head with the new commit hash
4. Bump the `?v=` param to bust jsDelivr cache

## File structure

```
src/
  init.js         — Loader (dev/CDN switching, module loading)
  global.css      — Site-wide styles (resets, typography, utilities)
  blog-share.js   — Blog article email share button
  back-to-top.js  — Scroll-to-top button
```

## Transferring ownership

This repo is structured for easy transfer to another GitHub account:

1. **Transfer repo:** Settings > Danger Zone > Transfer repository
2. **Update Webflow:** Change `studiozissou` to the new GitHub username in the script URL
3. **Update init.js:** Change `CONFIG.baseUrlTemplate` to use the new username
4. jsDelivr works with any public GitHub repo — no configuration needed

## Stack

- Vanilla ES2022+ (no build step, no bundler)
- No jQuery, no TypeScript
- Client-First class naming convention (Webflow/Finsweet)
- CDN delivery via jsDelivr (commit-hash pinned)
