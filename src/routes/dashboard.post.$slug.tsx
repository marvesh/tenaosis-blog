import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ImagePlus, Trash2 } from "lucide-react";
import { useAdmin } from "@/lib/admin-context";
import { useBlog, slugify } from "@/lib/blog-store";
import type { Post } from "@/data/posts";

export const Route = createFileRoute("/dashboard/post/$slug")({
  head: () => ({
    meta: [
      { title: "Compose a post — Tenaosis" },
      { name: "description", content: "Private post composer for the Tenaosis journal." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Compose a post — Tenaosis" },
      { property: "og:description", content: "Private post composer for the Tenaosis journal." },
    ],
  }),
  component: PostEditor,
});

const blankPost = (): Post => ({
  id: crypto.randomUUID(),
  slug: "",
  title: "",
  excerpt: "",
  quote: "",
  image: "",
  date: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
  readingTime: "4 min",
  featured: false,
  published: false,
  body: [],
});

function PostEditor() {
  const { slug } = Route.useParams();
  const { isAdmin, ready } = useAdmin();
  const navigate = useNavigate();
  const { posts, savePost, deletePost } = useBlog();

  const existing = useMemo(
    () => posts.find((p) => p.slug === slug) ?? posts.find((p) => p.id === slug),
    [posts, slug],
  );
  const [draft, setDraft] = useState<Post>(() => existing ?? blankPost());
  const [loaded, setLoaded] = useState(Boolean(existing) || slug === "new");

  useEffect(() => {
    if (!loaded && existing) {
      setDraft(existing);
      setLoaded(true);
    }
  }, [existing, loaded]);

  useEffect(() => {
    if (ready && !isAdmin) void navigate({ to: "/admin" });
  }, [ready, isAdmin, navigate]);

  if (!ready || !isAdmin) return null;

  const isNew = slug === "new" || !existing;

  const onImage = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setDraft((d) => ({ ...d, image: String(reader.result) }));
    reader.readAsDataURL(file);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.title.trim()) return;
    savePost({
      ...draft,
      slug: draft.slug.trim() || slugify(draft.title),
      body: draft.body.length ? draft.body : [draft.excerpt].filter(Boolean),
    });
    void navigate({ to: "/dashboard" });
  };

  return (
    <div className="mx-auto max-w-3xl px-5 py-8 sm:py-12">
      <Link to="/dashboard" className="inline-flex items-center gap-1 label-caps text-muted-foreground">
        <ArrowLeft size={12} /> Back to dashboard
      </Link>
      <h1 className="mt-3 text-3xl sm:text-4xl">{isNew ? "Write a new post" : "Edit post"}</h1>

      <form onSubmit={submit} className="mt-6 space-y-5">
        <Field label="Title">
          <input
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            placeholder="The invisible tether"
            className="input-soft"
            required
          />
        </Field>

        <Field label="Quote / excerpt">
          <input
            value={draft.excerpt}
            onChange={(e) => setDraft({ ...draft, excerpt: e.target.value })}
            placeholder="A short line that sits under the title"
            className="input-soft"
          />
        </Field>

        <Field label="Pull quote (optional)">
          <textarea
            value={draft.quote ?? ""}
            onChange={(e) => setDraft({ ...draft, quote: e.target.value })}
            rows={2}
            placeholder="A sentence to highlight inside the article"
            className="input-soft"
          />
        </Field>

        <Field label="Cover image">
          <div className="space-y-3">
            {draft.image && (
              <div className="relative">
                <img
                  src={draft.image}
                  alt="Cover preview"
                  className="aspect-[16/10] w-full rounded-xl object-cover"
                />
                <button
                  type="button"
                  onClick={() => setDraft({ ...draft, image: "" })}
                  aria-label="Remove image"
                  className="absolute right-3 top-3 rounded-full bg-background/90 p-2 text-destructive"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )}
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-primary px-4 py-2 label-caps text-primary">
              <ImagePlus size={14} /> Upload image
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => onImage(e.target.files?.[0])}
              />
            </label>
            <input
              value={draft.image.startsWith("data:") ? "" : draft.image}
              onChange={(e) => setDraft({ ...draft, image: e.target.value })}
              placeholder="…or paste an image URL"
              className="input-soft"
            />
          </div>
        </Field>

        <Field label="Content">
          <textarea
            value={draft.body.join("\n\n")}
            onChange={(e) =>
              setDraft({ ...draft, body: e.target.value.split(/\n{2,}/).filter(Boolean) })
            }
            rows={14}
            placeholder="Write the article — separate paragraphs with a blank line."
            className="input-soft"
          />
        </Field>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Reading time">
            <input
              value={draft.readingTime}
              onChange={(e) => setDraft({ ...draft, readingTime: e.target.value })}
              className="input-soft"
            />
          </Field>
          <Field label="URL slug">
            <input
              value={draft.slug}
              onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
              placeholder={slugify(draft.title) || "auto-generated"}
              className="input-soft"
            />
          </Field>
        </div>

        <div className="flex flex-wrap items-center gap-5">
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={draft.published}
              onChange={(e) => setDraft({ ...draft, published: e.target.checked })}
            />
            Publish immediately
          </label>
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={draft.featured}
              onChange={(e) => setDraft({ ...draft, featured: e.target.checked })}
            />
            Feature on home
          </label>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <button type="submit" className="pill">
            {isNew ? "Create post" : "Save changes"}
          </button>
          {!isNew && (
            <button
              type="button"
              onClick={() => {
                if (confirm(`Delete "${draft.title}"?`)) {
                  deletePost(draft.id);
                  void navigate({ to: "/dashboard" });
                }
              }}
              className="rounded-full border border-border px-4 py-1.5 label-caps text-destructive"
            >
              Delete post
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="label-caps text-muted-foreground">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
