import { Link } from "@tanstack/react-router";
import type { Post } from "@/data/posts";

export function PostCard({ post, compact = false }: { post: Post; compact?: boolean }) {
  return (
    <article className="group">
      <Link to="/blog/$slug" params={{ slug: post.slug }} className="block">
        <img
          src={post.image}
          alt={post.title}
          loading="lazy"
          width={1280}
          height={860}
          className={`w-full object-cover transition-opacity group-hover:opacity-90 ${
            compact ? "aspect-square" : "aspect-[4/3]"
          }`}
        />
        <h3 className={`mt-3 ${compact ? "text-base" : "text-xl"}`}>{post.title}</h3>
      </Link>
      {!compact && (
        <>
          <p className="mt-1 text-sm text-muted-foreground">{post.excerpt}</p>
          <Link
            to="/blog/$slug"
            params={{ slug: post.slug }}
            className="pill mt-3"
            aria-label={`Read ${post.title}`}
          >
            Read →
          </Link>
        </>
      )}
    </article>
  );
}
