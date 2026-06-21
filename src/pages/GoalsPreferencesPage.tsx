import {
  ChoiceGrid,
  Field,
  RadioCard,
} from "../components/FormControls";
import { PageShell } from "../components/PageShell";
import {
  durationOptions,
  equipmentOptions,
  goalOptions,
} from "../data/options";
import type {
  Equipment,
  PrimaryGoal,
  SessionDuration,
  UserProfile,
} from "../types";

interface GoalsPreferencesPageProps {
  profile: UserProfile;
  updateProfile: (patch: Partial<UserProfile>) => void;
  onBack: () => void;
  onNext: () => void;
}

export function GoalsPreferencesPage({
  profile,
  updateProfile,
  onBack,
  onNext,
}: GoalsPreferencesPageProps) {
  const canContinue =
    Boolean(profile.primaryGoal) &&
    Boolean(profile.equipment) &&
    Boolean(profile.sessionDuration);

  return (
    <PageShell
      eyebrow="Training direction"
      title="Choose the plan your week can actually support."
      intro="The workout generator will use these choices to decide split, volume, exercise style, and session length."
      actions={
        <>
          <button className="secondary-button" onClick={onBack}>
            Back
          </button>
          <button className="primary-button" disabled={!canContinue} onClick={onNext}>
            Continue
          </button>
        </>
      }
    >
      <ChoiceGrid legend="Primary goal">
        {goalOptions.map((option) => (
          <RadioCard
            key={option.value}
            name="primaryGoal"
            value={option.value}
            label={option.label}
            checked={profile.primaryGoal === option.value}
            onChange={(value) =>
              updateProfile({ primaryGoal: value as PrimaryGoal })
            }
          />
        ))}
      </ChoiceGrid>

      <Field label="Training sessions per week" hint={`${profile.sessionsPerWeek} days`}>
        <input
          type="range"
          min="1"
          max="7"
          value={profile.sessionsPerWeek}
          onChange={(event) =>
            updateProfile({ sessionsPerWeek: Number(event.target.value) })
          }
        />
        <div className="range-scale" aria-hidden="true">
          <span>1</span>
          <span>7</span>
        </div>
      </Field>

      <ChoiceGrid legend="Available equipment">
        {equipmentOptions.map((option) => (
          <RadioCard
            key={option.value}
            name="equipment"
            value={option.value}
            label={option.label}
            checked={profile.equipment === option.value}
            onChange={(value) => updateProfile({ equipment: value as Equipment })}
          />
        ))}
      </ChoiceGrid>

      <ChoiceGrid legend="Session duration">
        {durationOptions.map((option) => (
          <RadioCard
            key={option.value}
            name="sessionDuration"
            value={option.value}
            label={option.label}
            checked={profile.sessionDuration === option.value}
            onChange={(value) =>
              updateProfile({ sessionDuration: value as SessionDuration })
            }
          />
        ))}
      </ChoiceGrid>
    </PageShell>
  );
}
