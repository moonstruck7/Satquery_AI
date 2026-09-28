import React from 'react';
import { useAnalysis } from '../../hooks/useAnalysis.js';
import { Image as ImageIcon, Layers, Clock } from 'lucide-react';

export function InputModeSelector() {
  const { inputMode, changeInputMode } = useAnalysis();

  const modes = [
    {
      id: 'single',
      label: 'SINGLE IMAGE',
      sublabel: 'VQA & Grounding',
      icon: ImageIcon
    },
    {
      id: 'optical_sar',
      label: 'OPTICAL + SAR',
      sublabel: 'Multimodal Fusion',
      icon: Layers
    },
    {
      id: 'before_after',
      label: 'BEFORE + AFTER',
      sublabel: 'Bi-Temporal Change',
      icon: Clock
    }
  ];

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
          ANALYSIS MODE
        </label>
        <span className="text-[10px] font-mono text-cyan-400/90">
          SELECT PIPELINE
        </span>
      </div>

      <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950/80 border border-slate-800 rounded-xl">
        {modes.map((m) => {
          const Icon = m.icon;
          const isActive = inputMode === m.id;

          return (
            <button
              key={m.id}
              type="button"
              onClick={() => changeInputMode(m.id)}
              className={`flex flex-col items-center justify-center p-2 rounded-lg text-center transition-all ${
                isActive
                  ? 'bg-cyan-500/15 border border-cyan-500/50 text-cyan-300 shadow-sm shadow-cyan-950'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 mb-1 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
              <span className="text-[11px] font-mono font-bold leading-tight">
                {m.label}
              </span>
              <span className="text-[9px] font-mono text-slate-400 mt-0.5 truncate w-full">
                {m.sublabel}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}