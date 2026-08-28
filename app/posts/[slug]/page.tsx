import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { Collapsible } from "@/components/Collapsible";
import { ViewCount } from "@/components/ViewCount";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { formatPostDate, getAllPosts, getPost } from "@/lib/posts";

export function generateStaticParams() { return getAllPosts().map(({ slug }) => ({ slug })); }
export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const post = getPost(slug); if (!post) notFound();
  return <article className="article"><p className="muted">发布：{formatPostDate(post.publishedAt)} · 最近更新：{formatPostDate(post.updatedAt)} · {post.readingTime} · <ViewCount slug={post.slug} /></p><h1>{post.title}</h1><p className="lead">{post.description}</p><div className="tags">{post.tags.map(t => <Link className="tag" href={`/tags/${encodeURIComponent(t)}`} key={t}>#{t}</Link>)}</div><MDXRemote source={post.content} components={{ Collapsible }} options={{ mdxOptions: { remarkPlugins: [remarkGfm, remarkMath], rehypePlugins: [rehypeKatex] } }} /></article>;
}
