import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSiteContent } from "@/lib/content";
import { PostArticle } from "./post-article";

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const { posts } = await getSiteContent();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const { posts } = await getSiteContent();
  const post = posts.find((p) => p.slug === slug);
  if (!post) return { title: "Entry not found" };

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/journal/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.date,
      images: post.image ? [post.image] : undefined,
    },
    // Without an explicit block these inherit the site-wide title, so every
    // article shared on X showed the homepage copy.
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: post.image ? [post.image] : undefined,
    },
  };
}

export default async function JournalPostPage({ params }: Params) {
  const { slug } = await params;
  const { posts } = await getSiteContent();

  const index = posts.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();

  const post = posts[index];
  const next = posts[(index + 1) % posts.length];

  return <PostArticle post={post} next={next} />;
}
