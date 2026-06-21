const exerciseImageById: Record<string, string> = {
  "goblet-squat": "/training/goblet-squat.svg",
  "leg-press": "/training/leg-press.svg",
  "reverse-lunge": "/training/reverse-lunge.svg",
  "romanian-deadlift": "/training/romanian-deadlift.svg",
  "glute-bridge": "/training/glute-bridge.svg",
  "push-up": "/training/push-up.svg",
  "dumbbell-press": "/training/dumbbell-press.svg",
  "machine-chest-press": "/training/machine-chest-press.svg",
  "one-arm-row": "/training/one-arm-row.svg",
  "lat-pulldown": "/training/lat-pulldown.svg",
  "band-row": "/training/band-row.svg",
  plank: "/training/plank.svg",
  "dead-bug": "/training/dead-bug.svg",
  "bike-interval": "/training/bike-intervals.svg",
  "brisk-walk": "/training/brisk-walk.svg",
};

export function getExerciseImageUrl(exerciseId: string, fallback = "/training/full-body.svg") {
  return exerciseImageById[exerciseId] ?? fallback;
}

export function getExerciseVideoUrl(exerciseName: string) {
  const query = encodeURIComponent(`${exerciseName} proper form tutorial`);
  return `https://www.youtube.com/results?search_query=${query}`;
}
