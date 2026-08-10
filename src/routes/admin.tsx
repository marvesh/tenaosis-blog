import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAdmin } from "@/lib/admin-context";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Editor Access — Tenaosis" },
      { name: "description", content: "Private editor access for the Tenaosis journal." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Editor Access — Tenaosis" },
      { property: "og:description", content: "Private editor access for the Tenaosis journal." },
    ],
  }),
  component: AdminGate,
});

function AdminGate() {
  const { signIn, isAdmin } = useAdmin();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

  return (
    <div className="mx-auto max-w-sm px-5 py-16">
      <h1 className="text-3xl">Editor access</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {isAdmin
          ? "You're already signed in. Admin tools appear at the top of the home page."
          : "Enter the shared editor password to unlock admin tools on the home page."}
      </p>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          const ok = await signIn(password);
          setBusy(false);
          setPassword("");
          if (ok) void navigate({ to: "/" });
          else setError(true);
        }}
        className="mt-6 space-y-3"
      >
        <input
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError(false);
          }}
          placeholder="Password"
          aria-label="Editor password"
          className="w-full border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
        />
        <button type="submit" disabled={busy} className="pill disabled:opacity-60">
          {busy ? "Checking…" : "Unlock"}
        </button>
      </form>
      {error && <p className="mt-3 text-sm text-destructive">Incorrect password.</p>}
    </div>
  );
}
