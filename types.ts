export interface SleepSession {
  id: string;
  startTime: string;
  endTime: string | null;
  durationMinutes: number;
  quality?: number;
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
  HISTORY = 'HISTORY',
  DREAMS = 'DREAMS',
  ANALYSIS = 'ANALYSIS',
  SETTINGS = 'SETTINGS'
}

export type DreamEmotion =
  | 'miedo'
  | 'ansiedad'
  | 'alegria'
  | 'tristeza'
  | 'sorpresa'
  | 'neutral';

export type DreamLucidityLevel = 'none' | 'low' | 'medium' | 'high';

export interface DreamSymbol {
  name: string;
  importance?: number;
}

export interface DreamEntry {
  id: string;
  date: string;
  rawText: string;
  title?: string;
  transcriptionSource?: 'voice' | 'text';
  emotions: DreamEmotion[];
  themes: string[];
  symbols: DreamSymbol[];
  lucidityLevel?: DreamLucidityLevel;
  nightmare: boolean;
  sleepSessionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DailyJournalEntry {
  id: string;
  date: string;
  mood?: 'muy_bajo' | 'bajo' | 'neutro' | 'alto' | 'muy_alto';
  stressLevel?: number;
  notes?: string;
  caffeineIntake?: 'none' | 'low' | 'medium' | 'high';
  exercise?: 'none' | 'light' | 'moderate' | 'intense';
  screenTimeLate?: 'low' | 'medium' | 'high';
  tags?: string[];
}

export interface SleepQualityPrediction {
  date: string;
  predictedScore: number;
  riskFactors: string[];
  recommendations: string[];
}
