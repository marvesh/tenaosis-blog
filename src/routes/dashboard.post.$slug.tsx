import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ImagePlus, Trash2 } from "lucide-react";
import { useAdmin } from "@/lib/admin-context";
import { useBlog } from "@/lib/blog-store";
import { createPost, updatePost, type PostInput } from "@/lib/api";

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

function PostEditor() {
  const { slug } = Route.useParams();
  const { isAdmin, ready } = useAdmin();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { posts, deletePost } = useBlog();

  const existing = useMemo(
    () => posts.find((p) => p.slug === slug) ?? posts.find((p) => p.id === slug),
    [posts, slug],
  );
  const isNew = slug === "new";

  const [title, setTitle] = useState("");
  const [quote, setQuote] = useState("");
  const [subContent, setSubContent] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [hydrated, setHydrated] = useState(isNew);

  useEffect(() => {
    if (!hydrated && existing) {
      setTitle(existing.title);
      setQuote(existing.quote ?? "");
      setSubContent(existing.sub_content || existing.excerpt || "");
      setContent(existing.body.join("\n\n"));
      setPublished(existing.published);
      setPreview(existing.image);
      setHydrated(true);
    }
  }, [existing, hydrated]);

  useEffect(() => {
    if (ready && !isAdmin) void navigate({ to: "/admin" });
  }, [ready, isAdmin, navigate]);

  const save = useMutation({
    mutationFn: async () => {
      const payload: PostInput = {
        title: title.trim(),
        quote: quote.trim(),
        sub_content: subContent.trim(),
        content: content.trim(),
        blog_status: published ? "published" : "draft",
        image,
      };
      if (isNew || !existing) return createPost({ ...payload, title: title.trim() });
      return updatePost(Number(existing.id), payload);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["posts"] });
      void navigate({ to: "/dashboard" });
    },
  });

  if (!ready || !isAdmin) return null;

  const onImage = (file: File | undefined) => {
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  return (
    <div className="mx-auto max-w-3xl px-5 py-8 sm:py-12">
      <Link to="/dashboard" className="inline-flex items-center gap-1 label-caps text-muted-foreground">
        <ArrowLeft size={13} /> Back to dashboard
      </Link>
      <h1 className="mt-3 text-3xl sm:text-4xl">{isNew ? "New post" : "Edit post"}</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (title.trim()) save.mutate();
        }}
        className="mt-6 space-y-4"
      >
        <Field label="Title">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="A title worth pausing for"
            className="input-soft"
            required
          />
        </Field>

        <Field label="Pull quote">
          <input
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            placeholder="One line readers will remember"
            className="input-soft"
          />
        </Field>

        <Field label="Short summary">
          <input
            value={subContent}
            onChange={(e) => setSubContent(e.target.value)}
            placeholder="Shown on cards and previews"
            className="input-soft"
          />
        </Field>

        <Field label="Cover image">
          <div className="flex flex-wrap items-center gap-3">
            <label className="pill cursor-pointer">
              <ImagePlus size={13} /> Choose image
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => onImage(e.target.files?.[0])}
              />
            </label>
            {preview && (
              <img src={preview} alt="Cover preview" className="h-16 w-24 rounded-lg object-cover" />
            )}
          </div>
        </Field>

        <Field label="Content">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={16}
            placeholder="Write freely. Leave a blank line between paragraphs."
            className="input-soft"
          />
        </Field>

        <label className="flex items-center gap-2 text-sm text-foreground">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
          />
          Publish immediately
        </label>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button type="submit" disabled={save.isPending} className="pill disabled:opacity-60">
            {save.isPending ? "Saving…" : "Save post"}
          </button>
          {!isNew && existing && (
            <button
              type="button"
              onClick={() => {
                if (confirm(`Delete "${existing.title}"?`)) {
                  deletePost(existing.id);
                  void navigate({ to: "/dashboard" });
                }
              }}
              className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 label-caps text-destructive"
            >
              <Trash2 size={13} /> Delete
            </button>
          )}
        </div>
      </form>

      {save.isError && (
        <p className="mt-4 text-sm text-destructive">{(save.error as Error).message}</p>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <span className="label-caps text-muted-foreground">{label}</span>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}
