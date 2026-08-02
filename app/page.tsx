import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export default function Home() {
  const posts = getAllPosts().slice(0, 5);
  return <><section className="hero"><p className="eyebrow">PERSONAL KNOWLEDGE BASE</p><h1>思考、构建与记录。</h1><p>这里收录技术、AI、信息安全与生活中值得长期保存的想法。</p></section><section><div className="section-title"><h2>最新文章</h2><Link href="/posts">查看全部 →</Link></div>{posts.map(post => <article className="post-card" key={post.slug}><p className="muted">{post.date} · {post.readingTime}</p><h3><Link href={`/posts/${post.slug}`}>{post.title}</Link></h3><p>{post.description}</p><div>{post.tags.map(tag => <Link className="tag" key={tag} href={`/tags/${encodeURIComponent(tag)}`}>#{tag}</Link>)}</div></article>)}</section></>;
}
