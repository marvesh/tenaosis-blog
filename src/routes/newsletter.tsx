import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import newsletterImage from "@/assets/newsletter.jpg";
import { useBlog } from "@/lib/blog-store";

export const Route = createFileRoute("/newsletter")({
  head: () => ({
    meta: [
      { title: "Join the Tenaosis Letter — Weekly quiet-living notes" },
      {
        name: "description",
        content:
          "A recurring reminder that the world outside your screen is still waiting. Join the Tenaosis letter.",
      },
      { property: "og:title", content: "Join the Tenaosis Letter" },
      {
        property: "og:description",
        content: "A recurring reminder that the world outside your screen is still waiting.",
      },
      { property: "og:url", content: "https://cozy-cms-corner-67.lovable.app/newsletter" },
    ],
    links: [{ rel: "canonical", href: "https://cozy-cms-corner-67.lovable.app/newsletter" }],
  }),
  component: Newsletter,
});

function Newsletter() {
  const { addSubscriber } = useBlog();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "done" | "dupe">("idle");

  return (
    <div className="mx-auto max-w-2xl px-5 py-8 sm:py-12">
      <h1 className="text-3xl sm:text-4xl">Join the Tenaosis Letter</h1>
      <img
        src={newsletterImage}
        alt="A woman reading a book in a sunlit garden"
        loading="lazy"
        width={1280}
        height={900}
        className="mt-5 aspect-[16/10] w-full object-cover"
      />
      <div className="mt-6 space-y-4 text-[0.95rem] text-foreground/90">
        <p>
          By joining the Tenaosis community, you're joining a shared journey toward a more grounded,
          tactile life. Every week, we'll send a small anchor to your inbox: a gentle reflection and
          a simple experiment to help you reclaim your natural rhythms.
        </p>
        <p>
          It's a recurring reminder that the world outside the screen is still waiting for you. No
          noise, no urgency — just one honest idea at a time.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!email.includes("@")) return;
          setStatus(addSubscriber(email) ? "done" : "dupe");
          setEmail("");
        }}
        className="mt-8 grid grid-cols-[minmax(0,1fr)_auto] gap-2"
      >
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          aria-label="Your email address"
          className="min-w-0 border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
        />
        <button
          type="submit"
          className="grid shrink-0 place-items-center bg-primary px-4 text-primary-foreground"
          aria-label="Subscribe"
        >
          <ArrowRight size={16} />
        </button>
      </form>
      {status === "done" && <p className="mt-3 text-sm text-primary">You're in. Welcome to the quiet.</p>}
      {status === "dupe" && (
        <p className="mt-3 text-sm text-muted-foreground">That address is already on the list.</p>
      )}

      <p className="mt-8 text-sm text-muted-foreground">
        For any enquiry or feedback:{" "}
        <a href="mailto:hello@tenaosis.com" className="text-primary underline underline-offset-4">
          hello@tenaosis.com
        </a>
      </p>
    </div>
  );
}
