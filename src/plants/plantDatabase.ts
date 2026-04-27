export type DroughtTolerance = 'low' | 'medium' | 'high' | 'very-high';

export interface PlantProfile {
  id: string;
  name: string;
  size: 'small' | 'medium';
  waterFrequencyDays: number;
  droughtTolerance: DroughtTolerance;
  description: string;
}

export const plantProfiles: PlantProfile[] = [
  {
    id: 'palm',
    name: 'Palm',
    size: 'small',
    waterFrequencyDays: 3,
    droughtTolerance: 'medium',
    description: 'Moderate, avoid waterlogging.'
  },
  {
    id: 'lavender',
    name: 'Lavender',
    size: 'small',
    waterFrequencyDays: 6,
    droughtTolerance: 'high',
    description: 'Dry-tolerant; skip after rain.'
  },
  {
    id: 'olive-tree',
    name: 'Olive Tree',
    size: 'medium',
    waterFrequencyDays: 4,
    droughtTolerance: 'high',
    description: 'Drought-tolerant, prefers deep watering.'
  },
  {
    id: 'oregano',
    name: 'Oregano',
    size: 'small',
    waterFrequencyDays: 5,
    droughtTolerance: 'high',
    description: 'Let soil dry between waterings.'
  },
  {
    id: 'rosemary',
    name: 'Rosemary',
    size: 'small',
    waterFrequencyDays: 6,
    droughtTolerance: 'very-high',
    description: 'Very drought-tolerant; water sparingly.'
  }
];
