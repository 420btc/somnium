import { SleepSession, DreamEntry, DailyJournalEntry } from '../types';

const STORAGE_KEY = 'somnium_sleep_data_v1';
const DREAMS_STORAGE_KEY = 'somnium_dreams_v1';
const JOURNAL_STORAGE_KEY = 'somnium_journal_v1';

const normalizeSession = (session: SleepSession): SleepSession => {
  return {
    ...session,
    name: session.name ?? '',
    notes: session.notes ?? '',
    quality: session.quality ?? 3
  };
};

const normalizeDreamEntry = (entry: DreamEntry): DreamEntry => {
  return {
    ...entry,
    title: entry.title ?? '',
    themes: entry.themes ?? [],
    emotions: entry.emotions ?? [],
    symbols: entry.symbols ?? [],
    nightmare: entry.nightmare ?? false
  };
};

const normalizeDailyJournalEntry = (
  entry: DailyJournalEntry
): DailyJournalEntry => {
  return {
    ...entry,
    tags: entry.tags ?? []
  };
};

export const getSleepHistory = (): SleepSession[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  const parsed = data ? JSON.parse(data) : [];
  return Array.isArray(parsed) ? parsed.map(normalizeSession) : [];
};

export const saveSleepSession = (session: SleepSession) => {
  const history = getSleepHistory();
  const updatedHistory = [normalizeSession(session), ...history];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
  return updatedHistory;
};

export const updateSleepSession = (session: SleepSession) => {
  const history = getSleepHistory();
  const index = history.findIndex(s => s.id === session.id);
  if (index !== -1) {
    history[index] = normalizeSession(session);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }
  return history;
};

export const deleteSleepSession = (id: string) => {
  const history = getSleepHistory();
  const updated = history.filter(s => s.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const getDreamEntries = (): DreamEntry[] => {
  const data = localStorage.getItem(DREAMS_STORAGE_KEY);
  const parsed = data ? JSON.parse(data) : [];
  return Array.isArray(parsed) ? parsed.map(normalizeDreamEntry) : [];
};

export const saveDreamEntry = (entry: DreamEntry) => {
  const history = getDreamEntries();
  const updatedHistory = [normalizeDreamEntry(entry), ...history];
  localStorage.setItem(DREAMS_STORAGE_KEY, JSON.stringify(updatedHistory));
  return updatedHistory;
};

export const updateDreamEntry = (entry: DreamEntry) => {
  const history = getDreamEntries();
  const index = history.findIndex(e => e.id === entry.id);
  if (index !== -1) {
    history[index] = normalizeDreamEntry(entry);
    localStorage.setItem(DREAMS_STORAGE_KEY, JSON.stringify(history));
  }
  return history;
};

export const deleteDreamEntry = (id: string) => {
  const history = getDreamEntries();
  const updated = history.filter(e => e.id !== id);
  localStorage.setItem(DREAMS_STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const getDailyJournalEntries = (): DailyJournalEntry[] => {
  const data = localStorage.getItem(JOURNAL_STORAGE_KEY);
  const parsed = data ? JSON.parse(data) : [];
  return Array.isArray(parsed)
    ? parsed.map(normalizeDailyJournalEntry)
    : [];
};

export const saveDailyJournalEntry = (entry: DailyJournalEntry) => {
  const history = getDailyJournalEntries();
  const updatedHistory = [normalizeDailyJournalEntry(entry), ...history];
  localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(updatedHistory));
  return updatedHistory;
};

export const updateDailyJournalEntry = (entry: DailyJournalEntry) => {
  const history = getDailyJournalEntries();
  const index = history.findIndex(e => e.id === entry.id);
  if (index !== -1) {
    history[index] = normalizeDailyJournalEntry(entry);
    localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(history));
  }
  return history;
};

export const deleteDailyJournalEntry = (id: string) => {
  const history = getDailyJournalEntries();
  const updated = history.filter(e => e.id !== id);
  localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(updated));
  return updated;
};
