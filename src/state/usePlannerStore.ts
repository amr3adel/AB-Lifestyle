import { useCallback, useEffect, useState } from "react";
import {
  defaultPlannerState,
  loadPlannerState,
  savePlannerState,
} from "../storage/localDatabase";
import type {
  MealOption,
  MealSelection,
  PlannerState,
  SessionStatus,
  UserProfile,
  WeeklyPlan,
  WorkoutLogEntry,
} from "../types";
import { recordMealSelection } from "../lib/preferenceLearning";

export function usePlannerStore() {
  const [state, setState] = useState<PlannerState>(() => {
    if (typeof window === "undefined") {
      return defaultPlannerState;
    }

    return loadPlannerState();
  });

  useEffect(() => {
    savePlannerState(state);
  }, [state]);

  const updateProfile = useCallback((patch: Partial<UserProfile>) => {
    setState((current) => ({
      ...current,
      profile: {
        ...current.profile,
        ...patch,
      },
    }));
  }, []);

  const markStepComplete = useCallback((stepId: string) => {
    setState((current) => ({
      ...current,
      completedSteps: current.completedSteps.includes(stepId)
        ? current.completedSteps
        : [...current.completedSteps, stepId],
    }));
  }, []);

  const savePlan = useCallback((plan: WeeklyPlan) => {
    setState((current) => ({
      ...current,
      plan,
    }));
  }, []);

  const selectMeal = useCallback(
    (selection: Omit<MealSelection, "selectedAt">, meal: MealOption) => {
      setState((current) => ({
        ...current,
        preferences: recordMealSelection(current.preferences, {
          ...selection,
          selectedAt: new Date().toISOString(),
        }, meal),
      }));
    },
    [],
  );

  const addWorkoutLog = useCallback(
    (entry: Omit<WorkoutLogEntry, "id" | "loggedAt">) => {
      setState((current) => ({
        ...current,
        workoutLogs: [
          {
            ...entry,
            id: `log-${Date.now()}-${entry.exerciseId}`,
            loggedAt: new Date().toISOString(),
          },
          ...current.workoutLogs,
        ],
      }));
    },
    [],
  );

  const setSessionStatus = useCallback(
    (planId: string, workoutDayId: string, status: SessionStatus) => {
      const key = `${planId}:${workoutDayId}`;
      setState((current) => ({
        ...current,
        sessionRecords: {
          ...current.sessionRecords,
          [key]: {
            planId,
            workoutDayId,
            status,
            updatedAt: new Date().toISOString(),
          },
        },
      }));
    },
    [],
  );

  return {
    state,
    profile: state.profile,
    plan: state.plan,
    preferences: state.preferences,
    workoutLogs: state.workoutLogs,
    sessionRecords: state.sessionRecords,
    updateProfile,
    markStepComplete,
    savePlan,
    selectMeal,
    addWorkoutLog,
    setSessionStatus,
  };
}
