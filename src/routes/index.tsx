import { createFileRoute, Link } from "@tanstack/react-router";
import { Share2 } from "lucide-react";
import { PostCard } from "@/components/post-card";
import { useBlog } from "@/lib/blog-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tenaosis — Quiet living in a loud digital world" },
      {
        name: "description",
        content:
          "Essays on attention, silence and natural rhythms. Tenaosis is a slow journal for people learning to live gently with technology.",
      },
      { property: "og:title", content: "Tenaosis — Quiet living in a loud digital world" },
      {
        property: "og:description",
        content: "Essays on attention, silence and natural rhythms for a calmer digital life.",
      },
      { property: "og:url", content: "https://tenaosis-blog.lovable.app/" },
    ],
    links: [{ rel: "canonical", href: "https://tenaosis-blog.lovable.app/" }],
  }),
  component: Home,
});

function Home() {
  const { publishedPosts, featuredPost } = useBlog();
  const rest = publishedPosts.filter((p) => p.id !== featuredPost?.id);

  return (
    <div className="mx-auto max-w-5xl px-5 py-8 sm:py-12">
      <section className="mx-auto max-w-2xl text-center">
        <h1 className="sr-only">Quiet living in a loud digital world</h1>
        <p className="text-base font-medium leading-relaxed text-foreground sm:text-lg">
          Technology isn't the villain — it's a lack of boundaries. When we prioritise the digital
          over the biological, we stop living and start becoming mechanical. Natural living is messy,
          slow and tactile; tech is clean, fast and sterile. In the balance between the two, you find
          healthy living.
        </p>
      </section>

      {featuredPost && (
        <section className="mx-auto mt-12 max-w-3xl border-t border-border pt-8">
          <span className="label-caps text-muted-foreground">Featured</span>
          <h2 className="mt-2 text-3xl sm:text-5xl">{featuredPost.title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{featuredPost.sub_content || featuredPost.excerpt}</p>
          <img
            src={featuredPost.image}
            alt={featuredPost.title}
            width={1280}
            height={720}
            className="mt-5 aspect-video w-full rounded-xl object-cover"
          />
          <div className="prose-editorial mt-6 text-[1.05rem] leading-8 text-foreground/90">
            {featuredPost.body.slice(0, 4).map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
          <button
            type="button"
            className="pill mt-4"
            onClick={() => {
              const url = `${window.location.origin}/blog/${featuredPost.slug}`;
              if (navigator.share) {
                void navigator.share({ title: featuredPost.title, url });
              } else {
                void navigator.clipboard.writeText(url);
              }
            }}
          >
            Share <Share2 size={12} />
          </button>
        </section>
      )}

      <section className="mt-14 border-t border-border pt-8">
        <h2 className="text-2xl">More from the journal</h2>
        <div className="mt-6 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>

      <section className="mt-14 border-t border-border pt-8 text-center">
        <h2 className="text-2xl">Join us</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          A recurring reminder that the world outside the screen is still waiting for you.
        </p>
        <Link to="/newsletter" className="pill mt-4">
          Subscribe →
        </Link>
      </section>
    </div>
  );
}
