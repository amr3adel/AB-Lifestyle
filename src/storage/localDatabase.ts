import type { PlannerState, UserProfile } from "../types";

const STORAGE_KEY = "ab-lifestyle:planner-state";

export const defaultProfile: UserProfile = {
  name: "",
  unitSystem: "metric",
  age: "",
  weightKg: "",
  heightCm: "",
  sex: "",
  allergies: [],
  allergyOther: "",
  limitations: [],
  limitationOther: "",
  workStyle: "",
  primaryGoal: "",
  sessionsPerWeek: 3,
  equipment: "",
  sessionDuration: "",
  dietaryPreferences: [],
  foodDislikes: "",
  foodChallenges: [],
  mealsPerDay: 3,
  macroTarget: {
    calories: 0,
    proteinGrams: 0,
    carbGrams: 0,
    fatGrams: 0,
    manuallyOverridden: false,
  },
};

export const defaultPlannerState: PlannerState = {
  profile: defaultProfile,
  completedSteps: [],
  plan: null,
  preferences: {
    tagWeights: {},
    mealSelections: [],
  },
  workoutLogs: [],
  sessionRecords: {},
};

export function loadPlannerState(): PlannerState {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return defaultPlannerState;
  }

  try {
    const parsed = JSON.parse(stored) as PlannerState;
    return {
      ...defaultPlannerState,
      ...parsed,
      profile: {
        ...defaultProfile,
        ...parsed.profile,
        macroTarget: {
          ...defaultProfile.macroTarget,
          ...parsed.profile?.macroTarget,
        },
      },
      preferences: {
        ...defaultPlannerState.preferences,
        ...parsed.preferences,
        tagWeights: {
          ...defaultPlannerState.preferences.tagWeights,
          ...parsed.preferences?.tagWeights,
        },
        mealSelections: parsed.preferences?.mealSelections ?? [],
      },
      workoutLogs: parsed.workoutLogs ?? [],
      sessionRecords: parsed.sessionRecords ?? {},
    };
  } catch {
    return defaultPlannerState;
  }
}

export function savePlannerState(state: PlannerState) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function replacePlannerState(state: PlannerState) {
  savePlannerState(state);
}
