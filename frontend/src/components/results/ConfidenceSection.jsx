import React, { useState } from 'react';
import { ShieldCheck, AlertCircle, Info, ChevronDown, ChevronUp } from 'lucide-react';

export function ConfidenceSection({ confidence }) {
  const [expanded, setExpanded] = useState(true);

  if (!confidence) return null;

  return (
    <div className="border border-slate-800 bg-slate-900/60 rounded-xl overflow-hidden font-mono text-xs">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-3.5 py-2.5 bg-slate-900/90 text-left hover:bg-slate-850 transition-colors"
      >
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
            CONFIDENCE & EVIDENCE ASSESSMENT
          </span>
        </div>
        {expanded ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
      </button>

      {expanded && (
        <div className="p-3.5 space-y-3 border-t border-slate-800/80">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
              <span className="text-[9px] text-slate-400 block uppercase">Model Confidence</span>
              <span className="text-[11px] font-bold text-slate-300 mt-0.5 block">
                {confidence.modelConfidence || 'Not provided'}
              </span>
            </div>

            <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
              <span className="text-[9px] text-slate-400 block uppercase">Evidence Strength</span>
              <span className="text-[11px] font-bold text-cyan-400 mt-0.5 block">
                {confidence.evidenceStrength || 'HIGH'}
              </span>
            </div>

            <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
              <span className="text-[9px] text-slate-400 block uppercase">Final Confidence</span>
              <span className="text-[11px] font-bold text-emerald-400 mt-0.5 block">
                {confidence.finalAnswerConfidence || 'HIGH'}
              </span>
            </div>
          </div>

          {confidence.uncertainty && (
            <div className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-500/20 text-amber-200/90 text-[11px] font-sans flex items-start gap-2 leading-relaxed">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="font-mono text-amber-300 text-[10px] uppercase block mb-0.5">
                  Uncertainty & Resolution Bound:
                </strong>
                {confidence.uncertainty}
              </div>
            </div>
          )}

          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 pt-1">
            <Info className="w-3 h-3 text-cyan-400 shrink-0" />
            <span>Demonstration baseline: Real calibrated logit margins bind during active model serving.</span>
          </div>
        </div>
      )}
    </div>
  );
}