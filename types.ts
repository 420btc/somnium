export interface SleepSession {
  id: string;
  startTime: string; // ISO string
  endTime: string | null; // ISO string
  durationMinutes: number;
  quality?: number; // 1-5 rating
  name?: string;
  notes?: string;
}

export interface AnalysisResult {
  summary: string;
  score: number;
  tips: string[];
}

export enum AppScreen {
  CLOCK = 'CLOCK',
  STATS = 'STATS',
  ANALYSIS = 'ANALYSIS',
  HISTORY = 'HISTORY',
  SETTINGS = 'SETTINGS'
}
