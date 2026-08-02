import { getAllPosts } from "@/lib/posts";
import PostList from "@/components/PostList";
export const metadata = { title: "全部文章" };
export default function PostsPage() { return <><h1>全部文章</h1><PostList posts={getAllPosts()} /></>; }
