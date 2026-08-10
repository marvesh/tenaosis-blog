import { useState } from "react";
import { Star, Trash2, Eye, EyeOff, Pencil, Plus, X } from "lucide-react";
import { useBlog, slugify } from "@/lib/blog-store";
import { useAdmin } from "@/lib/admin-context";
import type { Post } from "@/data/posts";

const blankPost = (): Post => ({
  id: crypto.randomUUID(),
  slug: "",
  title: "",
  excerpt: "",
  image: "",
  date: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
  readingTime: "4 min",
  featured: false,
  published: false,
  body: [],
});

export function AdminPanel() {
  const { isAdmin, signOut } = useAdmin();
  const { posts, subscribers, savePost, deletePost, toggleFeatured, togglePublished, removeSubscriber } =
    useBlog();
  const [draft, setDraft] = useState<Post | null>(null);
  const [tab, setTab] = useState<"posts" | "subscribers">("posts");

  if (!isAdmin) return null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft || !draft.title.trim()) return;
    savePost({
      ...draft,
      slug: draft.slug.trim() || slugify(draft.title),
      body: draft.body.length ? draft.body : [draft.excerpt],
    });
    setDraft(null);
  };

  return (
    <section className="mb-12 border border-primary/30 bg-secondary/60 p-4 sm:p-6">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:flex sm:justify-between">
        <div className="min-w-0">
          <span className="pill">Admin mode</span>
          <h2 className="mt-2 truncate text-xl">Editor's desk</h2>
        </div>
        <button type="button" onClick={() => void signOut()} className="label-caps shrink-0 text-muted-foreground hover:text-primary">
          Exit
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {(["posts", "subscribers"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`label-caps border px-3 py-1.5 ${
              tab === t
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground"
            }`}
          >
            {t === "posts" ? `Posts (${posts.length})` : `Subscribers (${subscribers.length})`}
          </button>
        ))}
        {tab === "posts" && (
          <button
            type="button"
            onClick={() => setDraft(blankPost())}
            className="label-caps ml-auto inline-flex items-center gap-1 border border-primary px-3 py-1.5 text-primary"
          >
            <Plus size={12} /> New post
          </button>
        )}
      </div>

      {draft && (
        <form onSubmit={submit} className="mt-4 space-y-3 border border-border bg-background p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg">{posts.some((p) => p.id === draft.id) ? "Edit post" : "New post"}</h3>
            <button type="button" onClick={() => setDraft(null)} aria-label="Close editor">
              <X size={16} className="text-muted-foreground" />
            </button>
          </div>
          <input
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            placeholder="Title"
            className="w-full border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          />
          <input
            value={draft.excerpt}
            onChange={(e) => setDraft({ ...draft, excerpt: e.target.value })}
            placeholder="Short excerpt"
            className="w-full border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          />
          <input
            value={draft.image}
            onChange={(e) => setDraft({ ...draft, image: e.target.value })}
            placeholder="Cover image URL (optional)"
            className="w-full border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          />
          <textarea
            value={draft.body.join("\n\n")}
            onChange={(e) => setDraft({ ...draft, body: e.target.value.split(/\n{2,}/).filter(Boolean) })}
            placeholder="Article body — separate paragraphs with a blank line"
            rows={6}
            className="w-full border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          />
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={draft.published}
              onChange={(e) => setDraft({ ...draft, published: e.target.checked })}
            />
            Publish immediately
          </label>
          <button type="submit" className="pill">
            Save post
          </button>
        </form>
      )}

      {tab === "posts" ? (
        <ul className="mt-4 divide-y divide-border border-t border-border">
          {posts.map((post) => (
            <li key={post.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-3">
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
                <IconButton label="Edit" onClick={() => setDraft(post)}>
                  <Pencil size={14} />
                </IconButton>
                <IconButton label="Delete" onClick={() => deletePost(post.id)} danger>
                  <Trash2 size={14} />
                </IconButton>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="mt-4 divide-y divide-border border-t border-border">
          {subscribers.length === 0 && (
            <li className="py-4 text-sm text-muted-foreground">No subscribers yet.</li>
          )}
          {subscribers.map((sub) => (
            <li key={sub.email} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm text-foreground">{sub.email}</p>
                <p className="label-caps text-muted-foreground">Joined {sub.date}</p>
              </div>
              <IconButton label="Remove" onClick={() => removeSubscriber(sub.email)} danger>
                <Trash2 size={14} />
              </IconButton>
            </li>
          ))}
        </ul>
      )}
    </section>
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
      className={`border p-1.5 transition-colors ${
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
