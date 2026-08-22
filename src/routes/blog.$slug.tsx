import { createFileRoute, Link } from "@tanstack/react-router";
import { PostCard } from "@/components/post-card";

const BASE_URL = "https://tenaosis-blog.vercel.app";
const API_PATH = "/api/proxy/posts";

interface BackendPost {
  id: number;
  title: string;
  quote?: string | null;
  sub_content?: string | null;
  content?: string | null;
  image?: string | null;
  image_url?: string | null;
  blog_status: string;
  owner_id: number;
  owner?: any;
  created_at: string;
  updated_at: string;
  like_count?: number;
  has_liked?: boolean;
}

interface FrontendPost {
  id: number;
  title: string;
  sub_content?: string;
  excerpt?: string;
  quote?: string;
  body: string[];
  image?: string;
  date: string;
  created_at: string;
  updated_at: string;
  readingTime: string;
  slug: string;
  featured: boolean;
  published: boolean;
  blog_status: string;
  owner_id: number;
  owner?: any;
}

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const calculateReadingTime = (content: string) => {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));

  return `${minutes} min`;
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const resolveImageUrl = (image?: string | null) => {
  const value = image?.trim();

  if (!value) return undefined;

  if (value.startsWith("data:") || value.startsWith("blob:")) {
    return value;
  }

  try {
    return new URL(value, `${BASE_URL}/`).toString();
  } catch {
    return undefined;
  }
};

const transformPost = (post: BackendPost): FrontendPost => {
  const content = post.content ?? "";
  const subContent = post.sub_content?.trim() ?? "";
  const image = resolveImageUrl(post.image ?? post.image_url);

  return {
    id: post.id,
    title: post.title,
    sub_content: subContent,
    excerpt: subContent,
    ...(post.quote != null ? { quote: post.quote } : {}),
    body: content
      .split(/\n\s*\n/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean),
    ...(image ? { image } : {}),
    date: formatDate(post.created_at),
    created_at: post.created_at,
    updated_at: post.updated_at,
    readingTime: calculateReadingTime(content),
    slug: slugify(post.title),
    featured: false,
    published: post.blog_status === "published",
    blog_status: post.blog_status,
    owner_id: post.owner_id,
    owner: post.owner,
  };
};

export const Route = createFileRoute("/blog/$slug")({
  loader: async () => {
    const apiUrl =
      typeof window === "undefined"
        ? `${BASE_URL}${API_PATH}?blog_status=published`
        : `${API_PATH}?blog_status=published`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error("Failed to load blog posts");
    }

    const payload: unknown = await response.json();
    const posts: BackendPost[] = Array.isArray(payload)
      ? payload
      : payload && typeof payload === "object" && "posts" in payload && Array.isArray(payload.posts)
        ? payload.posts
        : [];

    return {
      posts: posts
        .filter((post) => post.blog_status === "published")
        .map(transformPost),
    };
  },

  head: ({ loaderData, params }) => {
    const post = loaderData?.posts?.find(
      (post) => post.slug === params.slug
    );

    const url = `${BASE_URL}/blog/${params.slug}`;

    const title =
      post?.title ??
      params.slug
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());

    const description =
      post?.sub_content ||
      post?.excerpt ||
      "An essay from the Tenaosis journal on living gently with technology.";

    const image = resolveImageUrl(post?.image);

    return {
      meta: [
        {
          title: `${title} — Tenaosis`,
        },
        {
          name: "description",
          content: description,
        },
        {
          property: "og:title",
          content: `${title} — Tenaosis`,
        },
        {
          property: "og:description",
          content: description,
        },
        {
          property: "og:type",
          content: "article",
        },
        {
          property: "og:url",
          content: url,
        },
        ...(image
          ? [
              {
                property: "og:image",
                content: image,
              },
              {
                name: "twitter:image",
                content: image,
              },
            ]
          : []),
      ],

      links: [
        {
          rel: "canonical",
          href: url,
        },
      ],

      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: title,
            description,
            ...(image ? { image } : {}),
            ...(post
              ? {
                  datePublished: post.created_at,
                  dateModified: post.updated_at,
                }
              : {}),
            mainEntityOfPage: url,
            author: {
              "@type": "Organization",
              name: "Tenaosis",
            },
            publisher: {
              "@type": "Organization",
              name: "Tenaosis",
            },
          }),
        },
      ],
    };
  },

  component: Article,
});

function Article() {
  const { slug } = Route.useParams();
  const { posts } = Route.useLoaderData();

  const post = posts.find((post) => post.slug === slug);

  const more = posts
    .filter((post) => post.slug !== slug)
    .slice(0, 3);

  if (!post) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-20 text-center">
        <h1 className="text-3xl">Article not found</h1>

        <p className="mt-3 text-muted-foreground">
          The article may have been removed or is no longer published.
        </p>

        <Link to="/blog" className="pill mt-6 inline-block">
          Back to the journal
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-8 sm:py-12">
      <article>
        <h1 className="text-3xl sm:text-4xl">
          {post.title}
        </h1>

        {(post.sub_content || post.excerpt) && (
          <p className="mt-1 text-sm text-muted-foreground">
            {post.sub_content || post.excerpt}
          </p>
        )}

        <p className="label-caps mt-2 text-muted-foreground">
          {post.date} · {post.readingTime} read
        </p>

        {post.image && (
          <img
            src={post.image}
            alt={post.title}
            width={1280}
            height={720}
            className="mx-auto mt-5 aspect-video w-full max-w-3xl rounded-xl object-cover"
          />
        )}

        {post.quote && (
          <blockquote className="mt-6 rounded-xl border-l-4 border-primary bg-secondary/60 px-5 py-4 font-display text-xl text-primary">
            {post.quote}
          </blockquote>
        )}

        <div className="prose-editorial mt-6 text-[1.05rem] leading-8 text-foreground/90">
          {post.body.map((paragraph, index) => (
            <p key={index} className="mb-5">
              {paragraph}
            </p>
          ))}
        </div>
      </article>

      {more.length > 0 && (
        <section className="mt-14 border-t border-border pt-8">
          <h2 className="text-xl">Keep reading</h2>

          <div className="mt-5 grid gap-8 sm:grid-cols-3">
            {more.map((post) => (
              <PostCard
                key={post.id}
                post={{
                  ...post,
                  id: String(post.id),
                  image: post.image ?? "",
                  sub_content: post.sub_content ?? post.excerpt ?? "",
                  excerpt: post.sub_content ?? post.excerpt ?? "",
                }}
                compact
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}