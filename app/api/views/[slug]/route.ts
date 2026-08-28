import { NextRequest, NextResponse } from "next/server";
import { getPost } from "@/lib/posts";
import { getViewCount, incrementViewCount } from "@/lib/views";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const deduplicationWindow = 30 * 60 * 1000;
const recentViews = new Map<string, number>();

function json(count: number) {
  return NextResponse.json({ count }, { headers: { "Cache-Control": "no-store" } });
}

async function resolveSlug(params: Promise<{ slug: string }>) {
  const { slug } = await params;
  return getPost(slug) ? slug : null;
}

export async function GET(_request: NextRequest, context: { params: Promise<{ slug: string }> }) {
  const slug = await resolveSlug(context.params);
  if (!slug) return NextResponse.json({ error: "Post not found" }, { status: 404 });
  return json(await getViewCount(slug));
}

export async function POST(request: NextRequest, context: { params: Promise<{ slug: string }> }) {
  const slug = await resolveSlug(context.params);
  if (!slug) return NextResponse.json({ error: "Post not found" }, { status: 404 });

  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const visitor = request.cookies.get("blog-visitor")?.value ?? crypto.randomUUID();
  const deduplicationKey = `${slug}:${visitor}:${forwardedFor ?? "unknown"}`;
  const now = Date.now();
  const lastViewedAt = recentViews.get(deduplicationKey);
  const count = lastViewedAt && now - lastViewedAt < deduplicationWindow
    ? await getViewCount(slug)
    : await incrementViewCount(slug);

  recentViews.set(deduplicationKey, now);
  if (recentViews.size > 10_000) {
    for (const [key, viewedAt] of recentViews) {
      if (now - viewedAt >= deduplicationWindow) recentViews.delete(key);
    }
  }

  const response = json(count);
  if (!request.cookies.has("blog-visitor")) {
    response.cookies.set("blog-visitor", visitor, {
      httpOnly: true,
      maxAge: 365 * 24 * 60 * 60,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });
  }
  return response;
}
