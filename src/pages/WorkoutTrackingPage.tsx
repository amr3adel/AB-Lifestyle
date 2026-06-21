import { useMemo, useState } from "react";
import { PageShell } from "../components/PageShell";
import type {
  SessionRecord,
  SessionStatus,
  WeeklyPlan,
  WorkoutExercise,
  WorkoutLogEntry,
} from "../types";

interface WorkoutTrackingPageProps {
  plan: WeeklyPlan | null;
  workoutLogs: WorkoutLogEntry[];
  sessionRecords: Record<string, SessionRecord>;
  addWorkoutLog: (entry: Omit<WorkoutLogEntry, "id" | "loggedAt">) => void;
  setSessionStatus: (
    planId: string,
    workoutDayId: string,
    status: SessionStatus,
  ) => void;
  onBack: () => void;
}

interface DraftLog {
  weight: number | "";
  reps: number | "";
  sets: number | "";
  rpe: number | "";
  notes: string;
}

const defaultDraft: DraftLog = {
  weight: "",
  reps: "",
  sets: "",
  rpe: "",
  notes: "",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function estimateVolume(entry: WorkoutLogEntry) {
  return Number(entry.weight || 0) * Number(entry.reps || 0) * Number(entry.sets || 0);
}

function getBestSet(entries: WorkoutLogEntry[]) {
  return entries.reduce<WorkoutLogEntry | null>((best, entry) => {
    if (!best) return entry;
    if (estimateVolume(entry) > estimateVolume(best)) return entry;
    return best;
  }, null);
}

export function WorkoutTrackingPage({
  plan,
  workoutLogs,
  sessionRecords,
  addWorkoutLog,
  setSessionStatus,
  onBack,
}: WorkoutTrackingPageProps) {
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [drafts, setDrafts] = useState<Record<string, DraftLog>>({});

  const activeDay = plan?.workoutDays[activeDayIndex];

  const logsByExercise = useMemo(() => {
    return workoutLogs.reduce<Record<string, WorkoutLogEntry[]>>((accumulator, log) => {
      accumulator[log.exerciseId] = [...(accumulator[log.exerciseId] ?? []), log];
      return accumulator;
    }, {});
  }, [workoutLogs]);

  const updateDraft = (
    exerciseId: string,
    patch: Partial<DraftLog>,
  ) => {
    setDrafts((current) => ({
      ...current,
      [exerciseId]: {
        ...defaultDraft,
        ...current[exerciseId],
        ...patch,
      },
    }));
  };

  const saveExerciseLog = (exercise: WorkoutExercise) => {
    if (!plan || !activeDay) return;
    const draft = { ...defaultDraft, ...drafts[exercise.id] };

    addWorkoutLog({
      planId: plan.id,
      workoutDayId: activeDay.id,
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      weight: draft.weight,
      reps: draft.reps,
      sets: draft.sets,
      rpe: draft.rpe,
      notes: draft.notes,
    });

    setDrafts((current) => ({
      ...current,
      [exercise.id]: defaultDraft,
    }));
  };

  const sessionKey = plan && activeDay ? `${plan.id}:${activeDay.id}` : "";
  const currentStatus = sessionRecords[sessionKey]?.status;

  if (!plan || !activeDay) {
    return (
      <PageShell
        variant="workspace"
        eyebrow="Workout tracking"
        title="Generate a plan first."
        intro="Tracking unlocks once a weekly workout plan exists."
        actions={
          <button className="secondary-button" onClick={onBack}>
            Back to plan
          </button>
        }
      >
        <div className="empty-state">
          <strong>No generated workout plan found.</strong>
          <p>Return to the plan page and generate the week before logging sessions.</p>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell
      variant="workspace"
      eyebrow="Workout tracking"
      title="Log the work and watch the trend."
      intro="Record real performance per exercise, mark sessions, and use the history table to spot progress over time."
      actions={
        <>
          <button className="secondary-button" onClick={onBack}>
            Back to plan
          </button>
          <button
            className="secondary-button"
            onClick={() => setSessionStatus(plan.id, activeDay.id, "skipped")}
          >
            Mark skipped
          </button>
          <button
            className="primary-button"
            onClick={() => setSessionStatus(plan.id, activeDay.id, "complete")}
          >
            Mark complete
          </button>
        </>
      }
    >
      <div className="tracking-overview">
        <img src={activeDay.imageUrl} alt="" loading="lazy" />
        <div>
          <span className="field-label">{activeDay.dayLabel}</span>
          <h2>{activeDay.focus}</h2>
          <p>{activeDay.warmup}</p>
          <strong className={`status-pill ${currentStatus ? `is-${currentStatus}` : ""}`}>
            {currentStatus ? currentStatus : "not marked"}
          </strong>
        </div>
      </div>

      <div className="day-tabs" role="tablist" aria-label="Training days">
        {plan.workoutDays.map((day, index) => (
          <button
            className={activeDayIndex === index ? "is-active" : ""}
            key={day.id}
            onClick={() => setActiveDayIndex(index)}
          >
            Day {index + 1}
          </button>
        ))}
      </div>

      <div className="tracking-list">
        {activeDay.exercises.map((exercise) => {
          const history = logsByExercise[exercise.id] ?? [];
          const best = getBestSet(history);
          const draft = { ...defaultDraft, ...drafts[exercise.id] };
          const maxVolume = Math.max(...history.map(estimateVolume), 1);

          return (
            <article className="tracking-card" key={`${activeDay.id}-${exercise.id}`}>
              <div className="tracking-card-header">
                <img src={exercise.imageUrl} alt="" loading="lazy" />
                <div>
                  <span>{exercise.tags.slice(0, 2).join(" / ")}</span>
                  <h2>{exercise.name}</h2>
                  <p>
                    Target: {exercise.sets} sets x {exercise.reps}, {exercise.intensity}
                  </p>
                </div>
              </div>

              <div className="log-form">
                <label>
                  <span>Weight</span>
                  <input
                    type="number"
                    min="0"
                    value={draft.weight}
                    onChange={(event) =>
                      updateDraft(exercise.id, {
                        weight: event.target.valueAsNumber || "",
                      })
                    }
                  />
                </label>
                <label>
                  <span>Reps</span>
                  <input
                    type="number"
                    min="0"
                    value={draft.reps}
                    onChange={(event) =>
                      updateDraft(exercise.id, {
                        reps: event.target.valueAsNumber || "",
                      })
                    }
                  />
                </label>
                <label>
                  <span>Sets</span>
                  <input
                    type="number"
                    min="0"
                    value={draft.sets}
                    onChange={(event) =>
                      updateDraft(exercise.id, {
                        sets: event.target.valueAsNumber || "",
                      })
                    }
                  />
                </label>
                <label>
                  <span>RPE</span>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={draft.rpe}
                    onChange={(event) =>
                      updateDraft(exercise.id, {
                        rpe: event.target.valueAsNumber || "",
                      })
                    }
                  />
                </label>
                <label className="log-notes">
                  <span>Notes</span>
                  <input
                    type="text"
                    value={draft.notes}
                    placeholder="Optional"
                    onChange={(event) =>
                      updateDraft(exercise.id, { notes: event.target.value })
                    }
                  />
                </label>
                <button className="primary-button" onClick={() => saveExerciseLog(exercise)}>
                  Add log
                </button>
              </div>

              <div className="history-panel">
                <div>
                  <span className="field-label">History</span>
                  <p>
                    {best
                      ? `Best volume: ${estimateVolume(best).toLocaleString()} kg-reps`
                      : "No logs yet for this exercise."}
                  </p>
                </div>

                {history.length ? (
                  <>
                    <div className="trend-bars" aria-label="Volume trend">
                      {history
                        .slice()
                        .reverse()
                        .slice(-8)
                        .map((entry) => (
                          <span
                            key={entry.id}
                            style={{
                              height: `${Math.max(12, (estimateVolume(entry) / maxVolume) * 100)}%`,
                            }}
                            title={`${estimateVolume(entry)} volume`}
                          />
                        ))}
                    </div>
                    <div className="history-table" role="table" aria-label={`${exercise.name} history`}>
                      <div role="row">
                        <strong>Date</strong>
                        <strong>Weight</strong>
                        <strong>Reps</strong>
                        <strong>Sets</strong>
                        <strong>RPE</strong>
                      </div>
                      {history.slice(0, 5).map((entry) => (
                        <div role="row" key={entry.id}>
                          <span>{formatDate(entry.loggedAt)}</span>
                          <span>{entry.weight || "-"} kg</span>
                          <span>{entry.reps || "-"}</span>
                          <span>{entry.sets || "-"}</span>
                          <span>{entry.rpe || "-"}</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
    </PageShell>
  );
}
