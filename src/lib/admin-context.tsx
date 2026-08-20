import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { getMe, getToken, login, setToken, type ApiUser } from "@/lib/api";

type AdminStore = {
  user: ApiUser | null;
  isAdmin: boolean;
  ready: boolean;
  signIn: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  signOut: () => void;
};

const AdminContext = createContext<AdminStore | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    if (!getToken()) {
      setReady(true);
      return;
    }
    getMe()
      .then((me) => {
        if (active) setUser(me);
      })
      .catch(() => {
        setToken(null);
      })
      .finally(() => {
        if (active) setReady(true);
      });
    return () => {
      active = false;
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const token = await login(email.trim().toLowerCase(), password);
      setToken(token.access_token);
      const me = await getMe();
      setUser(me);
      return { ok: true };
    } catch (err) {
      setToken(null);
      setUser(null);
      return { ok: false, error: err instanceof Error ? err.message : "Sign in failed" };
    }
  }, []);

  const signOut = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, isAdmin: user !== null, ready, signIn, signOut }),
    [user, ready, signIn, signOut],
  );
  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used inside AdminProvider");
  return ctx;
}
