import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useAdmin } from "@/lib/admin-context";
import logoAsset from "@/assets/tenaosis-logo.png.asset.json";

const nav = [
  { to: "/", label: "Home", exact: true },
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
          className="shrink-0 rounded-full p-1 text-primary sm:hidden"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>

        <Link
          to="/"
          className="flex min-w-0 justify-center sm:justify-start"
          onClick={() => setOpen(false)}
          aria-label="Tenaosis home"
        >
          <img
            src={logoAsset.url}
            alt="Tenaosis"
            width={200}
            height={54}
            className="h-8 w-auto object-contain sm:h-10"
          />
        </Link>

        <nav className="hidden items-center gap-6 sm:flex">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: "exact" in item ? item.exact : false }}
              className="label-caps text-primary/80 transition-colors hover:text-primary"
              activeProps={{ className: "label-caps text-primary underline underline-offset-4" }}
            >
              {item.label}
            </Link>
          ))}
          {isAdmin ? (
            <>
              <Link to="/dashboard" className="label-caps text-muted-foreground hover:text-primary">
                Dashboard
              </Link>
              <button
                type="button"
                onClick={() => void signOut()}
                className="label-caps text-muted-foreground hover:text-primary"
              >
                Exit admin
              </button>
            </>
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
            <>
              <Link
                to="/dashboard"
                onClick={() => setOpen(false)}
                className="label-caps text-muted-foreground"
              >
                Dashboard
              </Link>
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
            </>
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
