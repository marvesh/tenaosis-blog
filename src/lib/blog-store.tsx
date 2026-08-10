import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { demoPosts, type Post } from "@/data/posts";

const STORAGE_KEY = "tenaosis.blog.v1";

type Subscriber = { email: string; date: string };

type BlogState = {
  posts: Post[];
  subscribers: Subscriber[];
};

type BlogStore = BlogState & {
  publishedPosts: Post[];
  featuredPost: Post | undefined;
  savePost: (post: Post) => void;
  deletePost: (id: string) => void;
  toggleFeatured: (id: string) => void;
  togglePublished: (id: string) => void;
  addSubscriber: (email: string) => boolean;
  removeSubscriber: (email: string) => void;
};

const BlogContext = createContext<BlogStore | null>(null);

const initialState: BlogState = { posts: demoPosts, subscribers: [] };

export function BlogProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<BlogState>(initialState);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setState(JSON.parse(raw) as BlogState);
    } catch {
      /* ignore corrupt demo data */
    }
  }, []);

  const update = useCallback((next: (prev: BlogState) => BlogState) => {
    setState((prev) => {
      const value = next(prev);
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
      } catch {
        /* storage unavailable */
      }
      return value;
    });
  }, []);

  const value = useMemo<BlogStore>(() => {
    const publishedPosts = state.posts.filter((p) => p.published);
    return {
      ...state,
      publishedPosts,
      featuredPost: publishedPosts.find((p) => p.featured) ?? publishedPosts[0],
      savePost: (post) =>
        update((prev) => ({
          ...prev,
          posts: prev.posts.some((p) => p.id === post.id)
            ? prev.posts.map((p) => (p.id === post.id ? post : p))
            : [post, ...prev.posts],
        })),
      deletePost: (id) =>
        update((prev) => ({ ...prev, posts: prev.posts.filter((p) => p.id !== id) })),
      toggleFeatured: (id) =>
        update((prev) => ({
          ...prev,
          posts: prev.posts.map((p) => ({ ...p, featured: p.id === id ? !p.featured : false })),
        })),
      togglePublished: (id) =>
        update((prev) => ({
          ...prev,
          posts: prev.posts.map((p) => (p.id === id ? { ...p, published: !p.published } : p)),
        })),
      addSubscriber: (email) => {
        const clean = email.trim().toLowerCase();
        if (!clean || state.subscribers.some((s) => s.email === clean)) return false;
        update((prev) => ({
          ...prev,
          subscribers: [
            { email: clean, date: new Date().toISOString().slice(0, 10) },
            ...prev.subscribers,
          ],
        }));
        return true;
      },
      removeSubscriber: (email) =>
        update((prev) => ({
          ...prev,
          subscribers: prev.subscribers.filter((s) => s.email !== email),
        })),
    };
  }, [state, update]);

  return <BlogContext.Provider value={value}>{children}</BlogContext.Provider>;
}

export function useBlog() {
  const ctx = useContext(BlogContext);
  if (!ctx) throw new Error("useBlog must be used inside BlogProvider");
  return ctx;
}

export function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
