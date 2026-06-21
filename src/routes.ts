export const onboardingSteps = [
  { id: "welcome", path: "/", label: "Name" },
  { id: "personal", path: "/personal-details", label: "Details" },
  { id: "goals", path: "/goals", label: "Goals" },
  { id: "diet", path: "/diet", label: "Diet" },
  { id: "summary", path: "/summary", label: "Review" },
];

export const appNavItems = [
  { id: "dashboard", path: "/dashboard", label: "Today" },
  { id: "plan", path: "/plan", label: "Plan" },
  { id: "tracking", path: "/tracking", label: "Track" },
  { id: "profile", path: "/profile", label: "Profile" },
];

export const steps = onboardingSteps;

export function getStepByPath(path: string) {
  return onboardingSteps.find((step) => step.path === path) ?? onboardingSteps[0];
}

export function getStepIndex(path: string) {
  return onboardingSteps.findIndex((step) => step.path === getStepByPath(path).path);
}

export function isOnboardingPath(path: string) {
  return onboardingSteps.some((step) => step.path === path);
}
