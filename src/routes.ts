export const steps = [
  { id: "welcome", path: "/", label: "Name" },
  { id: "personal", path: "/personal-details", label: "Details" },
  { id: "goals", path: "/goals", label: "Goals" },
  { id: "diet", path: "/diet", label: "Diet" },
  { id: "summary", path: "/summary", label: "Review" },
  { id: "plan", path: "/plan", label: "Plan" },
  { id: "tracking", path: "/tracking", label: "Track" },
];

export function getStepByPath(path: string) {
  return steps.find((step) => step.path === path) ?? steps[0];
}

export function getStepIndex(path: string) {
  return steps.findIndex((step) => step.path === getStepByPath(path).path);
}
