# MySQL Schema + API Contract

Paste this schema into your MySQL DB, then implement the HTTP endpoints below in front of it. The storefront calls these endpoints from server functions; secrets stay on the server.

## Secrets the app expects

| Name | Used for |
| --- | --- |
| `API_BASE_URL` | Base URL of your API, e.g. `https://api.yourdomain.com` |
| `API_ADMIN_TOKEN` | Bearer token for admin/write endpoints |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `GOOGLE_OAUTH_CLIENT_ID` | Google OAuth client id (your API handles the flow) |
| `GOOGLE_OAUTH_CLIENT_SECRET` | Google OAuth client secret |
| `SESSION_SECRET` | (auto-generated) — already configured |

Webhook URL to register in Stripe (after you publish):
`https://<project-id>.lovable.app/api/public/stripe-webhook`

## Schema

```sql
CREATE TABLE collections (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  slug          VARCHAR(80)  NOT NULL UNIQUE,
  name          VARCHAR(120) NOT NULL,
  description   TEXT NULL,
  sort_order    INT NOT NULL DEFAULT 0,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  slug          VARCHAR(120) NOT NULL UNIQUE,
  name          VARCHAR(200) NOT NULL,
  tagline       VARCHAR(255) NULL,
  description   TEXT NULL,
  price         INT NOT NULL,            -- minor units (paisa)
  old_price     INT NULL,
  image         VARCHAR(500) NULL,       -- absolute URL
  badge         VARCHAR(40) NULL,
  collection_id INT NULL,
  specs_json    JSON NULL,               -- [{label, value}]
  published     TINYINT(1) NOT NULL DEFAULT 1,
  search_text   TEXT GENERATED ALWAYS AS (CONCAT_WS(' ', name, tagline, description)) STORED,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (collection_id) REFERENCES collections(id) ON DELETE SET NULL,
  FULLTEXT KEY ft_search (search_text)
);

CREATE TABLE orders (
  id                    INT AUTO_INCREMENT PRIMARY KEY,
  stripe_session_id     VARCHAR(120) NOT NULL UNIQUE,
  stripe_payment_intent VARCHAR(120) NULL,
  email                 VARCHAR(200) NOT NULL,
  amount_total          INT NOT NULL,
  currency              VARCHAR(8)  NOT NULL,
  status                VARCHAR(40) NOT NULL DEFAULT 'paid',
  items_json            JSON NOT NULL,
  shipping_json         JSON NULL,
  created_at            TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE admins (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  email           VARCHAR(200) NOT NULL UNIQUE,
  password_hash   VARCHAR(255) NULL,
  google_sub      VARCHAR(120) NULL UNIQUE,
  name            VARCHAR(120) NULL,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE admin_sessions (
  token         VARCHAR(120) PRIMARY KEY,
  admin_id      INT NOT NULL,
  expires_at    DATETIME NOT NULL,
  FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE
);

CREATE TABLE site_content (
  k     VARCHAR(80) PRIMARY KEY,        -- 'hero', 'reviews', 'announcement'
  v     JSON NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## HTTP API

Public (no auth):

| Method | Path | Returns |
| --- | --- | --- |
| GET | `/products?search=&collection=&limit=&offset=` | `{ items: Product[], total: number }` |
| GET | `/products/:slug` | `Product` |
| GET | `/collections` | `Collection[]` (with `count`) |
| GET | `/collections/:slug` | `{ collection: Collection, items: Product[] }` |
| GET | `/site-content` | `{ hero: [...], reviews: [...], announcement: [...] }` |
| GET | `/sitemap-data` | `{ products: [{slug}], collections: [{slug}] }` |

Admin (`Authorization: Bearer <API_ADMIN_TOKEN>` + the admin's session cookie):

| Method | Path |
| --- | --- |
| POST | `/admin/login` (body: `{email,password}`) → `{ token, admin }` |
| POST | `/admin/logout` |
| GET | `/admin/me` (cookie `admin_session=<token>`) → `{ admin }` or 401 |
| GET / POST / PATCH / DELETE | `/admin/products[/:id]` |
| GET / POST / PATCH / DELETE | `/admin/collections[/:id]` |
| GET / PATCH | `/admin/orders[/:id]` |
| GET / PATCH | `/admin/site-content` |

### Order webhook (called by this app on `checkout.session.completed`)

```
POST /admin/orders   (Bearer API_ADMIN_TOKEN)
{ stripe_session_id, stripe_payment_intent, email, amount_total, currency, items, shipping }
```

### Google OAuth

Your API owns the OAuth flow. Redirect URL the storefront will hit:
- Start: `${API_BASE_URL}/admin/auth/google` (sets state cookie, redirects to Google)
- Callback: `${API_BASE_URL}/admin/auth/google/callback` (your API, sets `admin_session` cookie on the storefront's domain via 302 to `https://<your-site>/admin`)

> Note: the admin cookie must be set on your storefront domain. Either run your API on a subdomain of the storefront (e.g. `api.yourdomain.com` + cookie `Domain=.yourdomain.com`), or proxy `/api/admin/*` through this app.
