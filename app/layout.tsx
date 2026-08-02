import type { Metadata } from "next";
import Link from "next/link";
import "./styles.css";

export const dynamic = "force-dynamic";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "My Notes";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: siteName, template: `%s | ${siteName}` },
  description: "A personal engineering notebook.",
  alternates: { types: { "application/rss+xml": "/rss.xml" } },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body><header><Link className="brand" href="/">{siteName}</Link><nav><Link href="/posts">文章</Link><Link href="/tags">标签</Link><Link href="/about">关于</Link></nav></header><main>{children}</main><footer>© {new Date().getFullYear()} {siteName} · <a href="/rss.xml">RSS</a></footer></body></html>;
}
