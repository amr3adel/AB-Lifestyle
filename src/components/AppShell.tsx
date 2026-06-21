import type { ReactNode } from "react";
import { appNavItems } from "../routes";
import { BrandLogo } from "./BrandLogo";

interface AppShellProps {
  children: ReactNode;
  path: string;
  navigate: (path: string) => void;
}

const navIconById: Record<string, string> = {
  dashboard: "T",
  plan: "P",
  tracking: "L",
  profile: "M",
};

export function AppShell({ children, path, navigate }: AppShellProps) {
  return (
    <div className="product-shell">
      <aside className="side-nav" aria-label="Main navigation">
        <BrandLogo />
        <div className="nav-stack">
          {appNavItems.map((item) => (
            <button
              className={path === item.path ? "is-active" : ""}
              key={item.id}
              onClick={() => navigate(item.path)}
            >
              <span aria-hidden="true">{navIconById[item.id]}</span>
              {item.label}
            </button>
          ))}
        </div>
      </aside>
      <header className="mobile-brandbar">
        <BrandLogo compact />
        <span>Amr Boghdady</span>
      </header>
      <section className="product-content">{children}</section>
      <nav className="mobile-bottom-nav" aria-label="Main navigation">
        {appNavItems.map((item) => (
          <button
            className={path === item.path ? "is-active" : ""}
            key={item.id}
            onClick={() => navigate(item.path)}
          >
            <span aria-hidden="true">{navIconById[item.id]}</span>
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
