import { Link } from "@tanstack/react-router";
import { ChevronRight, Pencil, Trash2 } from "lucide-react";
import type { Post } from "@/data/posts";
import { useAdmin } from "@/lib/admin-context";
import { useBlog } from "@/lib/blog-store";

export function PostCard({ post, compact = false }: { post: Post; compact?: boolean }) {
  const { isAdmin } = useAdmin();
  const { deletePost } = useBlog();

  return (
    <article className="group relative">
      <Link to="/blog/$slug" params={{ slug: post.slug }} className="block">
        <img
          src={post.image}
          alt={post.title}
          loading="lazy"
          width={1280}
          height={720}
          className={`w-full rounded-xl object-cover transition-opacity group-hover:opacity-90 ${
            compact ? "aspect-[4/3] sm:aspect-[3/4]" : "aspect-[16/9] sm:aspect-[3/2]"
          }`}
        />
        <h3 className={`mt-3 ${compact ? "text-base" : "text-xl"}`}>{post.title}</h3>
      </Link>

      {isAdmin && (
        <div className="absolute right-2 top-2 flex gap-1.5">
          <Link
            to="/dashboard/post/$slug"
            params={{ slug: post.slug }}
            aria-label={`Edit ${post.title}`}
            title="Edit"
            className="rounded-full bg-background/90 p-2 text-primary shadow-sm backdrop-blur transition-colors hover:bg-background"
          >
            <Pencil size={14} />
          </Link>
          <button
            type="button"
            aria-label={`Delete ${post.title}`}
            title="Delete"
            onClick={() => {
              if (confirm(`Delete "${post.title}"?`)) deletePost(post.id);
            }}
            className="rounded-full bg-background/90 p-2 text-destructive shadow-sm backdrop-blur transition-colors hover:bg-background"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}

      {!compact && (
        <>
          <p className="mt-1 text-sm text-muted-foreground">{post.excerpt}</p>
          <Link
            to="/blog/$slug"
            params={{ slug: post.slug }}
            className="pill mt-3"
            aria-label={`Read ${post.title}`}
          >
            Read <ChevronRight size={12} />
          </Link>
        </>
      )}
    </article>
  );
}
