import type {
  Equipment,
  PrimaryGoal,
  SessionDuration,
  WorkStyle,
} from "../types";

export const allergyOptions = [
  "Dairy",
  "Eggs",
  "Fish",
  "Shellfish",
  "Tree nuts",
  "Peanuts",
  "Wheat",
  "Soy",
  "Sesame",
];

export const limitationOptions = [
  "Lower back pain",
  "Knee pain",
  "Shoulder pain",
  "Wrist pain",
  "Neck pain",
  "Limited mobility",
  "Recent surgery",
];

export const workStyleOptions: Array<{ value: WorkStyle; label: string }> = [
  { value: "sedentary", label: "Sedentary desk job" },
  { value: "mixed", label: "Mixed sitting and moving" },
  { value: "active", label: "Active job" },
  { value: "shift", label: "Shift work" },
  { value: "frequent-travel", label: "Frequent travel" },
];

export const goalOptions: Array<{ value: PrimaryGoal; label: string }> = [
  { value: "fat-loss", label: "Fat loss" },
  { value: "muscle-gain", label: "Muscle gain" },
  { value: "maintenance", label: "Maintenance" },
  { value: "general-fitness", label: "General fitness" },
  { value: "strength", label: "Strength" },
  { value: "endurance", label: "Endurance" },
];

export const equipmentOptions: Array<{ value: Equipment; label: string }> = [
  { value: "bodyweight", label: "Home / bodyweight" },
  { value: "dumbbells", label: "Dumbbells only" },
  { value: "home-gym", label: "Home gym" },
  { value: "full-gym", label: "Full gym" },
  { value: "machines-only", label: "Machines only" },
];

export const durationOptions: Array<{ value: SessionDuration; label: string }> =
  [
    { value: "20-30", label: "20-30 minutes" },
    { value: "30-45", label: "30-45 minutes" },
    { value: "45-60", label: "45-60 minutes" },
    { value: "60-plus", label: "60+ minutes" },
  ];

export const dietaryPreferenceOptions = [
  "Vegetarian",
  "Vegan",
  "Halal",
  "Keto",
  "Mediterranean",
  "High-protein",
  "Low-carb",
  "Gluten-free",
  "Dairy-free",
];

export const foodChallengeOptions = [
  "Limited time",
  "Trouble cooking",
  "Eating out often",
  "Budget constraints",
  "Cravings",
  "Skipping meals",
  "Late-night eating",
];
