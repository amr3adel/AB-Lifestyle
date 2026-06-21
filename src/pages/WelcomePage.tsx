import { Field } from "../components/FormControls";
import { PageShell } from "../components/PageShell";
import type { UserProfile } from "../types";

interface WelcomePageProps {
  profile: UserProfile;
  updateProfile: (patch: Partial<UserProfile>) => void;
  onNext: () => void;
}

export function WelcomePage({
  profile,
  updateProfile,
  onNext,
}: WelcomePageProps) {
  const canContinue = profile.name.trim().length >= 2;

  return (
    <PageShell
      eyebrow="Welcome"
      title="Build a plan that fits your real life."
      intro="Start with your name so the rest of the experience feels personal and easy to follow."
      actions={
        <button className="primary-button" disabled={!canContinue} onClick={onNext}>
          Continue
        </button>
      }
    >
      <Field label="Your name">
        <input
          autoFocus
          type="text"
          value={profile.name}
          placeholder="Amr"
          onChange={(event) => updateProfile({ name: event.target.value })}
        />
      </Field>
    </PageShell>
  );
}
