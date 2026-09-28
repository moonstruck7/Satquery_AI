import React from 'react';
import { useAnalysis } from '../../hooks/useAnalysis.js';
import { CheckCircle2, Loader2, Sparkles, Satellite } from 'lucide-react';

export function ProcessingWorkflow() {
  const { analysisStatus, processingStep } = useAnalysis();

  const stages = [
    { label: 'Understanding query', desc: 'Parsing natural language semantics & intent' },
    { label: 'Validating imagery', desc: 'Verifying raster bounds & multi-spectral bands' },
    { label: 'Selecting analysis', desc: 'Routing to remote-sensing specialist tool' },
    { label: 'Processing imagery', desc: 'Executing deep VLM cross-attention backbone' },
    { label: 'Collecting evidence', desc: 'Extracting polygon coordinates & confidence' },
    { label: 'Preparing response', desc: 'Synthesizing evidence-grounded answer' }
  ];

  if (analysisStatus !== 'processing') return null;

  return (
    <div className="absolute inset-0 z-30 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in">
      <div className="max-w-md w-full bg-slate-900 border border-cyan-500/40 rounded-2xl p-6 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            <Satellite className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-mono text-sm font-bold text-slate-100 tracking-wider flex items-center gap-2">
              SATQUERY ANALYSIS
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Executing remote sensing inference pipeline
            </p>
          </div>
        </div>

        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-linear-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${((processingStep + 1) / stages.length) * 100}%` }}
          />
        </div>

        <div className="space-y-3 font-mono text-xs">
          {stages.map((stage, idx) => {
            const isCompleted = idx < processingStep;
            const isCurrent = idx === processingStep;
            const isPending = idx > processingStep;

            return (
              <div
                key={idx}
                className={`flex items-start gap-3 p-2 rounded-lg transition-all ${
                  isCurrent
                    ? 'bg-cyan-950/40 border border-cyan-500/30 text-cyan-200'
                    : isCompleted
                    ? 'text-slate-300'
                    : 'text-slate-500 opacity-60'
                }`}
              >
                <div className="shrink-0 mt-0.5">
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : isCurrent ? (
                    <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                  ) : (
                    <span className="inline-block w-4 h-4 rounded-full border border-slate-700 text-center leading-3 text-[10px] text-slate-400">
                      ○
                    </span>
                  )}
                </div>

                <div className="flex-1">
                  <div className="font-semibold flex items-center justify-between">
                    <span>{stage.label}</span>
                    {isCompleted && (
                      <span className="text-[10px] text-emerald-400">✓ DONE</span>
                    )}
                    {isCurrent && (
                      <span className="text-[10px] text-cyan-400 animate-pulse">RUNNING</span>
                    )}
                  </div>
                  {isCurrent && (
                    <p className="text-[11px] text-cyan-300/80 font-sans mt-0.5">
                      {stage.desc}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}