import Link from "next/link";
import { getTags } from "@/lib/posts";
export const metadata = { title: "标签" };
export default function TagsPage() { return <><h1>标签</h1><div className="tags">{getTags().map(([tag, count]) => <Link className="tag" key={tag} href={`/tags/${encodeURIComponent(tag)}`}>#{tag} ({count})</Link>)}</div></>; }
