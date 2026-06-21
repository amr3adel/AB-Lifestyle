import type {
  DietDay,
  MealOption,
  MealSelection,
  MealSlot,
  PreferenceModel,
  SessionRecord,
  WeeklyPlan,
  WorkoutExercise,
  WorkoutLogEntry,
} from "../types";
import { defaultPlannerState } from "../storage/localDatabase";

const groceryByTag: Record<string, string[]> = {
  "high-protein": ["lean protein", "eggs or dairy alternative"],
  quick: ["pre-cut vegetables", "ready grains"],
  vegetarian: ["lentils", "chickpeas", "Greek yogurt or tofu"],
  vegan: ["tofu", "beans", "plant protein"],
  halal: ["halal chicken or turkey"],
  budget: ["rice", "potatoes", "beans", "seasonal fruit"],
  balanced: ["mixed vegetables", "olive oil", "whole grains"],
  "meal-prep": ["storage containers", "bulk grains"],
  "craving-control": ["berries", "protein powder"],
};

export function findSelectedMeal(
  preferences: PreferenceModel,
  dayId: string,
  slot: MealSlot,
) {
  return preferences.mealSelections.find(
    (selection) => selection.dayId === dayId && selection.slot === slot,
  );
}

export function getMealForSlot(
  day: DietDay,
  slot: MealSlot,
  preferences: PreferenceModel,
) {
  const options = day.meals[slot] ?? [];
  const selected = findSelectedMeal(preferences, day.id, slot);
  return options.find((meal) => meal.id === selected?.mealId) ?? options[0];
}

export function getSelectedMealsForDay(
  day: DietDay | undefined,
  preferences: PreferenceModel,
) {
  if (!day) return [];
  return (Object.keys(day.meals) as MealSlot[])
    .map((slot) => getMealForSlot(day, slot, preferences))
    .filter(Boolean) as MealOption[];
}

export function getMealTotals(meals: MealOption[]) {
  return meals.reduce(
    (totals, meal) => ({
      calories: totals.calories + meal.calories,
      proteinGrams: totals.proteinGrams + meal.proteinGrams,
    }),
    { calories: 0, proteinGrams: 0 },
  );
}

export function buildGroceryList(
  plan: WeeklyPlan | null,
  preferences: PreferenceModel,
) {
  if (!plan) return [];

  const items = new Set<string>();
  plan.dietDays.forEach((day) => {
    getSelectedMealsForDay(day, preferences).forEach((meal) => {
      meal.tags.forEach((tag) => {
        groceryByTag[tag]?.forEach((item) => items.add(item));
      });
      meal.title
        .split(/\s+/)
        .filter((word) => word.length > 5)
        .slice(0, 2)
        .forEach((word) => items.add(word.toLowerCase()));
    });
  });

  return Array.from(items).slice(0, 18);
}

export function getCompletedSessions(
  plan: WeeklyPlan | null,
  sessionRecords: Record<string, SessionRecord>,
) {
  if (!plan) return 0;
  return plan.workoutDays.filter(
    (day) => sessionRecords[`${plan.id}:${day.id}`]?.status === "complete",
  ).length;
}

export function getExerciseHistory(
  logs: WorkoutLogEntry[],
  exerciseId: string,
) {
  return logs
    .filter((log) => log.exerciseId === exerciseId)
    .sort((a, b) => Date.parse(b.loggedAt) - Date.parse(a.loggedAt));
}

export function estimateVolume(entry: WorkoutLogEntry) {
  return Number(entry.weight || 0) * Number(entry.reps || 0) * Number(entry.sets || 0);
}

export function getBestLog(entries: WorkoutLogEntry[]) {
  return entries.reduce<WorkoutLogEntry | null>((best, entry) => {
    if (!best) return entry;
    return estimateVolume(entry) > estimateVolume(best) ? entry : best;
  }, null);
}

export function getProgressionHint(
  exercise: WorkoutExercise,
  history: WorkoutLogEntry[],
) {
  const latest = history[0];
  if (!latest) {
    return `Start with the planned ${exercise.sets} sets and keep 2-3 reps in reserve.`;
  }

  const rpe = Number(latest.rpe || 0);
  if (rpe && rpe <= 7) {
    return "Next time: add 1-2 reps or a small weight increase.";
  }

  if (rpe >= 9) {
    return "Next time: repeat the same load and improve control before progressing.";
  }

  return "Next time: keep the load steady and aim for cleaner reps.";
}

export function exportPlannerData(state: unknown) {
  const blob = new Blob([JSON.stringify(state, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `ab-lifestyle-export-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

export function validateImportedPlannerState(value: unknown) {
  if (!value || typeof value !== "object") {
    throw new Error("The selected file is not a valid AB Lifestyle export.");
  }

  const candidate = value as Partial<typeof defaultPlannerState>;
  if (!candidate.profile || typeof candidate.profile !== "object") {
    throw new Error("The import is missing profile data.");
  }

  return {
    ...defaultPlannerState,
    ...candidate,
    profile: {
      ...defaultPlannerState.profile,
      ...candidate.profile,
      macroTarget: {
        ...defaultPlannerState.profile.macroTarget,
        ...candidate.profile.macroTarget,
      },
    },
    preferences: {
      ...defaultPlannerState.preferences,
      ...candidate.preferences,
      tagWeights: candidate.preferences?.tagWeights ?? {},
      mealSelections: candidate.preferences?.mealSelections ?? [],
    },
    workoutLogs: candidate.workoutLogs ?? [],
    sessionRecords: candidate.sessionRecords ?? {},
  };
}

export function getSelectedMealCount(selections: MealSelection[]) {
  return new Set(selections.map((selection) => `${selection.dayId}:${selection.slot}`))
    .size;
}
