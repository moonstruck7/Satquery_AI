import React from 'react';
import { useAnalysis } from '../../hooks/useAnalysis.js';
import { Target, CheckCircle2, ChevronRight } from 'lucide-react';

export function RegionCard({ region }) {
  const { activeRegionId, setActiveRegionId } = useAnalysis();
  const isSelected = activeRegionId === region.id;
  const color = region.color || '#38bdf8';

  return (
    <div
      onClick={() => setActiveRegionId(isSelected ? null : region.id)}
      className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
        isSelected
          ? 'bg-slate-800/90 border-cyan-400 shadow-md shadow-cyan-950/50'
          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: color }}
          />
          <h5 className="font-mono font-bold text-slate-200 truncate">
            {region.label}
          </h5>
        </div>

        {region.confidence && (
          <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-cyan-300 shrink-0">
            {region.confidence}
          </span>
        )}
      </div>

      <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
        {region.details}
      </p>

      <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
        <span>BOUNDS: [{region.x}%, {region.y}%, {region.width}%, {region.height}%]</span>
        <span className="text-cyan-400 font-semibold flex items-center gap-0.5">
          {isSelected ? 'Target Locked' : 'Inspect'}
          <ChevronRight className="w-3 h-3" />
        </span>
      </div>
    </div>
  );
}