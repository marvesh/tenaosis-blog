import { createContext, useCallback, useContext, useMemo } from "react";
import type { ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Post } from "@/data/posts";
import type { ApiPost } from "@/lib/api";
import * as apiClient from "@/lib/api";
import { useAdmin } from "@/lib/admin-context";
import fallbackA from "@/assets/about-balance.jpg";
import fallbackB from "@/assets/science-of-silence.jpg";
import fallbackC from "@/assets/notflix-and-knit.jpg";
import fallbackD from "@/assets/sensory-poverty.jpg";

const fallbacks = [fallbackA, fallbackB, fallbackC, fallbackD];

export function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const formatDate = (iso?: string | null) =>
  iso
    ? new Date(iso).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
    : "";

const readingTime = (content: string) =>
  `${Math.max(1, Math.round(content.split(/\s+/).filter(Boolean).length / 200))} min`;

export function mapPost(post: ApiPost, index = 0): Post {
  const content = post.content ?? "";
  const body = content
    .split(/\n{2,}|\r\n\r\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  const base = slugify(post.title) || `post-${post.id}`;
  const subContent = post.sub_content?.trim() || "";

  return {
    id: String(post.id),
    slug: base,
    title: post.title,
    sub_content: subContent,
    excerpt: subContent,
    quote: post.quote ?? "",
    image: post.image_url || fallbacks[index % fallbacks.length]!,
    date: formatDate(post.created_at),
    readingTime: readingTime(content),
    featured: false,
    published: post.blog_status?.toLowerCase() === "published",
    body,
  };
}

type BlogStore = {
  posts: Post[];
  publishedPosts: Post[];
  featuredPost: Post | undefined;
  loading: boolean;
  error: string | null;
  postIdOf: (slugOrId: string) => number | undefined;
  deletePost: (id: string) => void;
  togglePublished: (id: string) => void;
  refresh: () => void;
};

const BlogContext = createContext<BlogStore | null>(null);

export function BlogProvider({ children }: { children: ReactNode }) {
  const { isAdmin } = useAdmin();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["posts", isAdmin ? "all" : "published"],
    queryFn: async () => {
      try {
        return await apiClient.listPosts(isAdmin ? undefined : "published");
      } catch (err) {
        if (err instanceof apiClient.ApiError && (err.status === 401 || err.status === 403)) {
          return [] as ApiPost[];
        }
        throw err;
      }
    },
    staleTime: 30_000,
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10_000),
  });

  const invalidate = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: ["posts"] });
  }, [queryClient]);

  const removeMutation = useMutation({
    mutationFn: (id: number) => apiClient.deletePost(id),
    onSuccess: invalidate,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      apiClient.updatePost(id, { title: "", blog_status: status } as apiClient.PostInput),
    onSuccess: invalidate,
  });

  const value = useMemo<BlogStore>(() => {
    const posts = (query.data ?? []).map((p, i) => mapPost(p, i));
    const publishedPosts = posts.filter((p) => p.published);
    const featured = publishedPosts[0];
    if (featured) featured.featured = true;

    return {
      posts,
      publishedPosts,
      featuredPost: featured,
      loading: query.isLoading,
      error: query.error ? (query.error as Error).message : null,
      postIdOf: (slugOrId) => {
        const match = posts.find((p) => p.slug === slugOrId || p.id === slugOrId);
        return match ? Number(match.id) : undefined;
      },
      deletePost: (id) => removeMutation.mutate(Number(id)),
      togglePublished: (id) => {
        const post = posts.find((p) => p.id === id);
        if (!post) return;
        statusMutation.mutate({
          id: Number(id),
          status: post.published ? "draft" : "published",
        });
      },
      refresh: invalidate,
    };
  }, [query.data, query.isLoading, query.error, removeMutation, statusMutation, invalidate]);

  return <BlogContext.Provider value={value}>{children}</BlogContext.Provider>;
}

export function useBlog() {
  const ctx = useContext(BlogContext);
  if (!ctx) throw new Error("useBlog must be used inside BlogProvider");
  return ctx;
}
