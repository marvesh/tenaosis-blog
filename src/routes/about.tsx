import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import aboutImage from "@/assets/about-balance.jpg";
import { useAdmin } from "@/lib/admin-context";
export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "The Balance — About Tenaosis" },
      {
        name: "description",
        content:
          "Tenaosis is a quiet return to what is real: a sanctuary where modern life meets natural living.",
      },
      { property: "og:title", content: "The Balance — About Tenaosis" },
      {
        property: "og:description",
        content: "A quiet return to what is real, where modern life meets natural living.",
      },
      { property: "og:url", content: "https://tenaosis-blog.lovable.app/about" },
    ],
    links: [{ rel: "canonical", href: "https://tenaosis-blog.lovable.app/about" }],
  }),
  component: About,
});

function About() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-8 sm:py-12">
      <h1 className="text-3xl sm:text-4xl">The balance</h1>
      <img
        src={aboutImage}
        alt="A quiet reading corner with plants and soft daylight"
        loading="lazy"
        width={1280}
        height={900}
        className="mt-5 aspect-[16/10] w-full rounded-xl object-cover"
      />
      <div className="mt-6 space-y-4 text-[1.05rem] leading-8 text-foreground/90">
        <p>
          In a world that never seems to pause, Tenaosis offers a quiet return to what is real.
        </p>
        <p>
          We believe technology is a powerful tool — but it should never control our lives. Our
          mission is not to escape the digital world, but to find balance within it. To rediscover
          the depth that comes from silence, slow moments and true connection.
        </p>
        <p>
          Through thoughtful reflections and simple, practical experiments, we explore how to
          reconnect with natural rhythms — movement and rest, work and stillness, solitude and
          community.
        </p>
        <p>
          This is a space to embrace the beautiful experience of being fully present. Welcome to a
          sanctuary where modern life meets natural living.
        </p>
        <p className="font-display text-2xl text-primary">Reclaim your rhythm.</p>
      </div>

      <EditorAccess />
    </div>
  );
}

function EditorAccess() {
  const { isAdmin, signIn } = useAdmin();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = email.trim().toLowerCase();
    const pass = password.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || !pass) {
      setError(true);
      return;
    }

    setBusy(true);
    setError(false);
    const res = await signIn(value, pass);
    setBusy(false);
    setPassword("");
    if (res.ok) void navigate({ to: "/dashboard" });
    else setError(true);
  };



  if (isAdmin) {
    return (
      <p className="mt-12 border-t border-border pt-6 text-sm text-muted-foreground">
        You're signed in as the editor.{" "}
        <button
          type="button"
          onClick={() => void navigate({ to: "/dashboard" })}
          className="text-primary underline underline-offset-4"
        >
          Open your dashboard
        </button>
      </p>
    );
  }

  return (
    <div className="mt-12 border-t border-border pt-6">
      <p className="label-caps text-muted-foreground">Editor</p>
      <p className="mt-2 text-sm text-muted-foreground">
        If this journal is yours, enter your email and password to unlock the editor tools.
      </p>
      <form onSubmit={handleSubmit}
        className="mt-4 flex max-w-xl flex-row items-center gap-2"
      >
        <input
          type="email"
          required
          maxLength={255}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError(false);
          }}
          placeholder="Editor email"
          aria-label="Editor email"
          className="input-soft min-w-0 flex-1"
        />
        <input
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError(false);
          }}
          placeholder="Password"
          aria-label="Editor password"
          className="input-soft min-w-0 flex-1 sm:w-44 sm:flex-none"
        />
        <button type="submit" disabled={busy} className="pill shrink-0 disabled:opacity-60">
          {busy ? "Checking" : "Unlock"}
        </button>
      </form>
      {error && (
        <p className="mt-3 text-sm text-destructive">
          That email or password doesn't have editor access.
        </p>
      )}
    </div>
  );
}
