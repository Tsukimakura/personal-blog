"use client";

import { useEffect, useRef, useState } from "react";

export function ViewCount({ slug }: { slug: string }) {
  const [count, setCount] = useState<number | null | undefined>(null);
  const requested = useRef(false);

  useEffect(() => {
    if (requested.current) return;
    requested.current = true;

    const storageKey = `blog:viewed:${slug}`;
    const alreadyViewed = sessionStorage.getItem(storageKey) === "1";

    fetch(`/api/views/${encodeURIComponent(slug)}`, {
      method: alreadyViewed ? "GET" : "POST",
      cache: "no-store",
      credentials: "same-origin",
    })
      .then(response => {
        if (!response.ok) throw new Error(`View request failed: ${response.status}`);
        return response.json() as Promise<{ count: number }>;
      })
      .then(data => {
        setCount(data.count);
        if (!alreadyViewed) sessionStorage.setItem(storageKey, "1");
      })
      .catch(() => setCount(undefined));
  }, [slug]);

  return <span>{count === null ? "浏览量加载中" : count === undefined ? "浏览量暂不可用" : `${count} 次浏览`}</span>;
}
