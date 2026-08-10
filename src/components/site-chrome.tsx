import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useAdmin } from "@/lib/admin-context";

const nav = [
  { to: "/blog", label: "Blog" },
  { to: "/about", label: "About" },
  { to: "/newsletter", label: "Email" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { isAdmin, signOut } = useAdmin();

  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto grid max-w-5xl grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-5 py-4 sm:py-6">
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
          className="shrink-0 text-primary sm:hidden"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>

        <Link to="/" className="min-w-0 text-center sm:text-left" onClick={() => setOpen(false)}>
          <span className="block font-display text-2xl tracking-wide text-primary sm:text-3xl">
            Tenaosis
          </span>
        </Link>

        <nav className="hidden items-center gap-6 sm:flex">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="label-caps text-primary/80 transition-colors hover:text-primary"
              activeProps={{ className: "label-caps text-primary underline underline-offset-4" }}
            >
              {item.label}
            </Link>
          ))}
          {isAdmin ? (
            <button type="button" onClick={() => void signOut()} className="label-caps text-muted-foreground hover:text-primary">
              Exit admin
            </button>
          ) : (
            <Link to="/admin" className="label-caps text-muted-foreground hover:text-primary">
              Admin
            </Link>
          )}
        </nav>
        <span className="w-4 sm:hidden" />
      </div>

      {open && (
        <nav className="flex flex-col items-center gap-3 border-t border-border bg-secondary py-6 sm:hidden">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="label-caps text-primary"
            >
              {item.label}
            </Link>
          ))}
          {isAdmin ? (
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                void signOut();
              }}
              className="label-caps text-muted-foreground"
            >
              Exit admin
            </button>
          ) : (
            <Link to="/admin" onClick={() => setOpen(false)} className="label-caps text-muted-foreground">
              Admin
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border py-8 text-center">
      <p className="label-caps text-muted-foreground">Designed by Tenaosis</p>
    </footer>
  );
}
