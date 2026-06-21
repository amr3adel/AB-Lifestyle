import { useMemo, useState } from "react";
import { PageShell } from "../components/PageShell";
import { getExerciseImageUrl, getExerciseVideoUrl } from "../lib/exerciseMedia";
import {
  estimateVolume,
  getBestLog,
  getProgressionHint,
} from "../lib/planInsights";
import type {
  SessionRecord,
  SessionStatus,
  WeeklyPlan,
  WorkoutExercise,
  WorkoutLogEntry,
  WorkoutSetLog,
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
  rpe: number | "";
  notes: string;
  setLogs: WorkoutSetLog[];
}

const defaultDraft: DraftLog = {
  weight: "",
  reps: "",
  rpe: "",
  notes: "",
  setLogs: [],
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
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
  const [notice, setNotice] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);

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

  const getDraft = (exercise: WorkoutExercise) => {
    const current = drafts[exercise.id];
    if (current?.setLogs.length) return current;

    const parsedTargetReps = Number.parseInt(exercise.reps, 10);
    const targetReps: number | "" = Number.isNaN(parsedTargetReps)
      ? ""
      : parsedTargetReps;
    return {
      ...defaultDraft,
      ...current,
      setLogs: Array.from({ length: exercise.sets }, (_, index) => ({
        setNumber: index + 1,
        weight: current?.weight ?? "",
        reps: targetReps,
        completed: false,
      })),
    };
  };

  const updateSetLog = (
    exercise: WorkoutExercise,
    setNumber: number,
    patch: Partial<WorkoutSetLog>,
  ) => {
    const draft = getDraft(exercise);
    updateDraft(exercise.id, {
      setLogs: draft.setLogs.map((setLog) =>
        setLog.setNumber === setNumber ? { ...setLog, ...patch } : setLog,
      ),
    });
  };

  const saveExerciseLog = (exercise: WorkoutExercise) => {
    if (!plan || !activeDay) return;
    const draft = getDraft(exercise);
    const completedSets = draft.setLogs.filter((setLog) => setLog.completed);
    const savedSets = completedSets.length ? completedSets : draft.setLogs;
    const totalWeight = savedSets.reduce(
      (total, setLog) => total + Number(setLog.weight || 0),
      0,
    );
    const totalReps = savedSets.reduce(
      (total, setLog) => total + Number(setLog.reps || 0),
      0,
    );
    const averageWeight = savedSets.length
      ? Math.round((totalWeight / savedSets.length) * 10) / 10
      : "";

    addWorkoutLog({
      planId: plan.id,
      workoutDayId: activeDay.id,
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      weight: averageWeight,
      reps: totalReps,
      sets: savedSets.length,
      rpe: draft.rpe,
      notes: draft.notes,
      setLogs: savedSets,
    });

    setDrafts((current) => ({
      ...current,
      [exercise.id]: defaultDraft,
    }));
    setNotice(`${exercise.name} log saved.`);
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
            onClick={() => {
              setSessionStatus(plan.id, activeDay.id, "skipped");
              setNotice(`${activeDay.dayLabel} marked skipped.`);
            }}
          >
            Mark skipped
          </button>
          <button
            className="primary-button"
            onClick={() => {
              setSessionStatus(plan.id, activeDay.id, "complete");
              setNotice(`${activeDay.dayLabel} marked complete.`);
              setShowConfetti(true);
              window.setTimeout(() => setShowConfetti(false), 1200);
            }}
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

      {notice ? <div className="inline-notice">{notice}</div> : null}
      {showConfetti ? (
        <div className="confetti-burst" aria-hidden="true">
          {Array.from({ length: 14 }, (_, index) => (
            <span key={index} />
          ))}
        </div>
      ) : null}

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
          const best = getBestLog(history);
          const draft = getDraft(exercise);
          const maxVolume = Math.max(...history.map(estimateVolume), 1);
          const progressionHint = getProgressionHint(exercise, history);
          const chartEntries = history.slice().reverse().slice(-8);
          const chartPoints = chartEntries
            .map((entry, index) => {
              const x =
                chartEntries.length === 1
                  ? 100
                  : 20 + (index * 220) / (chartEntries.length - 1);
              const y = 90 - (estimateVolume(entry) / maxVolume) * 70;
              return `${x},${y}`;
            })
            .join(" ");

          return (
            <article className="tracking-card" key={`${activeDay.id}-${exercise.id}`}>
              <div className="tracking-card-header">
                <img
                  src={getExerciseImageUrl(exercise.id, exercise.imageUrl)}
                  alt=""
                  loading="lazy"
                />
                <div>
                  <span>{exercise.tags.slice(0, 2).join(" / ")}</span>
                  <h2>{exercise.name}</h2>
                  <p>
                    Target: {exercise.sets} sets x {exercise.reps}, {exercise.intensity}
                  </p>
                  {best ? (
                    <strong className="pr-badge">
                      PR volume {estimateVolume(best).toLocaleString()}
                    </strong>
                  ) : null}
                  <a
                    className="video-link"
                    href={exercise.videoUrl ?? getExerciseVideoUrl(exercise.name)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Watch form
                  </a>
                </div>
              </div>

              <div className="progression-hint">
                <strong>Progression</strong>
                <p>{progressionHint}</p>
              </div>

              <div className="set-log-list">
                {draft.setLogs.map((setLog) => (
                  <div className="set-log-row" key={`${exercise.id}-${setLog.setNumber}`}>
                    <strong>Set {setLog.setNumber}</strong>
                    <label>
                      <span>Weight</span>
                      <input
                        type="number"
                        min="0"
                        value={setLog.weight}
                        onChange={(event) =>
                          updateSetLog(exercise, setLog.setNumber, {
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
                        value={setLog.reps}
                        onChange={(event) =>
                          updateSetLog(exercise, setLog.setNumber, {
                            reps: event.target.valueAsNumber || "",
                          })
                        }
                      />
                    </label>
                    <button
                      className={setLog.completed ? "set-check is-complete" : "set-check"}
                      onClick={() =>
                        updateSetLog(exercise, setLog.setNumber, {
                          completed: !setLog.completed,
                        })
                      }
                    >
                      {setLog.completed ? "Done" : "Check"}
                    </button>
                  </div>
                ))}
              </div>

              <div className="log-form compact">
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

              <details className="history-panel">
                <summary>
                  <span>
                    <strong>History</strong>
                    <small>
                      {best
                        ? `Best volume: ${estimateVolume(best).toLocaleString()} kg-reps`
                        : "No logs yet"}
                    </small>
                  </span>
                </summary>

                {history.length ? (
                  <>
                    <svg
                      className="trend-chart"
                      viewBox="0 0 260 110"
                      role="img"
                      aria-label="Volume trend line chart"
                    >
                      <path d="M20 90H240" />
                      <polyline points={chartPoints} />
                      {chartEntries.map((entry, index) => {
                        const x =
                          chartEntries.length === 1
                            ? 100
                            : 20 + (index * 220) / (chartEntries.length - 1);
                        const y = 90 - (estimateVolume(entry) / maxVolume) * 70;
                        return <circle key={entry.id} cx={x} cy={y} r="4" />;
                      })}
                    </svg>
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
              </details>
            </article>
          );
        })}
      </div>
    </PageShell>
  );
}
