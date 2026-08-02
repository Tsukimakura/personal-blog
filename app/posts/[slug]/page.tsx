import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPost } from "@/lib/posts";

export function generateStaticParams() { return getAllPosts().map(({ slug }) => ({ slug })); }
export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const post = getPost(slug); if (!post) notFound();
  return <article className="article"><p className="muted">{post.date} · {post.readingTime}</p><h1>{post.title}</h1><p className="lead">{post.description}</p><div className="tags">{post.tags.map(t => <a className="tag" href={`/tags/${encodeURIComponent(t)}`} key={t}>#{t}</a>)}</div><MDXRemote source={post.content} /></article>;
}
