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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  return (
    <div className="mx-auto max-w-sm px-5 py-16">
      <h1 className="text-3xl">Editor access</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {isAdmin
          ? "You're already signed in. Head to your dashboard."
          : "Sign in with your editor email and password."}
      </p>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          setError(null);
          const res = await signIn(email, password);
          setBusy(false);
          setPassword("");
          if (res.ok) void navigate({ to: "/dashboard" });
          else setError(res.error ?? "Invalid email or password.");
        }}
        className="mt-6 space-y-3"
      >
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          aria-label="Editor email"
          className="input-soft"
        />
        <input
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          aria-label="Editor password"
          className="input-soft"
        />
        <button type="submit" disabled={busy} className="pill disabled:opacity-60">
          {busy ? "Checking…" : "Sign in"}
        </button>
      </form>
      {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
    </div>
  );
}
