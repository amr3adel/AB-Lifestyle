import { useCallback, useEffect, useState } from "react";
import { getStepIndex, onboardingSteps } from "../routes";

export function useRouteFlow() {
  const [path, setPath] = useState(() => window.location.pathname);
  const currentIndex = getStepIndex(path);

  useEffect(() => {
    const handlePopState = () => setPath(window.location.pathname);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate = useCallback((nextPath: string) => {
    window.history.pushState({}, "", nextPath);
    setPath(nextPath);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    window.setTimeout(() => {
      document.querySelector("h1")?.focus();
    }, 80);
  }, [path]);

  const goNext = useCallback(() => {
    const next =
      onboardingSteps[Math.min(currentIndex + 1, onboardingSteps.length - 1)];
    navigate(next.path);
  }, [currentIndex, navigate]);

  const goBack = useCallback(() => {
    const previous = onboardingSteps[Math.max(currentIndex - 1, 0)];
    navigate(previous.path);
  }, [currentIndex, navigate]);

  return {
    path,
    currentIndex,
    navigate,
    goNext,
    goBack,
  };
}
