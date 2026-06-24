// Server-only fetch wrapper for the user's MySQL-backed API.
// Falls back gracefully when API_BASE_URL is not configured.

export function getApiBase(): string | null {
  const url = process.env.API_BASE_URL;
  return url && url.length > 0 ? url.replace(/\/$/, "") : null;
}

export function getAdminToken(): string | null {
  return process.env.API_ADMIN_TOKEN ?? null;
}

export class ApiNotConfigured extends Error {
  constructor() {
    super("API_BASE_URL is not configured");
  }
}

type Options = {
  method?: string;
  body?: unknown;
  admin?: boolean;
  cookie?: string;
  query?: Record<string, string | number | undefined>;
};

export async function api<T>(path: string, opts: Options = {}): Promise<T> {
  const base = getApiBase();
  if (!base) throw new ApiNotConfigured();

  const qs = opts.query
    ? "?" +
      Object.entries(opts.query)
        .filter(([, v]) => v !== undefined && v !== "")
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
        .join("&")
    : "";

  const headers: Record<string, string> = { Accept: "application/json" };
  if (opts.body !== undefined) headers["Content-Type"] = "application/json";
  if (opts.admin) {
    const token = getAdminToken();
    if (!token) throw new Error("API_ADMIN_TOKEN missing");
    headers.Authorization = `Bearer ${token}`;
  }
  if (opts.cookie) headers.Cookie = opts.cookie;

  const res = await fetch(`${base}${path}${qs}`, {
    method: opts.method ?? "GET",
    headers,
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${res.status} on ${path}: ${text.slice(0, 200)}`);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}
