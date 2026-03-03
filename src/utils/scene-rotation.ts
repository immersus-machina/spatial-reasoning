export interface SceneRotation {
  readonly axisX: number;
  readonly axisY: number;
  readonly axisZ: number;
  readonly speed: number;
}

export function generateSceneRotation(
  random: () => number = Math.random,
): SceneRotation {
  const x = random() - 0.5;
  const y = random() - 0.5;
  const z = random() - 0.5;
  const length = Math.hypot(x, y, z);

  return {
    axisX: x / length,
    axisY: y / length,
    axisZ: z / length,
    speed: (random() > 0.5 ? 1 : -1) * (0.3 + random() * 0.7),
  };
}
