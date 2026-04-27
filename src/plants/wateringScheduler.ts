import { PlantProfile } from './plantDatabase';

function getSeason(date: Date): 'summer' | 'winter' | 'spring' | 'autumn' {
  const month = date.getMonth() + 1;
  if (month >= 5 && month <= 9) return 'summer';
  if (month === 12 || month <= 2) return 'winter';
  if (month === 3 || month === 4) return 'spring';
  return 'autumn';
}

function getSeasonFactor(season: ReturnType<typeof getSeason>): number {
  switch (season) {
    case 'winter':
      return 1.5;
    case 'spring':
    case 'autumn':
      return 1.1;
    case 'summer':
    default:
      return 1.0;
  }
}

function clampDays(days: number): number {
  return Math.max(3, Math.round(days));
}

export function getNextWateringDate(
  record: { lastWatered?: string },
  profile: PlantProfile,
  rainMm: number | null,
  today = new Date()
): Date {
  const season = getSeason(today);
  const baseFrequency = clampDays(profile.waterFrequencyDays * getSeasonFactor(season));
  const next = record.lastWatered ? new Date(record.lastWatered) : new Date(today);
  next.setHours(9, 0, 0, 0);

  if (record.lastWatered) {
    next.setDate(next.getDate() + baseFrequency);
  }

  if (rainMm !== null && rainMm > 5 && profile.droughtTolerance !== 'low') {
    next.setDate(next.getDate() + 1);
  }

  return next;
}

export function shouldWaterToday(
  record: { lastWatered?: string },
  profile: PlantProfile,
  rainMm: number | null,
  today = new Date()
): boolean {
  if (!record.lastWatered) {
    return true;
  }

  const next = getNextWateringDate(record, profile, rainMm, today);
  return next <= today;
}

export function getPlantStatus(record: { lastWatered?: string }, profile: PlantProfile, rainMm: number | null) {
  const nextWatering = getNextWateringDate(record, profile, rainMm);
  const needsWater = shouldWaterToday(record, profile, rainMm);

  return {
    needsWater,
    nextWatering,
    lastWatered: record.lastWatered
  };
}
