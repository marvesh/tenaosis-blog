import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { getAdminStatus, lockAdmin, unlockAdmin } from "@/lib/gate.functions";

type AdminStore = {
  isAdmin: boolean;
  ready: boolean;
  signIn: (password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
};

const AdminContext = createContext<AdminStore | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    getAdminStatus()
      .then((res) => {
        if (active) setIsAdmin(res.isAdmin);
      })
      .catch(() => undefined)
      .finally(() => {
        if (active) setReady(true);
      });
    return () => {
      active = false;
    };
  }, []);

  const signIn = useCallback(async (password: string) => {
    const res = await unlockAdmin({ data: { password } });
    if (res.ok) setIsAdmin(true);
    return res.ok;
  }, []);

  const signOut = useCallback(async () => {
    await lockAdmin();
    setIsAdmin(false);
  }, []);

  const value = useMemo(() => ({ isAdmin, ready, signIn, signOut }), [isAdmin, ready, signIn, signOut]);
  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used inside AdminProvider");
  return ctx;
}
