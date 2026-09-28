import { ChevronDown, ChevronRight, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export default function ExecutionTrace({ analysis }) {
  const [expanded, setExpanded] = useState(false);

  if (!analysis?.trace || analysis.trace.length === 0) return null;

  const trace = analysis.trace;

  return (
    <div className="border-t border-white/5">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-medium text-gray-400 hover:text-white transition-colors"
      >
        <span>EXECUTION TRACE</span>
        {expanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
      </button>
      {expanded && (
        <div className="px-4 pb-3 space-y-1.5">
          {trace.map((t, i) => (
            <div key={i} className="flex items-start gap-2">
              {t.status === 'complete' ? (
                <CheckCircle className="w-3 h-3 text-earthGreen-400 mt-0.5 shrink-0" />
              ) : (
                <div className="w-3 h-3 mt-0.5 shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="text-[11px] text-white">{t.label}</div>
                <div className="text-[10px] font-mono text-gray-500">{t.duration_ms}ms</div>
              </div>
            </div>
          ))}
          <div className="mt-2 pt-2 border-t border-white/5 text-[10px] font-mono text-gray-500">
            Total: {trace.reduce((s, t) => s + t.duration_ms, 0)}ms
          </div>
        </div>
      )}
    </div>
  );
}