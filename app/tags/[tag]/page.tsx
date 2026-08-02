import { getPostsByTag } from "@/lib/posts"; import PostList from "@/components/PostList";
export default async function TagPage({ params }: { params: Promise<{tag: string}> }) { const { tag } = await params; return <><h1>#{tag}</h1><PostList posts={getPostsByTag(tag)} /></>; }
