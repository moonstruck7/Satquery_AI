import React, { useRef } from 'react';
import { useAnalysis } from '../../hooks/useAnalysis.js';
import { Send, Sparkles, Paperclip, X, CornerDownLeft } from 'lucide-react';

export function QueryComposer() {
  const {
    query,
    setQuery,
    handleRunAnalysis,
    analysisStatus,
    inputMode
  } = useAnalysis();

  const textareaRef = useRef(null);

  const isProcessing = analysisStatus === 'processing';

  const quickPromptsByMode = {
    before_after: [
      'What changed between these two dates?',
      'Has the built-up area increased?',
      'Quantify vegetation loss and infrastructure growth.',
      'Highlight the eastern quadrant changes.'
    ],
    optical_sar: [
      'Use the optical and SAR images together to identify built-up and water-covered regions.',
      'Penetrate cloud cover using SAR to map water bodies.',
      'Identify urban double-bounce backscatter.',
      'Compare vegetation canopy scatter against optical reflectance.'
    ],
    single: [
      'Describe the land-cover and major objects visible in this image.',
      'Highlight the water body referred to in the query.',
      'Detect and count maritime vessels along the berths.',
      'Identify the industrial storage tanks and logistics yard.'
    ]
  };

  const quickPrompts = quickPromptsByMode[inputMode] || quickPromptsByMode.single;

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleRunAnalysis();
    }
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label
          htmlFor="query-input"
          className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          NATURAL LANGUAGE QUERY
        </label>
        <span className="text-[10px] font-mono text-slate-400">
          Required field
        </span>
      </div>

      {/* Main Textarea Card */}
      <div className="relative border border-slate-700/80 bg-slate-900/90 rounded-xl focus-within:border-cyan-500/80 focus-within:ring-1 focus-within:ring-cyan-500/30 transition-all shadow-lg">
        <textarea
          id="query-input"
          ref={textareaRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything about the selected imagery..."
          rows={3}
          disabled={isProcessing}
          className="w-full bg-transparent px-3.5 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none resize-none leading-relaxed disabled:opacity-50"
        />

        <div className="flex items-center justify-between px-3 py-2 border-t border-slate-800/80 bg-slate-950/40 rounded-b-xl">
          <div className="flex items-center gap-1.5">
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="text-xs font-mono text-slate-400 hover:text-slate-200 p-1 rounded hover:bg-slate-800 transition-colors flex items-center gap-1"
                title="Clear query"
              >
                <X className="w-3.5 h-3.5" />
                <span className="text-[10px]">Clear</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={handleRunAnalysis}
            disabled={isProcessing || !query.trim()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-bold tracking-wider uppercase transition-all bg-linear-to-br from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-md shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
          >
            {isProcessing ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>ANALYZING...</span>
              </>
            ) : (
              <>
                <span>ASK SATQUERY</span>
                <CornerDownLeft className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>

      <div className="space-y-1">
        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wide">
          Quick Suggestions:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setQuery(p)}
              className="text-left text-[11px] px-2.5 py-1 rounded bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-slate-700 transition-colors truncate max-w-full"
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}