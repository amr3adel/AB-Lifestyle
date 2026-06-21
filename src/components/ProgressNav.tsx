import type { CSSProperties } from "react";
import { onboardingSteps } from "../routes";

interface ProgressNavProps {
  currentIndex: number;
}

export function ProgressNav({ currentIndex }: ProgressNavProps) {
  const percent = Math.round(
    ((currentIndex + 1) / onboardingSteps.length) * 100,
  );

  return (
    <nav className="progress-nav" aria-label="Planner progress">
      <div className="progress-meta">
        <span>
          Step {currentIndex + 1} of {onboardingSteps.length}
        </span>
        <strong>{percent}%</strong>
      </div>
      <div className="progress-track" aria-hidden="true">
        <div className="progress-fill" style={{ width: `${percent}%` }} />
      </div>
      <ol
        className="step-dots"
        style={{ "--step-count": onboardingSteps.length } as CSSProperties}
      >
        {onboardingSteps.map((step, index) => (
          <li
            className={index <= currentIndex ? "is-active" : ""}
            key={step.id}
          >
            <span>{step.label}</span>
          </li>
        ))}
      </ol>
    </nav>
  );
}
