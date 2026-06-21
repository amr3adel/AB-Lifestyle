import type {
  Equipment,
  PrimaryGoal,
  SessionDuration,
  UserProfile,
  WorkoutDay,
  WorkoutExercise,
} from "../types";

interface ExerciseTemplate {
  id: string;
  name: string;
  pattern: string;
  equipment: Array<Exclude<Equipment, "">>;
  tags: string[];
  imageUrl: string;
  avoidWhen: string[];
  alternatives: Partial<Record<string, string>>;
}

const exercises: ExerciseTemplate[] = [
  {
    id: "goblet-squat",
    name: "Goblet squat",
    pattern: "Squat",
    equipment: ["dumbbells", "home-gym", "full-gym"],
    tags: ["lower-body", "strength"],
    imageUrl: "/training/lower.svg",
    avoidWhen: ["Knee pain"],
    alternatives: { "Knee pain": "Box squat to comfortable depth" },
  },
  {
    id: "leg-press",
    name: "Leg press",
    pattern: "Squat",
    equipment: ["full-gym", "machines-only"],
    tags: ["lower-body", "machine"],
    imageUrl: "/training/lower.svg",
    avoidWhen: ["Knee pain"],
    alternatives: { "Knee pain": "Glute bridge machine" },
  },
  {
    id: "reverse-lunge",
    name: "Reverse lunge",
    pattern: "Single-leg",
    equipment: ["bodyweight", "dumbbells", "home-gym", "full-gym"],
    tags: ["lower-body", "balance"],
    imageUrl: "/training/lower.svg",
    avoidWhen: ["Knee pain"],
    alternatives: { "Knee pain": "Supported step-up, low box" },
  },
  {
    id: "romanian-deadlift",
    name: "Romanian deadlift",
    pattern: "Hinge",
    equipment: ["dumbbells", "home-gym", "full-gym"],
    tags: ["posterior-chain", "strength"],
    imageUrl: "/training/lower.svg",
    avoidWhen: ["Lower back pain"],
    alternatives: { "Lower back pain": "Hip thrust" },
  },
  {
    id: "glute-bridge",
    name: "Glute bridge",
    pattern: "Hinge",
    equipment: ["bodyweight", "dumbbells", "home-gym", "full-gym"],
    tags: ["posterior-chain", "back-friendly"],
    imageUrl: "/training/lower.svg",
    avoidWhen: [],
    alternatives: {},
  },
  {
    id: "push-up",
    name: "Push-up",
    pattern: "Push",
    equipment: ["bodyweight", "dumbbells", "home-gym", "full-gym"],
    tags: ["upper-body", "bodyweight"],
    imageUrl: "/training/upper.svg",
    avoidWhen: ["Wrist pain", "Shoulder pain"],
    alternatives: {
      "Wrist pain": "Incline push-up on handles",
      "Shoulder pain": "Machine chest press, light range",
    },
  },
  {
    id: "dumbbell-press",
    name: "Dumbbell bench press",
    pattern: "Push",
    equipment: ["dumbbells", "home-gym", "full-gym"],
    tags: ["upper-body", "strength"],
    imageUrl: "/training/upper.svg",
    avoidWhen: ["Shoulder pain"],
    alternatives: { "Shoulder pain": "Neutral-grip floor press" },
  },
  {
    id: "machine-chest-press",
    name: "Machine chest press",
    pattern: "Push",
    equipment: ["full-gym", "machines-only"],
    tags: ["upper-body", "machine"],
    imageUrl: "/training/upper.svg",
    avoidWhen: ["Shoulder pain"],
    alternatives: { "Shoulder pain": "Cable press, pain-free range" },
  },
  {
    id: "one-arm-row",
    name: "One-arm dumbbell row",
    pattern: "Pull",
    equipment: ["dumbbells", "home-gym", "full-gym"],
    tags: ["upper-body", "back"],
    imageUrl: "/training/upper.svg",
    avoidWhen: ["Lower back pain"],
    alternatives: { "Lower back pain": "Chest-supported dumbbell row" },
  },
  {
    id: "lat-pulldown",
    name: "Lat pulldown",
    pattern: "Pull",
    equipment: ["full-gym", "machines-only"],
    tags: ["upper-body", "back", "machine"],
    imageUrl: "/training/upper.svg",
    avoidWhen: ["Shoulder pain"],
    alternatives: { "Shoulder pain": "Neutral-grip cable row" },
  },
  {
    id: "band-row",
    name: "Band or towel row",
    pattern: "Pull",
    equipment: ["bodyweight", "home-gym"],
    tags: ["upper-body", "home"],
    imageUrl: "/training/upper.svg",
    avoidWhen: [],
    alternatives: {},
  },
  {
    id: "plank",
    name: "Front plank",
    pattern: "Core",
    equipment: ["bodyweight", "dumbbells", "home-gym", "full-gym", "machines-only"],
    tags: ["core"],
    imageUrl: "/training/core.svg",
    avoidWhen: ["Lower back pain", "Wrist pain"],
    alternatives: {
      "Lower back pain": "Dead bug",
      "Wrist pain": "Forearm plank",
    },
  },
  {
    id: "dead-bug",
    name: "Dead bug",
    pattern: "Core",
    equipment: ["bodyweight", "dumbbells", "home-gym", "full-gym", "machines-only"],
    tags: ["core", "back-friendly"],
    imageUrl: "/training/core.svg",
    avoidWhen: [],
    alternatives: {},
  },
  {
    id: "bike-interval",
    name: "Bike intervals",
    pattern: "Conditioning",
    equipment: ["full-gym", "machines-only", "home-gym"],
    tags: ["conditioning", "low-impact"],
    imageUrl: "/training/conditioning.svg",
    avoidWhen: [],
    alternatives: {},
  },
  {
    id: "brisk-walk",
    name: "Brisk incline walk",
    pattern: "Conditioning",
    equipment: ["bodyweight", "dumbbells", "home-gym", "full-gym", "machines-only"],
    tags: ["conditioning", "low-impact"],
    imageUrl: "/training/conditioning.svg",
    avoidWhen: [],
    alternatives: {},
  },
];

const focusCycle = [
  "Full body strength",
  "Upper body and core",
  "Lower body and conditioning",
  "Full body hypertrophy",
  "Zone 2 endurance",
  "Strength practice",
  "Mobility and recovery",
];

function hasLimitation(profile: UserProfile, value: string) {
  const other = profile.limitationOther.toLowerCase();
  return (
    profile.limitations.includes(value) ||
    (value === "Lower back pain" && other.includes("back")) ||
    (value === "Knee pain" && other.includes("knee")) ||
    (value === "Shoulder pain" && other.includes("shoulder"))
  );
}

function resolveExercise(template: ExerciseTemplate, profile: UserProfile) {
  const matchedLimitation = template.avoidWhen.find((item) =>
    hasLimitation(profile, item),
  );

  if (!matchedLimitation) {
    return template.name;
  }

  return template.alternatives[matchedLimitation] ?? template.name;
}

function getExercisePool(profile: UserProfile) {
  const equipment = profile.equipment || "bodyweight";
  return exercises.filter((exercise) =>
    exercise.equipment.includes(equipment as Exclude<Equipment, "">),
  );
}

function getSetScheme(goal: PrimaryGoal) {
  if (goal === "strength") {
    return { sets: 4, reps: "4-6", intensity: "RPE 7-8" };
  }

  if (goal === "endurance" || goal === "fat-loss") {
    return { sets: 3, reps: "12-15", intensity: "RPE 6-7" };
  }

  if (goal === "muscle-gain") {
    return { sets: 4, reps: "8-12", intensity: "RPE 7" };
  }

  return { sets: 3, reps: "8-12", intensity: "RPE 6-7" };
}

function getExerciseCount(duration: SessionDuration) {
  if (duration === "20-30") {
    return 4;
  }

  if (duration === "60-plus") {
    return 7;
  }

  return duration === "45-60" ? 6 : 5;
}

function buildExercise(
  template: ExerciseTemplate,
  profile: UserProfile,
): WorkoutExercise {
  const scheme = getSetScheme(profile.primaryGoal);
  return {
    id: template.id,
    name: resolveExercise(template, profile),
    sets: scheme.sets,
    reps:
      template.pattern === "Conditioning"
        ? profile.primaryGoal === "endurance"
          ? "20-30 min"
          : "8 rounds"
        : scheme.reps,
    intensity: template.pattern === "Conditioning" ? "Conversational to hard" : scheme.intensity,
    notes:
      template.pattern === "Conditioning"
        ? "Keep the pace controlled enough to recover for the next session."
        : "Use a controlled tempo and stop any movement that causes sharp pain.",
    tags: [...template.tags, template.pattern.toLowerCase()],
    imageUrl: template.imageUrl,
  };
}

function imageForFocus(focus: string) {
  const lowerFocus = focus.toLowerCase();
  if (lowerFocus.includes("upper")) return "/training/upper.svg";
  if (lowerFocus.includes("lower")) return "/training/lower.svg";
  if (lowerFocus.includes("endurance") || lowerFocus.includes("conditioning")) return "/training/conditioning.svg";
  if (lowerFocus.includes("mobility") || lowerFocus.includes("recovery")) return "/training/recovery.svg";
  return "/training/full-body.svg";
}

export function generateWorkoutPlan(profile: UserProfile): WorkoutDay[] {
  const pool = getExercisePool(profile);
  const patterns = ["Squat", "Hinge", "Push", "Pull", "Core", "Conditioning"];
  const count = getExerciseCount(profile.sessionDuration);

  return Array.from({ length: profile.sessionsPerWeek }, (_, dayIndex) => {
    const dayPool = patterns
      .map((pattern, patternIndex) => {
        const candidates = pool.filter((exercise) => exercise.pattern === pattern);
        return candidates[(dayIndex + patternIndex) % Math.max(candidates.length, 1)];
      })
      .filter(Boolean) as ExerciseTemplate[];

    const unique = Array.from(
      new Map(dayPool.map((exercise) => [exercise.id, exercise])).values(),
    ).slice(0, count);

    return {
      id: `workout-day-${dayIndex + 1}`,
      dayLabel: `Training Day ${dayIndex + 1}`,
      focus: focusCycle[dayIndex % focusCycle.length],
      warmup: "5-8 minutes easy cardio, dynamic hips and shoulders, then one light ramp-up set.",
      imageUrl: imageForFocus(focusCycle[dayIndex % focusCycle.length]),
      exercises: unique.map((exercise) => buildExercise(exercise, profile)),
      recovery: "Finish with easy breathing, light stretching, and a short note on energy and joints.",
    };
  });
}
