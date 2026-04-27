export interface PlantRecord {
  id: string;
  lastWatered?: string;
}

const STORAGE_KEY = 'balcony-plant-records';

export function loadPlantRecords(): PlantRecord[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as PlantRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function savePlantRecords(records: PlantRecord[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}
