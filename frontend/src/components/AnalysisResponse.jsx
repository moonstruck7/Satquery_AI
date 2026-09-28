import { useState } from 'react';
import { ChevronDown, ChevronRight, AlertTriangle, Clock } from 'lucide-react';

const taskLabels = {
  vqa: 'Visual Question Answering',
  change_detection: 'Change Detection',
  captioning: 'Image Captioning',
  grounding: 'Object Grounding',
  optical_sar: 'Optical-SAR Analysis',
};

export default function AnalysisResponse({ analysis, error }) {
  const [showTech, setShowTech] = useState(false);

  if (error) {
    return (
      <div className="p-4 border-l border-white/5 h-full flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto mb-3" />
          <div className="text-sm text-white mb-2">Analysis Failed</div>
          <div className="text-xs text-gray-500 mb-4">{error}</div>
          <button className="px-4 py-2 rounded-lg bg-satellite-500/20 text-satellite-300 text-xs hover:bg-satellite-500/30 transition-colors">Retry</button>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="p-4 border-l border-white/5 h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-earth-700/50 flex items-center justify-center">
            <Clock className="w-6 h-6 text-gray-500" />
          </div>
          <div className="text-sm text-gray-400">No analysis yet</div>
          <div className="text-xs text-gray-600 mt-1">Upload imagery and ask a question to begin</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium text-white">SATQUERY ANALYSIS</span>
          <span className="flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-earthGreen-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-earthGreen-400"></span>
          </span>
        </div>
        <div className="text-[10px] font-mono text-gray-500 mb-3">{analysis.analysis_id} • {analysis.processing_time_ms}ms</div>
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-satellite-500/10 text-satellite-400 text-[10px] font-medium">
          {taskLabels[analysis.task] || analysis.task}
        </span>
      </div>

      <div className="p-4 border-b border-white/5">
        <div className="text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">Response</div>
        <p className="text-sm text-white leading-relaxed">{analysis.answer}</p>
      </div>

      <div className="p-4 border-b border-white/5">
        <div className="text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">Evidence</div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-earthGreen-400">✓ Change map generated</div>
          <div className="flex items-center gap-2 text-xs text-earthGreen-400">✓ Spatial regions identified</div>
          <div className="flex items-center gap-2 text-xs text-earthGreen-400">✓ Temporal pair validated</div>
        </div>
        {analysis.evidence?.regions?.length > 0 && (
          <div className="mt-3 space-y-2">
            {analysis.evidence.regions.map(r => (
              <div key={r.id} className="p-2 rounded-lg bg-earth-700/30 border border-white/5">
                <div className="text-xs text-white">{r.label}</div>
                <div className="text-[10px] font-mono text-gray-500">{r.area} • {r.type}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 border-b border-white/5">
        <div className="text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">Confidence / Uncertainty</div>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <div className="p-2 rounded bg-earth-700/30">
            <div className="text-[10px] text-gray-500">EVIDENCE STRENGTH</div>
            <div className="text-xs text-white font-medium">{analysis.confidence?.evidence_strength || '—'}</div>
          </div>
          <div className="p-2 rounded bg-earth-700/30">
            <div className="text-[10px] text-gray-500">FINAL ANSWER</div>
            <div className="text-xs text-white font-medium">{analysis.confidence?.final_answer || '—'}</div>
          </div>
        </div>
        <div className="p-2 rounded bg-amber-500/5 border border-amber-500/10">
          <div className="text-[10px] text-amber-400 font-medium mb-0.5">⚠ DEMO RESULT</div>
          <div className="text-[10px] text-gray-500">Confidence values are mock data for frontend demonstration</div>
        </div>
        {analysis.confidence?.uncertainty_reason && (
          <div className="mt-2 text-xs text-gray-400">
            <span className="text-gray-500">Uncertainty:</span> {analysis.confidence.uncertainty_reason}
          </div>
        )}
      </div>

      <div className="p-4 border-b border-white/5">
        <button onClick={() => setShowTech(!showTech)} className="w-full flex items-center justify-between text-xs font-medium text-gray-400 hover:text-white transition-colors">
          <span>Technical Details</span>
          {showTech ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </button>
        {showTech && (
          <div className="mt-3 grid grid-cols-2 gap-2 text-[10px] font-mono">
            <div><span className="text-gray-500">MODEL</span><div className="text-white">{analysis.model?.name}</div></div>
            <div><span className="text-gray-500">VERSION</span><div className="text-white">{analysis.model?.version}</div></div>
            <div><span className="text-gray-500">TOOL</span><div className="text-white">{analysis.tool?.name}</div></div>
            <div><span className="text-gray-500">INPUT</span><div className="text-white">{analysis.inputs?.length} image(s)</div></div>
          </div>
        )}
      </div>
    </div>
  );
}