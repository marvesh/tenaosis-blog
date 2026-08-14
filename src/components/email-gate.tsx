import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useAdmin } from "@/lib/admin-context";
import { useBlog } from "@/lib/blog-store";
import { useReader } from "@/lib/reader-context";

export function EmailGate({
  title = "Read the full essay",
  blurb = "Join us with your email to unlock the complete piece and every future letter. It's free.",
}: {
  title?: string;
  blurb?: string;
}) {
  const { signIn } = useReader();
  const { signInWithEmail } = useAdmin();
  const { addSubscriber } = useBlog();
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);

  return (
    <div className="mt-8 rounded-xl border border-border bg-secondary/50 px-5 py-6 text-center sm:px-8">
      <h2 className="text-2xl">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{blurb}</p>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const value = email.trim().toLowerCase();
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || value.length > 255) {
            setError(true);
            return;
          }
          addSubscriber(value);
          void signInWithEmail(value);
          signIn(value);
        }}
        className="mx-auto mt-5 grid max-w-md grid-cols-[minmax(0,1fr)_auto] gap-2"
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
          placeholder="Your email address"
          aria-label="Your email address"
          className="input-soft min-w-0"
        />
        <button
          type="submit"
          aria-label="Continue reading"
          className="grid shrink-0 place-items-center rounded-full bg-primary px-5 text-primary-foreground"
        >
          <ArrowRight size={16} />
        </button>
      </form>
      {error && <p className="mt-3 text-sm text-destructive">Please enter a valid email address.</p>}
    </div>
  );
}
