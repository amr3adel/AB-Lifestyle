import type { PreferenceModel, UserProfile, WeeklyPlan } from "../types";
import { generateDietPlan } from "./dietGeneration";
import { generateWorkoutPlan } from "./workoutGeneration";

export function generateWeeklyPlan(
  profile: UserProfile,
  preferences: PreferenceModel,
): WeeklyPlan {
  return {
    id: `plan-${Date.now()}`,
    generatedAt: new Date().toISOString(),
    workoutDays: generateWorkoutPlan(profile),
    dietDays: generateDietPlan(profile, preferences),
  };
}
