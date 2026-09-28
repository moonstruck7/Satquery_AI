import React, { useState, useEffect } from 'react';
import { analysisService } from '../services/analysisService.js';
import { Cpu, CheckCircle2, Zap, Layers, Sparkles, Sliders } from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge.jsx';

export function Models() {
  const [models, setModels] = useState([]);

  useEffect(() => {
    async function load() {
      const data = await analysisService.getModels();
      setModels(data);
    }
    load();
  }, []);

  return (
    <div className="min-h-full p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-xl sm:text-2xl font-bold font-mono text-slate-100 flex items-center gap-2.5">
          <Cpu className="w-6 h-6 text-cyan-400" />
          MODEL REGISTRY & SPECIALIST TOOLS
        </h1>
        <p className="text-xs text-slate-400 font-mono mt-1">
          Specialized vision-language backbones, cross-modal attention transformers, and change decoders
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {models.map((m) => (
          <div
            key={m.id}
            className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-4 shadow-xl"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold font-mono text-slate-100">
                      {m.name}
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {m.version}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400">
                    {m.category}
                  </span>
                </div>
                <StatusBadge status={m.status} size="sm" />
              </div>

              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                {m.purpose}
              </p>

              <div className="space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wide">
                  Supported Tasks:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {m.supportedTasks.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-slate-950 text-[10px] font-mono text-slate-300 border border-slate-800"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="p-2 rounded bg-slate-950/80 border border-slate-800/60">
                <span className="text-[9px] text-slate-400 uppercase block">BACKBONE</span>
                <span className="text-slate-200 font-medium block truncate mt-0.5" title={m.backbone}>
                  {m.backbone}
                </span>
              </div>

              <div className="p-2 rounded bg-slate-950/80 border border-slate-800/60">
                <span className="text-[9px] text-slate-400 uppercase block">PARAMETERS</span>
                <span className="text-cyan-400 font-semibold block mt-0.5">
                  {m.parameters}
                </span>
              </div>

              <div className="p-2 rounded bg-slate-950/80 border border-slate-800/60">
                <span className="text-[9px] text-slate-400 uppercase block">INFERENCE LATENCY</span>
                <span className="text-emerald-400 font-medium block mt-0.5">
                  {m.latency}
                </span>
              </div>

              <div className="p-2 rounded bg-slate-950/80 border border-slate-800/60">
                <span className="text-[9px] text-slate-400 uppercase block">INPUT MODALITY</span>
                <span className="text-slate-200 font-medium block truncate mt-0.5" title={m.inputType}>
                  {m.inputType}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}