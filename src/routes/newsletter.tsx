import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import newsletterImage from "@/assets/newsletter.jpg";
import { subscribeNewsletter } from "@/lib/api";


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
      { property: "og:url", content: "https://tenaosis-blog.lovable.app/newsletter" },
    ],
    links: [{ rel: "canonical", href: "https://tenaosis-blog.lovable.app/newsletter" }],
  }),
  component: Newsletter,
});

function Newsletter() {
  const [email, setEmail] = useState("");
  const subscribe = useMutation({
    mutationFn: (value: string) => subscribeNewsletter(value),
    onSuccess: () => setEmail(""),
  });


  return (
    <div className="mx-auto max-w-2xl px-5 py-8 sm:py-12">
      <h1 className="text-3xl sm:text-4xl">Join the Tenaosis Letter</h1>
      <img
        src={newsletterImage}
        alt="A woman reading a book in a sunlit garden"
        loading="lazy"
        width={1280}
        height={900}
        className="mt-5 aspect-[16/10] w-full rounded-xl object-cover"
      />
      <div className="mt-6 space-y-4 text-[1.05rem] leading-8 text-foreground/90">
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
          const value = email.trim().toLowerCase();
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return;
          subscribe.mutate(value);
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
          className="input-soft min-w-0"
        />
        <button
          type="submit"
          disabled={subscribe.isPending}
          className="grid shrink-0 place-items-center rounded-full bg-primary px-5 text-primary-foreground disabled:opacity-60"
          aria-label="Subscribe"
        >
          <ArrowRight size={16} />
        </button>
      </form>
      {subscribe.isSuccess && (
        <p className="mt-3 text-sm text-primary">You're in. Welcome to the quiet.</p>
      )}
      {subscribe.isError && (
        <p className="mt-3 text-sm text-muted-foreground">
          {(subscribe.error as Error).message}
        </p>
      )}


      <p className="mt-8 text-sm text-muted-foreground">
        For any enquiry or feedback:{" "}
        <a href="mailto:mailtenaosis@gmail.com" className="text-primary underline underline-offset-4">
          mailtenaosis@gmail.com
        </a>
      </p>
    </div>
  );
}
