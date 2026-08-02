import fs from "node:fs"; import path from "node:path"; import matter from "gray-matter"; import readingTime from "reading-time";
const contentDir = path.join(process.cwd(), "content/posts");
export type Post = { slug: string; title: string; description: string; date: string; tags: string[]; content: string; readingTime: string };
function parse(slug: string): Post | null { const file = path.join(contentDir, `${slug}.mdx`); if (!fs.existsSync(file)) return null; const { data, content } = matter(fs.readFileSync(file, "utf8")); if (!data.title || !data.date || !data.description) throw new Error(`Invalid front matter in ${slug}.mdx`); return { slug, title: data.title, description: data.description, date: String(data.date).slice(0, 10), tags: Array.isArray(data.tags) ? data.tags : [], content, readingTime: readingTime(content).text }; }
export function getAllPosts() { if (!fs.existsSync(contentDir)) return []; return fs.readdirSync(contentDir).filter(f => f.endsWith(".mdx")).map(f => parse(path.basename(f, ".mdx"))!).sort((a,b) => b.date.localeCompare(a.date)); }
export function getPost(slug: string) { return /^[a-z0-9-]+$/.test(slug) ? parse(slug) : null; }
export function getTags() { const counts = new Map<string, number>(); getAllPosts().flatMap(p => p.tags).forEach(t => counts.set(t, (counts.get(t) ?? 0) + 1)); return [...counts.entries()].sort((a,b) => a[0].localeCompare(b[0])); }
export function getPostsByTag(tag: string) { return getAllPosts().filter(p => p.tags.includes(tag)); }
