import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";
import "./styles.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.name, template: `%s | ${site.name}` },
  description: site.description,
  alternates: { types: { "application/rss+xml": "/rss.xml" } },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body><header><Link className="brand" href="/">{site.name}</Link><nav><Link href="/posts">文章</Link><Link href="/archive">归档</Link><Link href="/tags">标签</Link><Link href="/about">关于</Link></nav></header><main>{children}</main><footer>© {new Date().getFullYear()} {site.name} · <a href="/rss.xml">RSS</a></footer></body></html>;
}
