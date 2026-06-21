import type { MealOption, MealSelection, PreferenceModel } from "../types";

export function recordMealSelection(
  current: PreferenceModel,
  selection: MealSelection,
  meal: MealOption,
): PreferenceModel {
  const previousSelections = current.mealSelections.filter(
    (item) => !(item.dayId === selection.dayId && item.slot === selection.slot),
  );

  const nextWeights = { ...current.tagWeights };
  meal.tags.forEach((tag) => {
    nextWeights[tag] = (nextWeights[tag] ?? 0) + 1;
  });

  return {
    tagWeights: nextWeights,
    mealSelections: [...previousSelections, selection],
  };
}

export function scoreMealForPreference(
  meal: MealOption,
  preferences: PreferenceModel,
) {
  return meal.tags.reduce(
    (score, tag) => score + (preferences.tagWeights[tag] ?? 0),
    0,
  );
}

export function getSelectedMealId(
  preferences: PreferenceModel,
  dayId: string,
  slot: string,
) {
  return preferences.mealSelections.find(
    (selection) => selection.dayId === dayId && selection.slot === slot,
  )?.mealId;
}
