import { createFileRoute } from "@tanstack/react-router";
import aboutImage from "@/assets/about-balance.jpg";

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
      { property: "og:url", content: "https://cozy-cms-corner-67.lovable.app/about" },
    ],
    links: [{ rel: "canonical", href: "https://cozy-cms-corner-67.lovable.app/about" }],
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
        className="mt-5 aspect-[16/10] w-full object-cover"
      />
      <div className="mt-6 space-y-4 text-[0.95rem] text-foreground/90">
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
    </div>
  );
}
