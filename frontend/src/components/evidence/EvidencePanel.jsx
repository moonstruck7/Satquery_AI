import React from 'react';
import { useAnalysis } from '../../hooks/useAnalysis.js';
import { RegionCard } from './RegionCard.jsx';
import { Sparkles, Layers, Eye, Target } from 'lucide-react';

export function EvidencePanel({ evidence, regions }) {
  const { showEvidence, setShowEvidence } = useAnalysis();

  if (!evidence && (!regions || regions.length === 0)) return null;

  return (
    <div className="border border-slate-800 bg-slate-900/60 rounded-xl overflow-hidden font-mono text-xs space-y-3 p-4 max-h-105 overflow-y-auto pr-2">
      {/* Evidence Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
            VISUAL EVIDENCE & QUANTIFICATION
          </h4>
        </div>

      </div>

      {/* Summary statement */}
      {evidence?.summary && (
        <p className="text-xs text-slate-300 font-sans leading-relaxed bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
          {evidence.summary}
        </p>
      )}

      {/* Quantitative Metrics Grid */}
      {evidence?.metrics && evidence.metrics.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {evidence.metrics.map((m, idx) => (
            <div key={idx} className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 block truncate">{m.label}</span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-sm font-bold text-cyan-300">{m.value}</span>
                <span className="text-[10px] text-emerald-400 font-medium">{m.change}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detected Region Cards */}
      {regions && regions.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase tracking-wider">
            <span>Detected Entities ({regions.length})</span>
            <span>Click to isolate</span>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {regions.map((reg) => (
              <RegionCard key={reg.id} region={reg} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
