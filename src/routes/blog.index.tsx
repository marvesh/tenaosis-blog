import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search } from "lucide-react";
import { PostCard } from "@/components/post-card";
import { useBlog } from "@/lib/blog-store";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "The Journal — Tenaosis" },
      {
        name: "description",
        content: "Every Tenaosis essay on attention, silence, sensory life and digital boundaries.",
      },
      { property: "og:title", content: "The Journal — Tenaosis" },
      {
        property: "og:description",
        content: "Every Tenaosis essay on attention, silence and digital boundaries.",
      },
      { property: "og:url", content: "https://tenaosis-blog.lovable.app/blog" },
    ],
    links: [{ rel: "canonical", href: "https://tenaosis-blog.lovable.app/blog" }],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  const { publishedPosts } = useBlog();
  const [query, setQuery] = useState("");
  const results = publishedPosts.filter((p) =>
    (p.title + (p.sub_content || p.excerpt || "")).toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <div className="mx-auto max-w-5xl px-5 py-8 sm:py-12">
      <h1 className="text-3xl sm:text-4xl">The Journal</h1>

      <div className="mt-5 grid grid-cols-[minmax(0,1fr)_auto] gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search with keywords"
          aria-label="Search articles"
          className="input-soft min-w-0"
        />
        <span className="grid shrink-0 place-items-center rounded-full bg-primary px-4 text-primary-foreground">
          <Search size={15} />
        </span>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
        {results.map((post) => (
          <PostCard key={post.id} post={post} compact />
        ))}
      </div>
      {results.length === 0 && (
        <p className="mt-8 text-sm text-muted-foreground">Nothing matches that search yet.</p>
      )}
    </div>
  );
}
