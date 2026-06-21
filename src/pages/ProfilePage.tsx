import { Field, UnitToggle } from "../components/FormControls";
import { equipmentOptions, goalOptions, workStyleOptions } from "../data/options";
import { generateWeeklyPlan } from "../lib/planGeneration";
import {
  exportPlannerData,
  validateImportedPlannerState,
} from "../lib/planInsights";
import {
  displayHeight,
  displayWeight,
  heightLabel,
  normalizeHeight,
  normalizeWeight,
  weightLabel,
} from "../lib/units";
import type {
  Equipment,
  PreferenceModel,
  PrimaryGoal,
  PlannerState,
  UserProfile,
  WeeklyPlan,
  WorkStyle,
} from "../types";

interface ProfilePageProps {
  state: PlannerState;
  profile: UserProfile;
  preferences: PreferenceModel;
  updateProfile: (patch: Partial<UserProfile>) => void;
  savePlan: (plan: WeeklyPlan) => void;
  replaceState: (state: PlannerState) => void;
}

export function ProfilePage({
  state,
  profile,
  preferences,
  updateProfile,
  savePlan,
  replaceState,
}: ProfilePageProps) {
  const profileErrors = [
    !profile.age ? "Please enter a valid age." : "",
    !profile.weightKg ? "Please enter a valid weight." : "",
    !profile.heightCm ? "Please enter a valid height." : "",
  ].filter(Boolean);

  const regeneratePlan = () => {
    if (profileErrors.length) return;
    savePlan(generateWeeklyPlan(profile, preferences));
  };

  const importData = async (file: File | undefined) => {
    if (!file) return;
    const text = await file.text();
    const parsed = JSON.parse(text);
    replaceState(validateImportedPlannerState(parsed));
  };

  return (
    <section className="settings-page">
      <div className="dashboard-hero compact">
        <div>
          <span className="eyebrow">Profile</span>
          <h1>Keep the plan honest.</h1>
          <p>
            Update your goal, body stats, equipment, or constraints. Regenerate when
            your real life changes.
          </p>
        </div>
        <div className="quick-actions">
          <button className="secondary-button" onClick={() => exportPlannerData(state)}>
            Export data
          </button>
          <label className="import-button">
            Import data
            <input
              type="file"
              accept="application/json"
              onChange={(event) => importData(event.target.files?.[0])}
            />
          </label>
          <button className="primary-button" onClick={regeneratePlan}>
            Regenerate plan
          </button>
        </div>
      </div>

      {profileErrors.length ? (
        <div className="inline-warning">
          {profileErrors.map((error) => (
            <span key={error}>{error}</span>
          ))}
        </div>
      ) : null}

      <div className="settings-grid">
        <article className="settings-card">
          <span className="field-label">Basics</span>
          <UnitToggle
            value={profile.unitSystem}
            onChange={(unitSystem) => updateProfile({ unitSystem })}
          />
          <div className="field-row">
            <Field label="Name">
              <input
                value={profile.name}
                onChange={(event) => updateProfile({ name: event.target.value })}
              />
            </Field>
            <Field label="Age">
              <input
                type="number"
                value={profile.age}
                onChange={(event) =>
                  updateProfile({ age: event.target.valueAsNumber || "" })
                }
              />
            </Field>
            <Field label="Weight" hint={weightLabel(profile.unitSystem)}>
              <input
                type="number"
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
        </article>

        <article className="settings-card">
          <span className="field-label">Plan settings</span>
          <div className="settings-form-grid">
            <label>
              <span>Goal</span>
              <select
                value={profile.primaryGoal}
                onChange={(event) =>
                  updateProfile({ primaryGoal: event.target.value as PrimaryGoal })
                }
              >
                {goalOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>Equipment</span>
              <select
                value={profile.equipment}
                onChange={(event) =>
                  updateProfile({ equipment: event.target.value as Equipment })
                }
              >
                {equipmentOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>Work style</span>
              <select
                value={profile.workStyle}
                onChange={(event) =>
                  updateProfile({ workStyle: event.target.value as WorkStyle })
                }
              >
                {workStyleOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>Sessions per week</span>
              <input
                type="number"
                min="1"
                max="7"
                value={profile.sessionsPerWeek}
                onChange={(event) =>
                  updateProfile({ sessionsPerWeek: event.target.valueAsNumber || 1 })
                }
              />
            </label>
          </div>
        </article>

        <article className="settings-card">
          <span className="field-label">Constraints and food notes</span>
          <div className="settings-form-grid">
            <label>
              <span>Other allergies</span>
              <input
                value={profile.allergyOther}
                onChange={(event) =>
                  updateProfile({ allergyOther: event.target.value })
                }
              />
            </label>
            <label>
              <span>Other limitations</span>
              <input
                value={profile.limitationOther}
                onChange={(event) =>
                  updateProfile({ limitationOther: event.target.value })
                }
              />
            </label>
            <label className="wide-field">
              <span>Food dislikes</span>
              <input
                value={profile.foodDislikes}
                onChange={(event) =>
                  updateProfile({ foodDislikes: event.target.value })
                }
              />
            </label>
          </div>
        </article>
      </div>
    </section>
  );
}
