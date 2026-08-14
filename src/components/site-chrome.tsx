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

const logoMask = {
  WebkitMaskImage: `url(${logoAsset.url})`,
  maskImage: `url(${logoAsset.url})`,
  WebkitMaskRepeat: "no-repeat",
  maskRepeat: "no-repeat",
  WebkitMaskPosition: "center",
  maskPosition: "center",
  WebkitMaskSize: "contain",
  maskSize: "contain",
} as const;

function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span
      role="img"
      aria-label="Tenaosis"
      style={logoMask}
      className={`block bg-primary ${className}`}
    />
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { isAdmin, signOut } = useAdmin();

  return (
    <header className="relative border-b border-border bg-background">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-5 py-5 sm:py-7">
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
          className="rounded-full border border-brand-orange/60 p-1.5 text-brand-orange sm:hidden"
        >
          {open ? <X size={16} /> : <Menu size={16} />}
        </button>

        <Link to="/" onClick={() => setOpen(false)} aria-label="Tenaosis home">
          <Wordmark className="h-7 w-32 sm:h-9 sm:w-44" />
        </Link>

        <nav className="hidden flex-wrap items-center justify-center gap-7 sm:flex">
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
          {isAdmin && (
            <>
              <Link to="/dashboard" className="label-caps text-primary/80 hover:text-primary">
                Dashboard
              </Link>
              <button
                type="button"
                onClick={() => void signOut()}
                className="label-caps text-primary/80 hover:text-primary"
              >
                Exit admin
              </button>
            </>
          )}
        </nav>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex sm:hidden">
          <div className="flex w-[70%] max-w-xs flex-col items-center gap-5 bg-background px-6 py-14">
            <Wordmark className="h-7 w-32" />
            {nav
              .filter((i) => i.to !== "/")
              .map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="label-caps text-brand-orange"
                >
                  {item.label}
                </Link>
              ))}
            {isAdmin && (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setOpen(false)}
                  className="label-caps text-brand-orange"
                >
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    void signOut();
                  }}
                  className="label-caps text-brand-orange"
                >
                  Exit admin
                </button>
              </>
            )}
          </div>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="flex-1 bg-foreground/70"
          />
        </div>
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
