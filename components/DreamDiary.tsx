import React, { useState, useEffect } from 'react';
import { Plus, Moon, Trash2, Pencil, Save, X } from 'lucide-react';
import { DreamEntry, DreamEmotion, DreamLucidityLevel } from '../types';
import {
  getDreamEntries,
  saveDreamEntry,
  updateDreamEntry,
  deleteDreamEntry
} from '../services/storage';

const defaultEmotions: DreamEmotion[] = ['miedo', 'ansiedad', 'alegria', 'tristeza', 'sorpresa', 'neutral'];

const lucidityLabels: { value: DreamLucidityLevel; label: string }[] = [
  { value: 'none', label: 'No lúcido' },
  { value: 'low', label: 'Ligeramente lúcido' },
  { value: 'medium', label: 'Lúcido' },
  { value: 'high', label: 'Muy lúcido' }
];

export const DreamDiary: React.FC = () => {
  const [entries, setEntries] = useState<DreamEntry[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftTitle, setDraftTitle] = useState('');
  const [draftText, setDraftText] = useState('');
  const [draftNightmare, setDraftNightmare] = useState(false);
  const [draftEmotions, setDraftEmotions] = useState<DreamEmotion[]>([]);
  const [draftLucidity, setDraftLucidity] = useState<DreamLucidityLevel>('none');

  useEffect(() => {
    setEntries(getDreamEntries());
  }, []);

  const resetDraft = () => {
    setDraftTitle('');
    setDraftText('');
    setDraftNightmare(false);
    setDraftEmotions([]);
    setDraftLucidity('none');
  };

  const startCreate = () => {
    setIsCreating(true);
    setEditingId(null);
    resetDraft();
  };

  const startEdit = (entry: DreamEntry) => {
    setEditingId(entry.id);
    setIsCreating(false);
    setDraftTitle(entry.title ?? '');
    setDraftText(entry.rawText);
    setDraftNightmare(entry.nightmare);
    setDraftEmotions(entry.emotions ?? []);
    setDraftLucidity(entry.lucidityLevel ?? 'none');
  };

  const cancelEditOrCreate = () => {
    setIsCreating(false);
    setEditingId(null);
    resetDraft();
  };

  const toggleEmotion = (emotion: DreamEmotion) => {
    setDraftEmotions(prev =>
      prev.includes(emotion)
        ? prev.filter(e => e !== emotion)
        : [...prev, emotion]
    );
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Eliminar sueño?')) {
      const updated = deleteDreamEntry(id);
      setEntries(updated);
    }
  };

  const persistEntry = () => {
    const now = new Date();
    const base: DreamEntry = {
      id: editingId ?? crypto.randomUUID(),
      date: now.toISOString(),
      rawText: draftText.trim(),
      title: draftTitle.trim(),
      transcriptionSource: 'text',
      emotions: draftEmotions,
      themes: [],
      symbols: [],
      lucidityLevel: draftLucidity,
      nightmare: draftNightmare,
      createdAt: editingId
        ? entries.find(e => e.id === editingId)?.createdAt ?? now.toISOString()
        : now.toISOString(),
      updatedAt: now.toISOString()
    };

    const updated = editingId
      ? updateDreamEntry(base)
      : saveDreamEntry(base);

    setEntries(updated);
    cancelEditOrCreate();
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'short'
    });
  };

  return (
    <div className="px-4 pb-24 animate-in fade-in duration-500">
      <div className="pt-4 mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold bg-gradient-to-r from-white via-zinc-200 to-zinc-600 bg-clip-text text-transparent">
            Sueños
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            Registra lo que recuerdas justo al despertar.
          </p>
        </div>
        <button
          onClick={startCreate}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-black shadow-[0_0_25px_rgba(255,255,255,0.4)] hover:bg-zinc-200 transition-colors"
        >
          <Plus size={18} />
        </button>
      </div>

      {(isCreating || editingId) && (
        <div className="mb-6 p-4 bg-zinc-900/80 border border-white/10 rounded-2xl">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <Moon size={16} className="text-white" />
            </div>
            <p className="text-xs uppercase tracking-widest text-zinc-500">
              {editingId ? 'Editar sueño' : 'Nuevo sueño'}
            </p>
          </div>

          <input
            value={draftTitle}
            onChange={(e) => setDraftTitle(e.target.value)}
            placeholder="Título opcional del sueño"
            className="w-full mb-3 bg-zinc-950 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none"
          />
          <textarea
            value={draftText}
            onChange={(e) => setDraftText(e.target.value)}
            placeholder="Escribe aquí todo lo que recuerdes, sin filtros..."
            className="w-full bg-zinc-950 border border-white/10 rounded-lg px-3 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none resize-none mb-3"
            rows={4}
          />

          <div className="flex flex-wrap gap-2 mb-3">
            {defaultEmotions.map(emotion => (
              <button
                key={emotion}
                type="button"
                onClick={() => toggleEmotion(emotion)}
                className={`px-3 py-1 rounded-full text-xs uppercase tracking-[0.18em] border ${
                  draftEmotions.includes(emotion)
                    ? 'bg-white text-black border-white'
                    : 'bg-zinc-950 text-zinc-400 border-white/10'
                }`}
              >
                {emotion}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">
                Lucidez
              </span>
              <select
                value={draftLucidity}
                onChange={(e) => setDraftLucidity(e.target.value as DreamLucidityLevel)}
                className="bg-zinc-950 border border-white/10 rounded-full px-3 py-1 text-xs text-white focus:outline-none"
              >
                {lucidityLabels.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={() => setDraftNightmare(prev => !prev)}
              className={`px-3 py-1 rounded-full text-xs uppercase tracking-[0.18em] border ${
                draftNightmare
                  ? 'bg-red-500/10 text-red-300 border-red-400/60'
                  : 'bg-zinc-950 text-zinc-400 border-white/10'
              }`}
            >
              Pesadilla
            </button>
          </div>

          <div className="flex items-center justify-end gap-2 mt-1">
            <button
              onClick={cancelEditOrCreate}
              className="px-3 py-2 rounded-full text-xs uppercase tracking-[0.18em] text-zinc-500 hover:text-white flex items-center gap-1"
            >
              <X size={14} /> Cancelar
            </button>
            <button
              onClick={persistEntry}
              disabled={!draftText.trim()}
              className="px-4 py-2 rounded-full text-xs uppercase tracking-[0.22em] bg-white text-black font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Guardar
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {entries.length === 0 ? (
          <div className="text-center py-10 text-zinc-600">
            <p>No hay sueños guardados aún.</p>
            <p className="text-xs mt-1">
              Registra el primero nada más despertar para entrenar tu memoria onírica.
            </p>
          </div>
        ) : (
          entries.map(entry => (
            <div
              key={entry.id}
              className="group relative p-4 bg-zinc-900/60 border border-white/5 rounded-2xl hover:bg-zinc-800/60 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-300">
                  <Moon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-zinc-500">
                        {formatDate(entry.date)}
                      </p>
                      <p className="text-white font-medium truncate max-w-[180px]">
                        {entry.title?.trim() || 'Sueño sin título'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => startEdit(entry)}
                        className="p-1.5 text-zinc-500 hover:text-white"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="p-1.5 text-zinc-500 hover:text-red-400"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <p className="text-zinc-400 text-xs mt-1 line-clamp-2">
                    {entry.rawText}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    {entry.nightmare && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] uppercase tracking-[0.22em] bg-red-500/10 text-red-300 border border-red-400/40">
                        Pesadilla
                      </span>
                    )}
                    {entry.lucidityLevel && entry.lucidityLevel !== 'none' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] uppercase tracking-[0.22em] bg-purple-500/10 text-purple-200 border border-purple-400/40">
                        Sueño lúcido
                      </span>
                    )}
                    {entry.emotions.slice(0, 3).map((emotion) => (
                      <span
                        key={emotion}
                        className="px-2 py-0.5 rounded-full text-[10px] uppercase tracking-[0.22em] bg-zinc-950 text-zinc-300 border border-white/10"
                      >
                        {emotion}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

