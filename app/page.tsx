import Link from "next/link";
import { formatPostDate, getAllPosts } from "@/lib/posts";

export default function Home() {
  const posts = getAllPosts().slice(0, 5);
  return <><section className="hero"><p className="eyebrow">PERSONAL KNOWLEDGE BASE</p><h1>不惧自由，不负热爱。</h1><p>这里记录个人各方面学习中的整理和思考。</p></section><section><div className="section-title"><h2>最新文章</h2><Link href="/posts">查看全部 →</Link></div>{posts.map(post => <article className="post-card" key={post.slug}><p className="muted">发布于 {formatPostDate(post.publishedAt)} · 更新于 {formatPostDate(post.updatedAt)} · {post.readingTime}</p><h3><Link href={`/posts/${post.slug}`}>{post.title}</Link></h3><p>{post.description}</p><div>{post.tags.map(tag => <Link className="tag" key={tag} href={`/tags/${encodeURIComponent(tag)}`}>#{tag}</Link>)}</div></article>)}</section></>;
}
