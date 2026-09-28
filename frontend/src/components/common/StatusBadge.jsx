import React from 'react';

export function StatusBadge({ status, size = 'sm' }) {
  const isComplete = status?.toLowerCase() === 'complete' || status?.toLowerCase() === 'completed' || status?.toLowerCase() === 'ready';
  const isProcessing = status?.toLowerCase() === 'processing' || status?.toLowerCase() === 'running';

  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-2.5 py-1';

  if (isComplete) {
    return (
      <span className={`inline-flex items-center gap-1.5 font-mono uppercase tracking-wider font-semibold rounded text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 ${sizeClasses}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
        {status}
      </span>
    );
  }

  if (isProcessing) {
    return (
      <span className={`inline-flex items-center gap-1.5 font-mono uppercase tracking-wider font-semibold rounded text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 ${sizeClasses}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
        {status}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 font-mono uppercase tracking-wider font-semibold rounded text-slate-300 bg-slate-800/80 border border-slate-700 ${sizeClasses}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
      {status || 'IDLE'}
    </span>
  );
}