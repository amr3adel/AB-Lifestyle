import { useEffect } from "react";
import {
  CheckboxChip,
  ChoiceGrid,
  Field,
  toggleListValue,
} from "../components/FormControls";
import { PageShell } from "../components/PageShell";
import {
  dietaryPreferenceOptions,
  foodChallengeOptions,
} from "../data/options";
import { calculateMacroTarget } from "../lib/nutrition";
import type { MacroTarget, UserProfile } from "../types";

interface DietPreferencesPageProps {
  profile: UserProfile;
  updateProfile: (patch: Partial<UserProfile>) => void;
  onBack: () => void;
  onNext: () => void;
}

export function DietPreferencesPage({
  profile,
  updateProfile,
  onBack,
  onNext,
}: DietPreferencesPageProps) {
  useEffect(() => {
    if (profile.macroTarget.manuallyOverridden) {
      return;
    }

    updateProfile({
      macroTarget: calculateMacroTarget(profile),
    });
  }, [
    profile.age,
    profile.heightCm,
    profile.primaryGoal,
    profile.sex,
    profile.weightKg,
    profile.workStyle,
    profile.macroTarget.manuallyOverridden,
    updateProfile,
  ]);

  const setMacro = (patch: Partial<MacroTarget>) => {
    updateProfile({
      macroTarget: {
        ...profile.macroTarget,
        ...patch,
        manuallyOverridden: true,
      },
    });
  };

  return (
    <PageShell
      eyebrow="Nutrition fit"
      title="Shape the meals around your appetite and constraints."
      intro="Calories and macros are estimated automatically from your details, but you can override them."
      actions={
        <>
          <button className="secondary-button" onClick={onBack}>
            Back
          </button>
          <button className="primary-button" onClick={onNext}>
            Review
          </button>
        </>
      }
    >
      <ChoiceGrid legend="Dietary restrictions and preferences">
        {dietaryPreferenceOptions.map((option) => (
          <CheckboxChip
            key={option}
            label={option}
            checked={profile.dietaryPreferences.includes(option)}
            onChange={(checked) =>
              updateProfile({
                dietaryPreferences: toggleListValue(
                  profile.dietaryPreferences,
                  option,
                  checked,
                ),
              })
            }
          />
        ))}
      </ChoiceGrid>

      <Field label="Food dislikes">
        <textarea
          value={profile.foodDislikes}
          placeholder="Foods you would rather avoid"
          onChange={(event) =>
            updateProfile({ foodDislikes: event.target.value })
          }
        />
      </Field>

      <ChoiceGrid legend="Food challenges">
        {foodChallengeOptions.map((option) => (
          <CheckboxChip
            key={option}
            label={option}
            checked={profile.foodChallenges.includes(option)}
            onChange={(checked) =>
              updateProfile({
                foodChallenges: toggleListValue(
                  profile.foodChallenges,
                  option,
                  checked,
                ),
              })
            }
          />
        ))}
      </ChoiceGrid>

      <Field label="Meals per day" hint={`${profile.mealsPerDay} meals`}>
        <input
          type="range"
          min="2"
          max="6"
          value={profile.mealsPerDay}
          onChange={(event) =>
            updateProfile({ mealsPerDay: Number(event.target.value) })
          }
        />
        <div className="range-scale" aria-hidden="true">
          <span>2</span>
          <span>6</span>
        </div>
      </Field>

      <div className="macro-card">
        <div>
          <span className="field-label">Daily calorie and macro target</span>
          <span className="field-hint">
            Mifflin-St Jeor estimate plus goal and work-style adjustment
          </span>
        </div>
        <div className="macro-grid">
          <Field label="Calories">
            <input
              type="number"
              value={profile.macroTarget.calories || ""}
              onChange={(event) =>
                setMacro({ calories: event.target.valueAsNumber || 0 })
              }
            />
          </Field>
          <Field label="Protein" hint="g">
            <input
              type="number"
              value={profile.macroTarget.proteinGrams || ""}
              onChange={(event) =>
                setMacro({ proteinGrams: event.target.valueAsNumber || 0 })
              }
            />
          </Field>
          <Field label="Carbs" hint="g">
            <input
              type="number"
              value={profile.macroTarget.carbGrams || ""}
              onChange={(event) =>
                setMacro({ carbGrams: event.target.valueAsNumber || 0 })
              }
            />
          </Field>
          <Field label="Fat" hint="g">
            <input
              type="number"
              value={profile.macroTarget.fatGrams || ""}
              onChange={(event) =>
                setMacro({ fatGrams: event.target.valueAsNumber || 0 })
              }
            />
          </Field>
        </div>
        {profile.macroTarget.manuallyOverridden ? (
          <button
            className="text-button"
            onClick={() =>
              updateProfile({ macroTarget: calculateMacroTarget(profile) })
            }
          >
            Recalculate automatically
          </button>
        ) : null}
      </div>
    </PageShell>
  );
}
