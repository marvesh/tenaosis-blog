import { createFileRoute, Link } from "@tanstack/react-router";
import { PostCard } from "@/components/post-card";
import { useBlog } from "@/lib/blog-store";

export const Route = createFileRoute("/blog/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug.replace(/-/g, " ")} — Tenaosis` },
      { name: "description", content: "An essay from the Tenaosis journal on living gently with technology." },
      { property: "og:title", content: `${params.slug.replace(/-/g, " ")} — Tenaosis` },
      {
        property: "og:description",
        content: "An essay from the Tenaosis journal on living gently with technology.",
      },
    ],
  }),
  component: Article,
});

function Article() {
  const { slug } = Route.useParams();
  const { publishedPosts } = useBlog();
  const post = publishedPosts.find((p) => p.slug === slug);
  const more = publishedPosts.filter((p) => p.slug !== slug).slice(0, 3);

  if (!post) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-20 text-center">
        <h1 className="text-3xl">Article not found</h1>
        <Link to="/blog" className="pill mt-6">
          Back to the journal
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-8 sm:py-12">
      <article>
        <h1 className="text-3xl sm:text-4xl">{post.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{post.excerpt}</p>
        <p className="label-caps mt-2 text-muted-foreground">
          {post.date} · {post.readingTime} read
        </p>
        {post.image && (
          <img
            src={post.image}
            alt={post.title}
            width={1280}
            height={860}
            className="mt-5 aspect-[16/10] w-full object-cover"
          />
        )}
        <div className="prose-editorial mt-6 text-[0.95rem] text-foreground/90">
          {post.body.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </article>

      <section className="mt-14 border-t border-border pt-8">
        <h2 className="text-xl">Keep reading</h2>
        <div className="mt-5 grid gap-8 sm:grid-cols-3">
          {more.map((p) => (
            <PostCard key={p.id} post={p} compact />
          ))}
        </div>
      </section>
    </div>
  );
}
