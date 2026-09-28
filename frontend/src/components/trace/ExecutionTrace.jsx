import React, { useState } from 'react';
import { Terminal, CheckCircle2, ChevronDown, ChevronUp, Clock, Cpu } from 'lucide-react';

export function ExecutionTrace({ trace }) {
  const [expanded, setExpanded] = useState(true);

  if (!trace || trace.length === 0) return null;

  return (
    <div className="border border-slate-800 bg-slate-900/60 rounded-xl overflow-hidden font-mono text-xs">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-3.5 py-2.5 bg-slate-900/90 text-left hover:bg-slate-850 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
            EXECUTION TRACE ({trace.length} EVENTS)
          </span>
        </div>
        {expanded ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
      </button>

      {expanded && (
        <div className="p-3.5 space-y-2.5 border-t border-slate-800/80 bg-slate-950/40">
          <div className="space-y-2">
            {trace.map((item) => (
              <div
                key={item.step}
                className="p-2.5 rounded-lg bg-slate-900/70 border border-slate-800/80 hover:border-slate-700 transition-colors space-y-1"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-semibold text-slate-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>
                      {item.step}. {item.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {item.duration}
                    </span>
                    <span className="text-slate-400">{item.timestamp}</span>
                  </div>
                </div>

                {item.detail && (
                  <p className="text-[11px] text-slate-400 pl-5.5 font-sans leading-tight">
                    {item.detail}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="pt-1 text-[10px] text-slate-400 flex items-center gap-1">
            <Cpu className="w-3 h-3 text-cyan-400" />
            <span>Agentic telemetry: Observable execution events published by pipeline dispatcher.</span>
          </div>
        </div>
      )}
    </div>
  );
}
