import type { MacroTarget, PrimaryGoal, Sex, WorkStyle } from "../types";

const activityMultiplierByWorkStyle: Record<Exclude<WorkStyle, "">, number> = {
  sedentary: 1.25,
  mixed: 1.4,
  active: 1.6,
  shift: 1.35,
  "frequent-travel": 1.35,
};

const calorieAdjustmentByGoal: Record<Exclude<PrimaryGoal, "">, number> = {
  "fat-loss": -450,
  "muscle-gain": 250,
  maintenance: 0,
  "general-fitness": 0,
  strength: 150,
  endurance: 100,
};

interface NutritionInput {
  age: number | "";
  weightKg: number | "";
  heightCm: number | "";
  sex: Sex;
  workStyle: WorkStyle;
  primaryGoal: PrimaryGoal;
}

function estimateTargetWeightKg(heightCm: number, weightKg: number) {
  const heightM = heightCm / 100;
  const upperHealthyWeight = 25 * heightM * heightM;
  return Math.min(weightKg, Math.max(50, upperHealthyWeight));
}

export function calculateMacroTarget(input: NutritionInput): MacroTarget {
  const age = Number(input.age);
  const weightKg = Number(input.weightKg);
  const heightCm = Number(input.heightCm);

  if (!age || !weightKg || !heightCm || !input.sex || !input.primaryGoal) {
    return {
      calories: 0,
      proteinGrams: 0,
      carbGrams: 0,
      fatGrams: 0,
      manuallyOverridden: false,
    };
  }

  const sexAdjustment = input.sex === "female" ? -161 : 5;
  const bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + sexAdjustment;
  const activityMultiplier = input.workStyle
    ? activityMultiplierByWorkStyle[input.workStyle]
    : 1.3;
  const goalAdjustment = input.primaryGoal
    ? calorieAdjustmentByGoal[input.primaryGoal]
    : 0;

  const calories = Math.max(
    1200,
    Math.round((bmr * activityMultiplier + goalAdjustment) / 25) * 25,
  );

  const targetWeightKg = estimateTargetWeightKg(heightCm, weightKg);
  const proteinPerKg =
    input.primaryGoal === "muscle-gain" || input.primaryGoal === "strength"
      ? 1.9
      : 1.7;
  const proteinGrams = Math.min(220, Math.round(targetWeightKg * proteinPerKg));
  const minimumCarbGrams = input.primaryGoal === "fat-loss" ? 35 : 60;
  const maximumFatCalories = calories - proteinGrams * 4 - minimumCarbGrams * 4;
  const fatCalories = Math.max(
    calories * 0.18,
    Math.min(calories * 0.28, maximumFatCalories),
  );
  const fatGrams = Math.max(30, Math.round(fatCalories / 9));
  const carbCalories = calories - proteinGrams * 4 - fatGrams * 9;
  const carbGrams = Math.max(0, Math.round(carbCalories / 4));

  return {
    calories,
    proteinGrams,
    carbGrams,
    fatGrams,
    manuallyOverridden: false,
  };
}
