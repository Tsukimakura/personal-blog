"use client";

import { useEffect, useRef, useState } from "react";

export function ViewCount({ slug, initialCount }: { slug: string; initialCount: number }) {
  const [count, setCount] = useState(initialCount);
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
      .catch(() => undefined);
  }, [slug]);

  return <span>{count} 次浏览</span>;
}
