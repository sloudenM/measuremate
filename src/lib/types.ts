export type GenderCategory = 'men' | 'women' | 'boys' | 'girls';

export type Measurement = {
  id: string;
  date: string; // ISO string
  height?: number; // cm
  weight?: number; // kg
  neck?: number;
  chest?: number;
  waist?: number;
  hips?: number;
  leftBicep?: number;
  rightBicep?: number;
  leftThigh?: number;
  rightThigh?: number;
  leftCalf?: number;
  rightCalf?: number;
  inseam?: number;
  sleeveLength?: number;
};

export type Profile = {
  id: string;
  name: string;
  gender: GenderCategory;
  avatarUrl: string;
  goal?: string;
  measurements: Measurement[];
};

export const measurementLabels: Record<keyof Omit<Measurement, 'id' | 'date'>, string> = {
  height: 'Height (cm)',
  weight: 'Weight (kg)',
  neck: 'Neck (cm)',
  chest: 'Chest (cm)',
  waist: 'Waist (cm)',
  hips: 'Hips (cm)',
  leftBicep: 'Left Bicep (cm)',
  rightBicep: 'Right Bicep (cm)',
  leftThigh: 'Left Thigh (cm)',
  rightThigh: 'Right Thigh (cm)',
  leftCalf: 'Left Calf (cm)',
  rightCalf: 'Right Calf (cm)',
  inseam: 'Inseam (cm)',
  sleeveLength: 'Sleeve Length (cm)',
};
