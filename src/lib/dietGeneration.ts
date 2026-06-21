import type { DietDay, MealOption, MealSlot, PreferenceModel, UserProfile } from "../types";
import { scoreMealForPreference } from "./preferenceLearning";

const mealLibrary: MealOption[] = [
  {
    id: "greek-yogurt-bowl",
    title: "Greek yogurt protein bowl",
    slot: "breakfast",
    calories: 420,
    proteinGrams: 38,
    prepTime: "5 min",
    tags: ["high-protein", "quick", "vegetarian", "budget"],
    avoids: ["Dairy"],
    description: "Greek yogurt, oats, berries, chia, and a little honey.",
  },
  {
    id: "tofu-scramble",
    title: "Tofu scramble wrap",
    slot: "breakfast",
    calories: 460,
    proteinGrams: 28,
    prepTime: "15 min",
    tags: ["vegan", "vegetarian", "high-protein", "meal-prep"],
    avoids: ["Soy", "Wheat"],
    description: "Tofu, peppers, spinach, and avocado in a wrap.",
  },
  {
    id: "egg-avocado-toast",
    title: "Egg and avocado toast",
    slot: "breakfast",
    calories: 430,
    proteinGrams: 24,
    prepTime: "10 min",
    tags: ["quick", "vegetarian", "balanced"],
    avoids: ["Eggs", "Wheat"],
    description: "Eggs, avocado, whole-grain toast, and fruit on the side.",
  },
  {
    id: "chicken-rice-bowl",
    title: "Chicken rice power bowl",
    slot: "lunch",
    calories: 650,
    proteinGrams: 48,
    prepTime: "20 min",
    tags: ["high-protein", "halal", "meal-prep", "balanced"],
    avoids: [],
    description: "Grilled chicken, rice, cucumber, tomato, greens, and yogurt-free herb sauce.",
  },
  {
    id: "lentil-quinoa-salad",
    title: "Lentil quinoa salad",
    slot: "lunch",
    calories: 580,
    proteinGrams: 30,
    prepTime: "15 min",
    tags: ["vegan", "vegetarian", "budget", "high-fiber"],
    avoids: [],
    description: "Lentils, quinoa, herbs, cucumber, olive oil, lemon, and seeds.",
  },
  {
    id: "tuna-potato-plate",
    title: "Tuna potato plate",
    slot: "lunch",
    calories: 560,
    proteinGrams: 42,
    prepTime: "12 min",
    tags: ["quick", "high-protein", "budget"],
    avoids: ["Fish"],
    description: "Tuna, boiled potatoes, salad vegetables, and olive oil dressing.",
  },
  {
    id: "salmon-veg",
    title: "Salmon, rice, and vegetables",
    slot: "dinner",
    calories: 690,
    proteinGrams: 46,
    prepTime: "25 min",
    tags: ["high-protein", "omega-3", "balanced"],
    avoids: ["Fish"],
    description: "Baked salmon, rice, roasted vegetables, and lemon.",
  },
  {
    id: "turkey-chili",
    title: "Turkey bean chili",
    slot: "dinner",
    calories: 640,
    proteinGrams: 52,
    prepTime: "30 min",
    tags: ["high-protein", "halal", "meal-prep", "budget"],
    avoids: [],
    description: "Lean turkey, beans, tomato, peppers, and spices.",
  },
  {
    id: "chickpea-curry",
    title: "Chickpea vegetable curry",
    slot: "dinner",
    calories: 610,
    proteinGrams: 24,
    prepTime: "25 min",
    tags: ["vegan", "vegetarian", "budget", "comfort"],
    avoids: [],
    description: "Chickpeas, vegetables, tomato curry sauce, and rice.",
  },
  {
    id: "protein-smoothie",
    title: "Protein smoothie",
    slot: "snack",
    calories: 280,
    proteinGrams: 28,
    prepTime: "5 min",
    tags: ["quick", "high-protein", "craving-control"],
    avoids: ["Dairy"],
    description: "Protein powder, banana, berries, and milk alternative.",
  },
  {
    id: "hummus-box",
    title: "Hummus snack box",
    slot: "snack",
    calories: 310,
    proteinGrams: 14,
    prepTime: "5 min",
    tags: ["vegan", "vegetarian", "quick", "budget"],
    avoids: ["Sesame"],
    description: "Hummus, vegetables, fruit, and whole-grain crackers.",
  },
  {
    id: "cottage-cheese-fruit",
    title: "Cottage cheese and fruit",
    slot: "snack",
    calories: 260,
    proteinGrams: 26,
    prepTime: "3 min",
    tags: ["high-protein", "quick", "vegetarian"],
    avoids: ["Dairy"],
    description: "Cottage cheese, fruit, cinnamon, and a small nut-free granola sprinkle.",
  },
];

const dayLabels = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const slots: MealSlot[] = ["breakfast", "lunch", "dinner", "snack"];

function createFallbackMeal(slot: MealSlot, profile: UserProfile, dayIndex: number): MealOption {
  const preferenceText = profile.dietaryPreferences.join(", ") || "balanced";
  const slotCalories: Record<MealSlot, number> = {
    breakfast: 360,
    lunch: 520,
    dinner: 560,
    snack: 240,
  };

  return {
    id: `custom-safe-${slot}-${dayIndex}`,
    title: `Custom ${preferenceText} ${slot}`,
    slot,
    calories: slotCalories[slot],
    proteinGrams: slot === "snack" ? 16 : 28,
    prepTime: "10-20 min",
    tags: ["custom", "safe-fallback", "quick"],
    avoids: [],
    description:
      "Build a simple safe plate from tolerated protein, tolerated carbs, vegetables, and olive oil or avocado.",
  };
}

function normalizedProfileText(profile: UserProfile) {
  return [
    ...profile.allergies,
    profile.allergyOther,
    ...profile.dietaryPreferences,
    profile.foodDislikes,
  ]
    .join(" ")
    .toLowerCase();
}

function respectsRestrictions(meal: MealOption, profile: UserProfile) {
  const text = normalizedProfileText(profile);

  if (meal.avoids.some((item) => text.includes(item.toLowerCase()))) {
    return false;
  }

  if (text.includes("vegan") && !meal.tags.includes("vegan")) {
    return false;
  }

  if (text.includes("vegetarian") && !meal.tags.includes("vegetarian") && !meal.tags.includes("vegan")) {
    return false;
  }

  if (text.includes("halal") && meal.title.toLowerCase().includes("turkey") === false && meal.tags.includes("halal") === false && !meal.tags.includes("vegan") && !meal.tags.includes("vegetarian")) {
    return false;
  }

  return true;
}

function challengeScore(meal: MealOption, profile: UserProfile) {
  let score = 0;
  if (profile.foodChallenges.includes("Limited time") && meal.tags.includes("quick")) score += 2;
  if (profile.foodChallenges.includes("Trouble cooking") && meal.tags.includes("quick")) score += 2;
  if (profile.foodChallenges.includes("Budget constraints") && meal.tags.includes("budget")) score += 2;
  if (profile.foodChallenges.includes("Cravings") && meal.tags.includes("craving-control")) score += 2;
  if (profile.foodChallenges.includes("Skipping meals") && meal.tags.includes("meal-prep")) score += 1;
  return score;
}

function optionsForSlot(
  slot: MealSlot,
  profile: UserProfile,
  preferences: PreferenceModel,
  dayIndex: number,
) {
  const available = mealLibrary
    .filter((meal) => meal.slot === slot && respectsRestrictions(meal, profile))
    .sort((a, b) => {
      const scoreA = scoreMealForPreference(a, preferences) + challengeScore(a, profile);
      const scoreB = scoreMealForPreference(b, preferences) + challengeScore(b, profile);
      return scoreB - scoreA;
    });

  if (!available.length) {
    return [createFallbackMeal(slot, profile, dayIndex)];
  }

  const fallback = mealLibrary
    .filter((meal) => meal.slot === slot)
    .filter((meal) => !meal.avoids.some((item) => normalizedProfileText(profile).includes(item.toLowerCase())));
  const source = available.length >= 2 ? available : [...available, ...fallback];
  const rotated = [...source.slice(dayIndex), ...source.slice(0, dayIndex)];
  return rotated.slice(0, 3);
}

export function generateDietPlan(
  profile: UserProfile,
  preferences: PreferenceModel,
): DietDay[] {
  const activeSlots = slots.filter((slot) => {
    if (profile.mealsPerDay <= 2) {
      return slot !== "snack";
    }

    return true;
  });

  return dayLabels.map((dayLabel, dayIndex) => {
    const meals = activeSlots.reduce(
      (accumulator, slot) => ({
        ...accumulator,
        [slot]: optionsForSlot(slot, profile, preferences, dayIndex),
      }),
      {} as Record<MealSlot, MealOption[]>,
    );

    return {
      id: `diet-day-${dayIndex + 1}`,
      dayLabel,
      meals,
    };
  });
}
