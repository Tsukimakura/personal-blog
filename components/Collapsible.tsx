import type { ReactNode } from "react";

export function Collapsible({ title, children, open = false }: { title: string; children: ReactNode; open?: boolean }) {
  return <details className="collapsible" open={open}><summary>{title}</summary><div className="collapsible-content">{children}</div></details>;
}
