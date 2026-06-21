import type { ReactNode } from "react";
import { BrandLogo } from "./BrandLogo";

interface PageShellProps {
  eyebrow: string;
  title: string;
  intro: string;
  children: ReactNode;
  actions: ReactNode;
  variant?: "story" | "workspace";
}

export function PageShell({
  eyebrow,
  title,
  intro,
  children,
  actions,
  variant = "story",
}: PageShellProps) {
  return (
    <section className={`page-shell page-shell-${variant}`}>
      <div className="page-copy">
        <BrandLogo />
        <span className="eyebrow">{eyebrow}</span>
        <h1 tabIndex={-1}>{title}</h1>
        <p>{intro}</p>
      </div>
      <div className="form-panel">{children}</div>
      <div className="page-actions">{actions}</div>
    </section>
  );
}
