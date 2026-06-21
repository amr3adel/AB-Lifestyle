import {
  CheckboxChip,
  ChoiceGrid,
  Field,
  RadioCard,
  UnitToggle,
  toggleListValue,
} from "../components/FormControls";
import { PageShell } from "../components/PageShell";
import {
  allergyOptions,
  limitationOptions,
  workStyleOptions,
} from "../data/options";
import type { Sex, UserProfile, WorkStyle } from "../types";
import {
  displayHeight,
  displayWeight,
  heightLabel,
  normalizeHeight,
  normalizeWeight,
  weightLabel,
} from "../lib/units";

interface PersonalDetailsPageProps {
  profile: UserProfile;
  updateProfile: (patch: Partial<UserProfile>) => void;
  onBack: () => void;
  onNext: () => void;
}

export function PersonalDetailsPage({
  profile,
  updateProfile,
  onBack,
  onNext,
}: PersonalDetailsPageProps) {
  const canContinue =
    Number(profile.age) > 0 &&
    Number(profile.weightKg) > 0 &&
    Number(profile.heightCm) > 0 &&
    Boolean(profile.sex) &&
    Boolean(profile.workStyle);

  return (
    <PageShell
      eyebrow={`Nice to meet you, ${profile.name || "there"}`}
      title="Tell us what your body and schedule need."
      intro="These details shape calorie targets, exercise choices, and recovery expectations."
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
      <div className="field-row">
        <UnitToggle
          value={profile.unitSystem}
          onChange={(unitSystem) => updateProfile({ unitSystem })}
        />
        <Field label="Age">
          <input
            type="number"
            min="13"
            max="100"
            value={profile.age}
            onChange={(event) =>
              updateProfile({ age: event.target.valueAsNumber || "" })
            }
          />
        </Field>
        <Field label="Weight" hint={weightLabel(profile.unitSystem)}>
          <input
            type="number"
            min="30"
            value={displayWeight(profile.weightKg, profile.unitSystem)}
            onChange={(event) =>
              updateProfile({
                weightKg: normalizeWeight(
                  event.target.valueAsNumber || "",
                  profile.unitSystem,
                ),
              })
            }
          />
        </Field>
        <Field label="Height" hint={heightLabel(profile.unitSystem)}>
          <input
            type="number"
            min="120"
            value={displayHeight(profile.heightCm, profile.unitSystem)}
            onChange={(event) =>
              updateProfile({
                heightCm: normalizeHeight(
                  event.target.valueAsNumber || "",
                  profile.unitSystem,
                ),
              })
            }
          />
        </Field>
      </div>

      <ChoiceGrid legend="Sex">
        {[
          { value: "female", label: "Female" },
          { value: "male", label: "Male" },
          { value: "prefer-not-to-say", label: "Prefer not to say" },
        ].map((option) => (
          <RadioCard
            key={option.value}
            name="sex"
            value={option.value}
            label={option.label}
            checked={profile.sex === option.value}
            onChange={(value) => updateProfile({ sex: value as Sex })}
          />
        ))}
      </ChoiceGrid>

      <ChoiceGrid legend="Allergies">
        {allergyOptions.map((option) => (
          <CheckboxChip
            key={option}
            label={option}
            checked={profile.allergies.includes(option)}
            onChange={(checked) =>
              updateProfile({
                allergies: toggleListValue(profile.allergies, option, checked),
              })
            }
          />
        ))}
      </ChoiceGrid>

      <Field label="Other allergies">
        <input
          type="text"
          value={profile.allergyOther}
          placeholder="Optional"
          onChange={(event) =>
            updateProfile({ allergyOther: event.target.value })
          }
        />
      </Field>

      <ChoiceGrid legend="Injuries or physical limitations">
        {limitationOptions.map((option) => (
          <CheckboxChip
            key={option}
            label={option}
            checked={profile.limitations.includes(option)}
            onChange={(checked) =>
              updateProfile({
                limitations: toggleListValue(
                  profile.limitations,
                  option,
                  checked,
                ),
              })
            }
          />
        ))}
      </ChoiceGrid>

      <Field label="Other limitations">
        <input
          type="text"
          value={profile.limitationOther}
          placeholder="Optional"
          onChange={(event) =>
            updateProfile({ limitationOther: event.target.value })
          }
        />
      </Field>

      <ChoiceGrid legend="Work style">
        {workStyleOptions.map((option) => (
          <RadioCard
            key={option.value}
            name="workStyle"
            value={option.value}
            label={option.label}
            checked={profile.workStyle === option.value}
            onChange={(value) => updateProfile({ workStyle: value as WorkStyle })}
          />
        ))}
      </ChoiceGrid>
    </PageShell>
  );
}
