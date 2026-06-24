# Build plan

## What you provide
1. A REST API in front of your MySQL DB, reachable over HTTPS, exposing the endpoints listed in "Your API contract" below.
2. Secrets I'll request via the secret form:
   - `STRIPE_SECRET_KEY` — your Stripe key
   - `STRIPE_WEBHOOK_SECRET` — for order webhook verification
   - `API_BASE_URL` — e.g. `https://api.yourdomain.com`
   - `API_ADMIN_TOKEN` — shared secret the storefront sends on admin/write calls
   - `GOOGLE_OAUTH_CLIENT_ID` + `GOOGLE_OAUTH_CLIENT_SECRET` — for admin Google sign-in
   - `SESSION_SECRET` — I'll auto-generate

If you don't have Google OAuth credentials yet, I'll point you to the Google Cloud Console setup when we get there.

## Your API contract (you implement these in MySQL)
Public, no auth:
- `GET /products?search=&collection=&limit=&offset=` → list + facets
- `GET /products/:slug` → product detail
- `GET /collections` / `GET /collections/:slug`
- `GET /site-content` → hero slides, reviews, announcement bar

Admin, requires `Authorization: Bearer <API_ADMIN_TOKEN>`:
- `POST/PATCH/DELETE /products` (+ image upload URL)
- `POST/PATCH/DELETE /collections`
- `GET/PATCH /orders`
- `PATCH /site-content`

Order webhook target (I call it from Stripe webhook handler):
- `POST /orders` (on `checkout.session.completed`)

I'll send you a one-page MySQL schema (products, collections, product_collections, orders, order_items, site_content, admins) you can paste into your DB.

## What I'll build in this app

### 1. Data layer
- `src/lib/api.ts` — fetch wrapper that reads `API_BASE_URL`, attaches admin token only on server-side admin calls.
- Server functions (`createServerFn`) for all reads/writes so secrets never touch the browser.
- Replace static `src/lib/products.ts` with API-backed loaders. Existing seed products become a one-time `seed.sql` script you run against your DB.

### 2. Storefront search
- `/search?q=` route with debounced input in the header.
- Server function calls `GET /products?search=` and returns results.
- Empty state, loading skeleton, keyboard nav.

### 3. Stripe checkout (BYO key)
- `enable_stripe` BYO integration enabled.
- `POST /api/checkout` server route → creates Stripe Checkout Session from current cart, returns `url`, redirects buyer.
- `/checkout/success` and `/checkout/cancel` pages.
- `POST /api/public/stripe-webhook` → verifies signature, forwards verified order to your `POST /orders`.

### 4. Admin panel at `/admin`
- Google OAuth + email/password sign-in handled by **your API** (since there's no Lovable Cloud). Your API issues a session cookie; the app's `_authenticated` guard checks it via `GET /admin/me`.
- Pages: Products, Collections, Orders, Site Content. Each calls server functions that proxy to your admin endpoints with the bearer token.
- Image uploads go to your API (or you can return signed S3/R2 URLs — your call).

### 5. SEO + sitemap
- Per-route `head()` with unique `title`, `description`, `og:title`, `og:description`, `og:image` for: home, shop, each collection, each product, about, contact, search.
- Product/collection routes derive metadata + `og:image` from loader data.
- JSON-LD: `Organization` on home, `Product` schema on product pages, `BreadcrumbList` everywhere relevant.
- `sitemap.xml` becomes dynamic — fetches product + collection slugs from your API at request time.
- `robots.txt` updated to point at the dynamic sitemap.
- Canonical tags, OG image fallbacks, `lang` + viewport already in place.

## Technical notes
- Cloudflare Workers can't open raw MySQL TCP, which is why everything goes through your HTTPS API.
- All API calls run inside `createServerFn` / server routes so the admin token and Stripe key stay server-only.
- Admin pages use `ssr: false` to keep session checks client-side.
- React Query caches storefront reads; admin mutations invalidate the relevant query keys.

## Order I'll build in
1. Wire secrets + `src/lib/api.ts` + schema doc.
2. Migrate storefront reads to API + search.
3. Stripe checkout + webhook.
4. Admin auth + Products CRUD.
5. Collections, Orders, Site Content admin.
6. SEO metadata pass + dynamic sitemap.

Reply "go" to start, or tell me anything you want to change (e.g. drop site-content admin, use S3 for images, skip Google OAuth for now).