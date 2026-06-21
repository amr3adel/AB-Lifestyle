export type Sex = "female" | "male" | "prefer-not-to-say" | "";

export type WorkStyle =
  | "sedentary"
  | "mixed"
  | "active"
  | "shift"
  | "frequent-travel"
  | "";

export type PrimaryGoal =
  | "fat-loss"
  | "muscle-gain"
  | "maintenance"
  | "general-fitness"
  | "strength"
  | "endurance"
  | "";

export type Equipment =
  | "bodyweight"
  | "dumbbells"
  | "home-gym"
  | "full-gym"
  | "machines-only"
  | "";

export type SessionDuration = "20-30" | "30-45" | "45-60" | "60-plus" | "";

export interface MacroTarget {
  calories: number;
  proteinGrams: number;
  carbGrams: number;
  fatGrams: number;
  manuallyOverridden: boolean;
}

export interface UserProfile {
  name: string;
  age: number | "";
  weightKg: number | "";
  heightCm: number | "";
  sex: Sex;
  allergies: string[];
  allergyOther: string;
  limitations: string[];
  limitationOther: string;
  workStyle: WorkStyle;
  primaryGoal: PrimaryGoal;
  sessionsPerWeek: number;
  equipment: Equipment;
  sessionDuration: SessionDuration;
  dietaryPreferences: string[];
  foodDislikes: string;
  foodChallenges: string[];
  mealsPerDay: number;
  macroTarget: MacroTarget;
}

export interface WorkoutExercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  intensity: string;
  notes: string;
  tags: string[];
  imageUrl: string;
}

export interface WorkoutDay {
  id: string;
  dayLabel: string;
  focus: string;
  warmup: string;
  imageUrl: string;
  exercises: WorkoutExercise[];
  recovery: string;
}

export type MealSlot = "breakfast" | "lunch" | "dinner" | "snack";

export interface MealOption {
  id: string;
  title: string;
  slot: MealSlot;
  calories: number;
  proteinGrams: number;
  prepTime: string;
  tags: string[];
  avoids: string[];
  description: string;
}

export interface DietDay {
  id: string;
  dayLabel: string;
  meals: Record<MealSlot, MealOption[]>;
}

export interface WeeklyPlan {
  id: string;
  generatedAt: string;
  workoutDays: WorkoutDay[];
  dietDays: DietDay[];
}

export interface MealSelection {
  dayId: string;
  slot: MealSlot;
  mealId: string;
  selectedAt: string;
}

export interface PreferenceModel {
  tagWeights: Record<string, number>;
  mealSelections: MealSelection[];
}

export type SessionStatus = "complete" | "skipped";

export interface WorkoutLogEntry {
  id: string;
  planId: string;
  workoutDayId: string;
  exerciseId: string;
  exerciseName: string;
  loggedAt: string;
  weight: number | "";
  reps: number | "";
  sets: number | "";
  rpe: number | "";
  notes: string;
}

export interface SessionRecord {
  planId: string;
  workoutDayId: string;
  status: SessionStatus;
  updatedAt: string;
}

export interface PlannerState {
  profile: UserProfile;
  completedSteps: string[];
  plan: WeeklyPlan | null;
  preferences: PreferenceModel;
  workoutLogs: WorkoutLogEntry[];
  sessionRecords: Record<string, SessionRecord>;
}
