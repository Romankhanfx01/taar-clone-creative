import { createServerFn } from "@tanstack/react-start";
import {
  deleteCookie,
  getCookie,
  setCookie,
} from "@tanstack/react-start/server";
import { z } from "zod";
import { api, ApiNotConfigured, getApiBase } from "./api.server";

const COOKIE = "admin_session";

export type Admin = { id: number; email: string; name?: string };

export const getAdminMe = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ admin: Admin | null; configured: boolean }> => {
    const configured = !!getApiBase();
    if (!configured) return { admin: null, configured: false };
    const token = getCookie(COOKIE);
    if (!token) return { admin: null, configured: true };
    try {
      const { admin } = await api<{ admin: Admin }>("/admin/me", {
        cookie: `${COOKIE}=${token}`,
        admin: true,
      });
      return { admin, configured: true };
    } catch {
      return { admin: null, configured: true };
    }
  },
);

export const loginAdmin = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z.object({ email: z.string().email(), password: z.string().min(1) }).parse(d),
  )
  .handler(async ({ data }) => {
    if (!getApiBase()) throw new Error("Configure API_BASE_URL to enable admin login.");
    const res = await api<{ token: string; admin: Admin }>("/admin/login", {
      method: "POST",
      body: data,
      admin: true,
    });
    setCookie(COOKIE, res.token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return { admin: res.admin };
  });

export const logoutAdmin = createServerFn({ method: "POST" }).handler(async () => {
  const token = getCookie(COOKIE);
  if (token && getApiBase()) {
    try {
      await api("/admin/logout", { method: "POST", admin: true, cookie: `${COOKIE}=${token}` });
    } catch {}
  }
  deleteCookie(COOKIE, { path: "/" });
  return { ok: true };
});

// Admin product CRUD
export const adminListProducts = createServerFn({ method: "GET" }).handler(async () => {
  const token = getCookie(COOKIE);
  return api<any[]>("/admin/products", { admin: true, cookie: token ? `${COOKIE}=${token}` : undefined });
});

const productInput = z.object({
  id: z.number().optional(),
  slug: z.string().min(1),
  name: z.string().min(1),
  tagline: z.string().default(""),
  description: z.string().default(""),
  price: z.number().int().positive(),
  old_price: z.number().int().optional().nullable(),
  image: z.string().default(""),
  badge: z.string().optional().nullable(),
  collection: z.string().optional().nullable(),
  published: z.boolean().default(true),
});

export const adminSaveProduct = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => productInput.parse(d))
  .handler(async ({ data }) => {
    const token = getCookie(COOKIE);
    const cookie = token ? `${COOKIE}=${token}` : undefined;
    if (data.id) {
      return api(`/admin/products/${data.id}`, { method: "PATCH", body: data, admin: true, cookie });
    }
    return api("/admin/products", { method: "POST", body: data, admin: true, cookie });
  });

export const adminDeleteProduct = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ id: z.number() }).parse(d))
  .handler(async ({ data }) => {
    const token = getCookie(COOKIE);
    await api(`/admin/products/${data.id}`, {
      method: "DELETE",
      admin: true,
      cookie: token ? `${COOKIE}=${token}` : undefined,
    });
    return { ok: true };
  });
