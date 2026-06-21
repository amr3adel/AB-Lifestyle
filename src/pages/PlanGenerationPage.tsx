import { useEffect, useMemo, useState } from "react";
import { getExerciseImageUrl, getExerciseVideoUrl } from "../lib/exerciseMedia";
import { getSelectedMealId } from "../lib/preferenceLearning";
import { generateWeeklyPlan } from "../lib/planGeneration";
import {
  buildGroceryList,
  getMealTotals,
  getSelectedMealsForDay,
} from "../lib/planInsights";
import type {
  MealOption,
  MealSlot,
  PreferenceModel,
  UserProfile,
  WeeklyPlan,
} from "../types";
import { PageShell } from "../components/PageShell";

interface PlanGenerationPageProps {
  profile: UserProfile;
  plan: WeeklyPlan | null;
  preferences: PreferenceModel;
  savePlan: (plan: WeeklyPlan) => void;
  selectMeal: (
    selection: { dayId: string; slot: MealSlot; mealId: string },
    meal: MealOption,
  ) => void;
  onBack: () => void;
  onNext: () => void;
}

const slotLabels: Record<MealSlot, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  snack: "Snack",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function PlanGenerationPage({
  profile,
  plan,
  preferences,
  savePlan,
  selectMeal,
  onBack,
  onNext,
}: PlanGenerationPageProps) {
  const [activeTab, setActiveTab] = useState<"workouts" | "meals">("workouts");
  const [activeDietDay, setActiveDietDay] = useState(0);

  useEffect(() => {
    if (!plan) {
      savePlan(generateWeeklyPlan(profile, preferences));
    }
  }, [plan, preferences, profile, savePlan]);

  const activePlan = useMemo(
    () => plan ?? generateWeeklyPlan(profile, preferences),
    [plan, preferences, profile],
  );

  const regeneratePlan = () => {
    savePlan(generateWeeklyPlan(profile, preferences));
  };

  const selectedDietDay = activePlan.dietDays[activeDietDay] ?? activePlan.dietDays[0];
  const selectedDayMeals = getSelectedMealsForDay(selectedDietDay, preferences);
  const selectedDayTotals = getMealTotals(selectedDayMeals);
  const groceryList = buildGroceryList(activePlan, preferences);

  return (
    <PageShell
      variant="workspace"
      eyebrow="Generated plan"
      title={`${profile.name || "Your"} weekly plan is ready.`}
      intro="Review the workout split and choose meal options. Your meal choices update preference weights for the next generated plan."
      actions={
        <>
          <button className="secondary-button" onClick={onBack}>
            Back
          </button>
          <button className="secondary-button" onClick={regeneratePlan}>
            Regenerate
          </button>
          <button className="primary-button" onClick={onNext}>
            Tracking comes next
          </button>
        </>
      }
    >
      <div className="plan-toolbar">
        <div>
          <span className="field-label">Plan target</span>
          <p>
            {profile.sessionsPerWeek} sessions, {profile.mealsPerDay} meals/day,{" "}
            {profile.macroTarget.calories || 0} kcal
          </p>
        </div>
        <div>
          <span className="field-label">Last generated</span>
          <p>{formatDate(activePlan.generatedAt)}</p>
        </div>
        <div>
          <span className="field-label">Selected day meals</span>
          <p>
            {selectedDayTotals.calories} kcal / {selectedDayTotals.proteinGrams}g protein
          </p>
        </div>
        <div>
          <span className="field-label">Grocery items</span>
          <p>{groceryList.length || "Choose meals to build the list"}</p>
        </div>
      </div>

      <div className="segmented-control" role="tablist" aria-label="Plan sections">
        <button
          className={activeTab === "workouts" ? "is-active" : ""}
          onClick={() => setActiveTab("workouts")}
          role="tab"
        >
          Workouts
        </button>
        <button
          className={activeTab === "meals" ? "is-active" : ""}
          onClick={() => setActiveTab("meals")}
          role="tab"
        >
          Meals
        </button>
      </div>

      {activeTab === "workouts" ? (
        <div className="plan-list">
          {activePlan.workoutDays.map((day) => (
            <article className="plan-card" key={day.id}>
              <img className="plan-card-image" src={day.imageUrl} alt="" loading="lazy" />
              <div className="plan-card-header">
                <div>
                  <span>{day.dayLabel}</span>
                  <h2>{day.focus}</h2>
                </div>
                <strong>{day.exercises.length} moves</strong>
              </div>
              <p>{day.warmup}</p>
              <div className="exercise-table">
                {day.exercises.map((exercise) => (
                  <div className="exercise-row" key={`${day.id}-${exercise.id}`}>
                    <img
                      src={getExerciseImageUrl(exercise.id, exercise.imageUrl)}
                      alt=""
                      loading="lazy"
                    />
                    <div>
                      <strong>{exercise.name}</strong>
                      <span>{exercise.notes}</span>
                      <a
                        className="video-link"
                        href={exercise.videoUrl ?? getExerciseVideoUrl(exercise.name)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Watch form
                      </a>
                    </div>
                    <dl>
                      <div>
                        <dt>Sets</dt>
                        <dd>{exercise.sets}</dd>
                      </div>
                      <div>
                        <dt>Reps</dt>
                        <dd>{exercise.reps}</dd>
                      </div>
                      <div>
                        <dt>Effort</dt>
                        <dd>{exercise.intensity}</dd>
                      </div>
                    </dl>
                  </div>
                ))}
              </div>
              <p>{day.recovery}</p>
            </article>
          ))}
        </div>
      ) : (
        <div className="meal-planner">
          <div className="meal-insights-grid">
            <article>
              <span className="field-label">Selected meals</span>
              {selectedDayMeals.length ? (
                <div className="meal-summary-list">
                  {selectedDayMeals.map((meal) => (
                    <div key={meal.id}>
                      <strong>{meal.title}</strong>
                      <span>
                        {meal.calories} kcal / {meal.proteinGrams}g protein
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p>Select one option per meal slot.</p>
              )}
            </article>
            <article>
              <span className="field-label">Grocery list</span>
              {groceryList.length ? (
                <div className="grocery-list">
                  {groceryList.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              ) : (
                <p>Pick meals and the weekly list will appear here.</p>
              )}
            </article>
          </div>

          <div className="day-tabs" role="tablist" aria-label="Diet days">
            {activePlan.dietDays.map((day, index) => (
              <button
                className={activeDietDay === index ? "is-active" : ""}
                key={day.id}
                onClick={() => setActiveDietDay(index)}
              >
                {day.dayLabel.slice(0, 3)}
              </button>
            ))}
          </div>

          <div className="meal-day">
            {Object.entries(selectedDietDay.meals).map(([slot, meals]) => (
              <section className="meal-slot" key={`${selectedDietDay.id}-${slot}`}>
                <div className="meal-slot-header">
                  <h2>{slotLabels[slot as MealSlot]}</h2>
                  <span>{meals.length} options</span>
                </div>
                <div className="meal-options">
                  {meals.map((meal) => {
                    const selectedMealId = getSelectedMealId(
                      preferences,
                      selectedDietDay.id,
                      slot,
                    );
                    const isSelected = selectedMealId === meal.id;

                    return (
                      <button
                        className={`meal-option ${isSelected ? "is-selected" : ""}`}
                        key={meal.id}
                        onClick={() =>
                          selectMeal(
                            {
                              dayId: selectedDietDay.id,
                              slot: slot as MealSlot,
                              mealId: meal.id,
                            },
                            meal,
                          )
                        }
                      >
                        <span>{meal.prepTime}</span>
                        <strong>{meal.title}</strong>
                        <p>{meal.description}</p>
                        <small>
                          {meal.calories} kcal / {meal.proteinGrams}g protein
                        </small>
                      </button>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>

          <div className="preference-panel">
            <span className="field-label">Learned preference tags</span>
            {Object.keys(preferences.tagWeights).length ? (
              <div className="tag-row">
                {Object.entries(preferences.tagWeights)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 8)
                  .map(([tag, weight]) => (
                    <span key={tag}>
                      {tag} +{weight}
                    </span>
                  ))}
              </div>
            ) : (
              <p>Choose meals to start shaping future suggestions.</p>
            )}
          </div>
        </div>
      )}
    </PageShell>
  );
}
