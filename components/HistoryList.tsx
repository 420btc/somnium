import React, { useState } from 'react';
import { Trash2, Clock, Pencil, Save, X } from 'lucide-react';
import { SleepSession } from '../types';
import { deleteSleepSession, updateSleepSession } from '../services/storage';

interface HistoryListProps {
  data: SleepSession[];
  onUpdate: () => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({ data, onUpdate }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState('');
  const [draftNotes, setDraftNotes] = useState('');
  const [draftQuality, setDraftQuality] = useState(3);

  const handleDelete = (id: string) => {
    if (confirm('¿Eliminar registro?')) {
      deleteSleepSession(id);
      onUpdate();
    }
  };

  const startEdit = (session: SleepSession) => {
    setEditingId(session.id);
    setDraftName(session.name ?? '');
    setDraftNotes(session.notes ?? '');
    setDraftQuality(session.quality ?? 3);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraftName('');
    setDraftNotes('');
    setDraftQuality(3);
  };

  const saveEdit = () => {
    if (!editingId) return;
    const original = data.find(item => item.id === editingId);
    if (!original) return;
    updateSleepSession({
      ...original,
      name: draftName.trim(),
      notes: draftNotes.trim(),
      quality: draftQuality
    });
    onUpdate();
    cancelEdit();
  };

  const formatDuration = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
  };

  return (
    <div className="mt-8 mb-24 px-2">
      <h3 className="text-lg font-bold mb-4 px-2 bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">Historial Detallado</h3>
      <div className="space-y-3">
        {data.length === 0 ? (
          <div className="text-center py-10 text-zinc-600">
            <p>No hay registros de sueño aún.</p>
          </div>
        ) : (
          data.map((session) => (
            <div 
              key={session.id} 
              className="group relative flex items-center justify-between p-4 bg-zinc-900/50 border border-white/5 rounded-2xl hover:bg-zinc-800/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400">
                  <Clock size={18} />
                </div>
                <div className="space-y-1">
                  {editingId === session.id ? (
                    <input
                      value={draftName}
                      onChange={(e) => setDraftName(e.target.value)}
                      placeholder="Nombre de la noche"
                      className="w-full bg-zinc-900/80 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none"
                    />
                  ) : (
                    <p className="text-white font-medium">
                      {session.name?.trim()
                        ? session.name
                        : new Date(session.startTime).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' })}
                    </p>
                  )}
                  <p className="text-zinc-500 text-xs">
                    {new Date(session.startTime).toLocaleTimeString('es-ES', {hour: '2-digit', minute:'2-digit'})} - 
                    {session.endTime ? new Date(session.endTime).toLocaleTimeString('es-ES', {hour: '2-digit', minute:'2-digit'}) : '...'}
                  </p>
                  {editingId === session.id ? (
                    <textarea
                      value={draftNotes}
                      onChange={(e) => setDraftNotes(e.target.value)}
                      placeholder="Notas adicionales"
                      className="w-full bg-zinc-900/80 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none resize-none"
                      rows={2}
                    />
                  ) : (
                    session.notes?.trim() && (
                      <p className="text-zinc-500 text-xs max-w-[210px] overflow-hidden text-ellipsis whitespace-nowrap">{session.notes}</p>
                    )
                  )}
                  {editingId === session.id ? (
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase tracking-widest text-zinc-600">Calidad</span>
                      <select
                        value={draftQuality}
                        onChange={(e) => setDraftQuality(Number(e.target.value))}
                        className="bg-zinc-900/80 border border-white/10 rounded-lg px-2 py-1 text-xs text-white focus:outline-none"
                      >
                        {[1, 2, 3, 4, 5].map(value => (
                          <option key={value} value={value}>{value}</option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <p className="text-zinc-600 text-[11px] uppercase tracking-widest">
                      Calidad {session.quality ?? 3}/5
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="font-display font-bold text-lg text-white">
                  {formatDuration(session.durationMinutes)}
                </span>
                {editingId === session.id ? (
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={saveEdit}
                      className="p-2 text-zinc-300 hover:text-white transition-colors"
                    >
                      <Save size={16} />
                    </button>
                    <button 
                      onClick={cancelEdit}
                      className="p-2 text-zinc-600 hover:text-white transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => startEdit(session)}
                      className="p-2 text-zinc-600 hover:text-white transition-colors"
                    >
                      <Pencil size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(session.id)}
                      className="p-2 text-zinc-600 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
