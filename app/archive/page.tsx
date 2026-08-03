import Link from "next/link";
import { formatPostDate, getAllPosts } from "@/lib/posts";

export const metadata = { title: "归档" };

export default function ArchivePage() {
  const postsByYear = getAllPosts().reduce<Record<string, ReturnType<typeof getAllPosts>>>(
    (groups, post) => { (groups[post.publishedAt.slice(0, 4)] ??= []).push(post); return groups; },
    {},
  );
  return <><h1>归档</h1>{Object.entries(postsByYear).map(([year, posts]) => <section className="archive-year" key={year}><h2>{year}</h2>{posts.map(post => <article className="archive-item" key={post.slug}><time>{formatPostDate(post.publishedAt)}</time><Link href={`/posts/${post.slug}`}>{post.title}</Link></article>)}</section>)}</>;
}
