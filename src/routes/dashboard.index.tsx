import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Plus, Pencil, Trash2, Star, Eye, EyeOff, Users, FileText, Sparkles } from "lucide-react";
import { useAdmin } from "@/lib/admin-context";
import { useBlog } from "@/lib/blog-store";

export const Route = createFileRoute("/dashboard/")({
  head: () => ({
    meta: [
      { title: "Editor Dashboard — Tenaosis" },
      { name: "description", content: "Private editor dashboard for the Tenaosis journal." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Editor Dashboard — Tenaosis" },
      { property: "og:description", content: "Private editor dashboard for the Tenaosis journal." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { isAdmin, ready } = useAdmin();
  const navigate = useNavigate();
  const { posts, subscribers, featuredPost, deletePost, toggleFeatured, togglePublished, removeSubscriber } =
    useBlog();

  useEffect(() => {
    if (ready && !isAdmin) void navigate({ to: "/admin" });
  }, [ready, isAdmin, navigate]);

  if (!ready || !isAdmin) return null;

  const published = posts.filter((p) => p.published);

  return (
    <div className="mx-auto max-w-5xl px-5 py-8 sm:py-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="pill">Admin mode</span>
          <h1 className="mt-2 text-3xl sm:text-4xl">Editor's desk</h1>
        </div>
        <Link to="/dashboard/post/$slug" params={{ slug: "new" }} className="pill">
          <Plus size={12} /> New post
        </Link>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Stat icon={<FileText size={16} />} label="Total posts" value={posts.length} />
        <Stat icon={<Sparkles size={16} />} label="Published" value={published.length} />
        <Stat icon={<Users size={16} />} label="Subscribers" value={subscribers.length} />
      </div>

      <section className="mt-10">
        <h2 className="text-2xl">Featured right now</h2>
        {featuredPost ? (
          <div className="mt-4 grid gap-4 rounded-xl border border-border bg-card p-4 sm:grid-cols-[200px_minmax(0,1fr)]">
            {featuredPost.image && (
              <img
                src={featuredPost.image}
                alt={featuredPost.title}
                className="aspect-[4/3] w-full rounded-xl object-cover"
              />
            )}
            <div className="min-w-0">
              <h3 className="text-xl">{featuredPost.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{featuredPost.excerpt}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  to="/dashboard/post/$slug"
                  params={{ slug: featuredPost.id }}
                  className="rounded-full border border-primary px-3 py-1.5 label-caps text-primary"
                >
                  Edit
                </Link>
                <Link
                  to="/blog/$slug"
                  params={{ slug: featuredPost.slug }}
                  className="rounded-full border border-border px-3 py-1.5 label-caps text-muted-foreground"
                >
                  View
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">No featured post yet.</p>
        )}
      </section>

      <section className="mt-10">
        <h2 className="text-2xl">All posts</h2>
        <ul className="mt-4 space-y-3">
          {posts.map((post) => (
            <li
              key={post.id}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-border bg-card p-3"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">{post.title}</p>
                <p className="label-caps text-muted-foreground">
                  {post.published ? "Published" : "Draft"}
                  {post.featured ? " · Featured" : ""} · {post.date}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <IconButton label="Feature" onClick={() => toggleFeatured(post.id)} active={post.featured}>
                  <Star size={14} />
                </IconButton>
                <IconButton
                  label={post.published ? "Unpublish" : "Publish"}
                  onClick={() => togglePublished(post.id)}
                  active={post.published}
                >
                  {post.published ? <Eye size={14} /> : <EyeOff size={14} />}
                </IconButton>
                <Link
                  to="/dashboard/post/$slug"
                  params={{ slug: post.id }}
                  aria-label="Edit post"
                  title="Edit"
                  className="rounded-full border border-border p-1.5 text-muted-foreground hover:text-primary"
                >
                  <Pencil size={14} />
                </Link>
                <IconButton
                  label="Delete"
                  danger
                  onClick={() => {
                    if (confirm(`Delete "${post.title}"?`)) deletePost(post.id);
                  }}
                >
                  <Trash2 size={14} />
                </IconButton>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl">Subscribers</h2>
        <ul className="mt-4 space-y-2">
          {subscribers.length === 0 && (
            <li className="text-sm text-muted-foreground">No subscribers yet.</li>
          )}
          {subscribers.map((sub) => (
            <li
              key={sub.email}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-border bg-card px-3 py-2"
            >
              <div className="min-w-0">
                <p className="truncate text-sm text-foreground">{sub.email}</p>
                <p className="label-caps text-muted-foreground">Joined {sub.date}</p>
              </div>
              <IconButton label="Remove" danger onClick={() => removeSubscriber(sub.email)}>
                <Trash2 size={14} />
              </IconButton>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <span className="flex items-center gap-2 label-caps text-muted-foreground">
        {icon} {label}
      </span>
      <p className="mt-1 font-display text-3xl text-primary">{value}</p>
    </div>
  );
}

function IconButton({
  children,
  label,
  onClick,
  active,
  danger,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`rounded-full border p-1.5 transition-colors ${
        danger
          ? "border-border text-destructive hover:bg-destructive/10"
          : active
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border text-muted-foreground hover:text-primary"
      }`}
    >
      {children}
    </button>
  );
}
