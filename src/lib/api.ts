export const API_URL = "https://tenaosis-fastapi-production.up.railway.app";

const TOKEN_KEY = "tenaosis.access_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string | null) {
  if (typeof window === "undefined") return;
  try {
    if (token) window.localStorage.setItem(TOKEN_KEY, token);
    else window.localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* storage unavailable */
  }
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

type RequestOptions = {
  method?: string;
  body?: unknown;
  auth?: boolean;
};

export async function api<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, auth = false } = options;
  const headers: Record<string, string> = { accept: "application/json" };

  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  let payload: BodyInit | undefined;
  if (body instanceof FormData) {
    payload = body;
  } else if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }

  const res = await fetch(`${API_URL}${path}`, { method, headers, body: payload });

  if (res.status === 204) return undefined as T;

  const text = await res.text();
  const data: unknown = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const detail =
      typeof data === "object" && data !== null && "detail" in data
        ? (data as { detail: unknown }).detail
        : null;
    const message =
      typeof detail === "string"
        ? detail
        : Array.isArray(detail) && detail[0] && typeof detail[0] === "object"
          ? String((detail[0] as { msg?: string }).msg ?? "Request failed")
          : `Request failed (${res.status})`;
    throw new ApiError(res.status, message);
  }

  return data as T;
}

/* ---------- types mirrored from the FastAPI schema ---------- */

export type ApiUser = {
  id: number;
  user_name?: string | null;
  email: string;
  role: string;
  created_at?: string | null;
};

export type ApiPost = {
  id: number;
  title: string;
  quote?: string | null;
  sub_content?: string | null;
  content: string;
  image_url?: string | null;
  blog_status: string;
  owner_id: number;
  owner?: ApiUser | null;
  like_count?: number;
  has_liked?: boolean;
  created_at?: string | null;
  updated_at?: string | null;
};

export type ApiNewsletterIssue = {
  id: number;
  title: string;
  content: string;
  author_id: number;
  created_at?: string | null;
  sent_at?: string | null;
};

/* ---------- auth ---------- */

export const login = (email: string, password: string) =>
  api<{ access_token: string; token_type: string }>("/auth/login", {
    method: "POST",
    body: { email, password },
  });

export const getMe = () => api<ApiUser>("/auth/me", { auth: true });

/* ---------- posts ---------- */

export const listPosts = (blogStatus?: string) =>
  api<ApiPost[]>(`/posts/${blogStatus ? `?blog_status=${encodeURIComponent(blogStatus)}` : ""}`, {
    auth: true,
  });

export const getPost = (id: number) => api<ApiPost>(`/posts/${id}`, { auth: true });

export type PostInput = {
  title: string;
  quote?: string;
  sub_content?: string;
  content?: string;
  blog_status?: string;
  image?: File | null;
};

function toFormData(input: PostInput) {
  const fd = new FormData();
  fd.append("title", input.title);
  if (input.quote !== undefined) fd.append("quote", input.quote);
  if (input.sub_content !== undefined) fd.append("sub_content", input.sub_content);
  if (input.content !== undefined) fd.append("content", input.content);
  if (input.blog_status !== undefined) fd.append("blog_status", input.blog_status);
  if (input.image) fd.append("image", input.image);
  return fd;
}

export const createPost = (input: PostInput) =>
  api<ApiPost>("/posts/", { method: "POST", body: toFormData(input), auth: true });

export const updatePost = (id: number, input: PostInput) =>
  api<ApiPost>(`/posts/${id}`, { method: "PATCH", body: toFormData(input), auth: true });

export const deletePost = (id: number) =>
  api<void>(`/posts/${id}`, { method: "DELETE", auth: true });

/* ---------- newsletter ---------- */

export const subscribeNewsletter = (email: string) =>
  api<{ id: number; email: string; is_subscribed: boolean }>("/newsletters/subscribe", {
    method: "POST",
    body: { email },
  });

export const listNewsletterIssues = () =>
  api<ApiNewsletterIssue[]>("/newsletters/issues");

export const createNewsletterIssue = (title: string, content: string) =>
  api<ApiNewsletterIssue>("/newsletters/issues", {
    method: "POST",
    body: { title, content },
    auth: true,
  });
