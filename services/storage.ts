import { SleepSession } from '../types';

const STORAGE_KEY = 'somnium_sleep_data_v1';

const normalizeSession = (session: SleepSession): SleepSession => {
  return {
    ...session,
    name: session.name ?? '',
    notes: session.notes ?? '',
    quality: session.quality ?? 3
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
