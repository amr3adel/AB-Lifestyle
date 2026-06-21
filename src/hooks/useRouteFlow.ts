import { useCallback, useEffect, useState } from "react";
import { getStepIndex, steps } from "../routes";

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

  const goNext = useCallback(() => {
    const next = steps[Math.min(currentIndex + 1, steps.length - 1)];
    navigate(next.path);
  }, [currentIndex, navigate]);

  const goBack = useCallback(() => {
    const previous = steps[Math.max(currentIndex - 1, 0)];
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
