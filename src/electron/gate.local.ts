// Offline (Electron) replacement for src/lib/gate.functions.ts.
// The desktop build has no server, so the admin gate runs locally.
const STORAGE_KEY = "tenaosis-admin-unlocked";

declare const __ADMIN_PASSWORD__: string;

export async function getAdminStatus() {
  if (typeof window === "undefined") return { isAdmin: false };
  return { isAdmin: window.localStorage.getItem(STORAGE_KEY) === "true" };
}

export async function unlockAdmin({ data }: { data: { password: string } }) {
  if (!data.password || data.password !== __ADMIN_PASSWORD__) return { ok: false as const };
  window.localStorage.setItem(STORAGE_KEY, "true");
  return { ok: true as const };
}

export async function lockAdmin() {
  window.localStorage.removeItem(STORAGE_KEY);
  return { ok: true as const };
}
