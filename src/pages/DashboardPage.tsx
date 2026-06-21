import { getExerciseImageUrl, getExerciseVideoUrl } from "../lib/exerciseMedia";
import {
  getCompletedSessions,
  getMealTotals,
  getSelectedMealCount,
  getSelectedMealsForDay,
} from "../lib/planInsights";
import type {
  PreferenceModel,
  SessionRecord,
  UserProfile,
  WeeklyPlan,
  WorkoutLogEntry,
} from "../types";

interface DashboardPageProps {
  profile: UserProfile;
  plan: WeeklyPlan | null;
  preferences: PreferenceModel;
  workoutLogs: WorkoutLogEntry[];
  sessionRecords: Record<string, SessionRecord>;
  navigate: (path: string) => void;
}

export function DashboardPage({
  profile,
  plan,
  preferences,
  workoutLogs,
  sessionRecords,
  navigate,
}: DashboardPageProps) {
  const todayWorkout = plan?.workoutDays[0];
  const todayMeals = getSelectedMealsForDay(plan?.dietDays[0], preferences);
  const mealTotals = getMealTotals(todayMeals);
  const completed = getCompletedSessions(plan, sessionRecords);
  const selectedMealCount = getSelectedMealCount(preferences.mealSelections);
  const workoutProgress = plan
    ? Math.round((completed / Math.max(plan.workoutDays.length, 1)) * 100)
    : 0;

  return (
    <section className="dashboard-page">
      <div className="dashboard-hero">
        <div>
          <span className="eyebrow">Amr Boghdady</span>
          <h1>{profile.name ? `${profile.name}'s plan` : "Your plan"}</h1>
          <p>
            A clean snapshot of training, meals, and progress for the current week.
          </p>
        </div>
        <div className="hero-stats">
          <article>
            <span>{workoutProgress}%</span>
            <p>Workout completion</p>
          </article>
          <article>
            <span>{selectedMealCount}</span>
            <p>Meal choices saved</p>
          </article>
          <article>
            <span>{workoutLogs.length}</span>
            <p>Exercise logs</p>
          </article>
        </div>
      </div>

      <div className="dashboard-grid">
        <article className="dashboard-card today-workout-card">
          <div className="card-title-row">
            <div>
              <span className="field-label">Today workout</span>
              <h2>{todayWorkout?.focus ?? "No workout generated"}</h2>
            </div>
            <button className="text-button" onClick={() => navigate("/tracking")}>
              Track
            </button>
          </div>
          {todayWorkout ? (
            <>
              <img src={todayWorkout.imageUrl} alt="" loading="lazy" />
              <div className="compact-exercise-list">
                {todayWorkout.exercises.slice(0, 4).map((exercise) => (
                  <a
                    href={exercise.videoUrl ?? getExerciseVideoUrl(exercise.name)}
                    key={exercise.id}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <img
                      src={getExerciseImageUrl(exercise.id, exercise.imageUrl)}
                      alt=""
                      loading="lazy"
                    />
                    <span>{exercise.name}</span>
                    <strong>
                      {exercise.sets} x {exercise.reps}
                    </strong>
                  </a>
                ))}
              </div>
            </>
          ) : (
            <div className="empty-state">
              <strong>No generated workout yet.</strong>
              <p>Create a plan to unlock today's workout.</p>
            </div>
          )}
        </article>

        <article className="dashboard-card">
          <div className="card-title-row">
            <div>
              <span className="field-label">Nutrition</span>
              <h2>{mealTotals.calories || profile.macroTarget.calories || 0} kcal</h2>
            </div>
            <button className="text-button" onClick={() => navigate("/plan")}>
              Meals
            </button>
          </div>
          <div className="macro-strip">
            <span>{mealTotals.proteinGrams || profile.macroTarget.proteinGrams || 0}g protein</span>
            <span>{profile.macroTarget.carbGrams || 0}g carbs</span>
            <span>{profile.macroTarget.fatGrams || 0}g fat</span>
          </div>
          <div className="meal-summary-list">
            {todayMeals.length ? (
              todayMeals.map((meal) => (
                <div key={meal.id}>
                  <strong>{meal.title}</strong>
                  <span>
                    {meal.calories} kcal / {meal.proteinGrams}g protein
                  </span>
                </div>
              ))
            ) : (
              <p>Choose meals in the plan screen to populate today.</p>
            )}
          </div>
        </article>

        <article className="dashboard-card">
          <span className="field-label">Quick actions</span>
          <div className="quick-actions">
            <button className="primary-button" onClick={() => navigate("/plan")}>
              Review plan
            </button>
            <button className="secondary-button" onClick={() => navigate("/tracking")}>
              Log workout
            </button>
            <button className="secondary-button" onClick={() => navigate("/profile")}>
              Edit profile
            </button>
          </div>
        </article>
      </div>
    </section>
  );
}
