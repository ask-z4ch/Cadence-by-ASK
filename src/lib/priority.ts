const TYPE_WEIGHTS: Record<string, number> = {
  exam: 10,
  assignment: 7,
  university_event: 5,
  class: 3,
  extracurricular: 1,
};

export function calculatePriority(
  daysRemaining: number,
  eventType: string,
  marksWeightage?: number
): number {
  const days = Math.max(daysRemaining, 0.5);
  const typeWeight = TYPE_WEIGHTS[eventType] || 1;
  const marksWeight = marksWeightage ? marksWeightage / 100 : 1;
  return (1 / days) * typeWeight * marksWeight;
}
