import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

const READER_KEY = "tenaosis.reader.email";

type ReaderStore = {
  email: string | null;
  hasAccess: boolean;
  signIn: (email: string) => void;
  signOut: () => void;
};

const ReaderContext = createContext<ReaderStore | null>(null);

export function ReaderProvider({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    try {
      setEmail(window.localStorage.getItem(READER_KEY));
    } catch {
      /* storage unavailable */
    }
  }, []);

  const signIn = useCallback((value: string) => {
    const clean = value.trim().toLowerCase();
    setEmail(clean);
    try {
      window.localStorage.setItem(READER_KEY, clean);
    } catch {
      /* storage unavailable */
    }
  }, []);

  const signOut = useCallback(() => {
    setEmail(null);
    try {
      window.localStorage.removeItem(READER_KEY);
    } catch {
      /* storage unavailable */
    }
  }, []);

  const value = useMemo(
    () => ({ email, hasAccess: !!email, signIn, signOut }),
    [email, signIn, signOut],
  );

  return <ReaderContext.Provider value={value}>{children}</ReaderContext.Provider>;
}

export function useReader() {
  const ctx = useContext(ReaderContext);
  if (!ctx) throw new Error("useReader must be used inside ReaderProvider");
  return ctx;
}
