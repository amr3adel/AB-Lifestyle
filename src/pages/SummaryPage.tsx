import { PageShell } from "../components/PageShell";
import type { UserProfile } from "../types";

interface SummaryPageProps {
  profile: UserProfile;
  onBack: () => void;
  onNext: () => void;
}

function joinOrFallback(values: string[], fallback = "None selected") {
  return values.length ? values.join(", ") : fallback;
}

export function SummaryPage({ profile, onBack, onNext }: SummaryPageProps) {
  return (
    <PageShell
      variant="workspace"
      eyebrow="Onboarding complete"
      title={`${profile.name || "Your"} foundation is ready.`}
      intro="Review the inputs once, then generate a weekly workout and meal plan from this foundation."
      actions={
        <>
          <button className="secondary-button" onClick={onBack}>
            Back
          </button>
          <button className="primary-button" onClick={onNext}>
            Generate plan
          </button>
        </>
      }
    >
      <div className="summary-grid">
        <article>
          <span>Profile</span>
          <strong>
            {profile.age || "-"} years, {profile.weightKg || "-"} kg,{" "}
            {profile.heightCm || "-"} cm
          </strong>
          <p>{profile.sex || "Sex not selected"}</p>
        </article>
        <article>
          <span>Training</span>
          <strong>{profile.sessionsPerWeek} sessions per week</strong>
          <p>
            {profile.primaryGoal || "Goal pending"} with{" "}
            {profile.equipment || "equipment pending"}
          </p>
        </article>
        <article>
          <span>Constraints</span>
          <strong>{joinOrFallback(profile.limitations)}</strong>
          <p>{joinOrFallback(profile.allergies)}</p>
        </article>
        <article>
          <span>Nutrition</span>
          <strong>{profile.macroTarget.calories || 0} calories</strong>
          <p>
            {profile.macroTarget.proteinGrams || 0}g protein /{" "}
            {profile.macroTarget.carbGrams || 0}g carbs /{" "}
            {profile.macroTarget.fatGrams || 0}g fat
          </p>
        </article>
        <article>
          <span>Food preferences</span>
          <strong>{joinOrFallback(profile.dietaryPreferences)}</strong>
          <p>{joinOrFallback(profile.foodChallenges)}</p>
        </article>
        <article>
          <span>Meals</span>
          <strong>{profile.mealsPerDay} meals per day</strong>
          <p>{profile.foodDislikes || "No dislikes entered"}</p>
        </article>
      </div>
    </PageShell>
  );
}
