import React, { useState } from 'react';
import { useAnalysis } from '../../hooks/useAnalysis.js';
import { StatusBadge } from '../common/StatusBadge.jsx';
import { ConfidenceSection } from './ConfidenceSection.jsx';
import { EvidencePanel } from '../evidence/EvidencePanel.jsx';
import { ExecutionTrace } from '../trace/ExecutionTrace.jsx';
import { FollowUpChat } from './FollowUpChat.jsx';
import {
  Satellite,
  Layers,
  Clock,
  Cpu,
  Bookmark,
  Share2,
  FileCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export function ResultPanel() {
  const { currentAnalysis, analysisStatus, toggleSaveCurrentAnalysis } = useAnalysis();
  const [openSections, setOpenSections] = useState({
    evidence: false,
    confidence: false,
    trace: false,
    followUp: false
  });

  const toggle = (key) => setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));

  if (!currentAnalysis) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-500 font-mono text-xs border border-dashed border-slate-800 rounded-xl">
        <Satellite className="w-10 h-10 mb-3 opacity-30 text-cyan-400" />
        <p className="font-bold text-slate-400">NO ACTIVE ANALYSIS</p>
        <p className="text-[11px] mt-1 text-slate-400">
          Upload imagery and submit a query to generate evidence-grounded remote sensing insights.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col min-h-0 space-y-3 overflow-y-auto pr-1 pb-4">
      {/* Header Card */}
      <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/80 shadow-xl space-y-3 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-cyan-400 tracking-wider">
              SATQUERY ANALYSIS
            </span>
            <span className="text-slate-600">·</span>
            <span className="font-mono text-[11px] text-slate-400">
              {currentAnalysis.id}
            </span>
          </div>
          <StatusBadge status={currentAnalysis.status || 'COMPLETE'} />
        </div>
        <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-2 border-t border-slate-800/80">
          <div>
            <span className="text-slate-400 block text-[9px] uppercase">TASK</span>
            <span className="font-semibold text-slate-200 block truncate">{currentAnalysis.taskLabel || currentAnalysis.task}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[9px] uppercase">PROCESSING TIME</span>
            <span className="font-semibold text-cyan-400 flex items-center gap-1"><Clock className="w-3 h-3 text-cyan-400" />{currentAnalysis.processingTime || '2.8s'}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[9px] uppercase">MODEL</span>
            <span className="font-semibold text-slate-200 block truncate">{currentAnalysis.model || 'SatQuery RS-VLM'}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[9px] uppercase">TOOL</span>
            <span className="font-semibold text-slate-200 block truncate">{currentAnalysis.tool || 'Change Detection'}</span>
          </div>
        </div>
      </div>

      {/* Synthesized Answer */}
      <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/90 shadow-xl space-y-2 shrink-0">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
            <FileCheck className="w-3.5 h-3.5" /> SYNTHESIZED ANSWER
          </span>
          <button onClick={toggleSaveCurrentAnalysis} className="text-[11px] font-mono text-slate-400 hover:text-cyan-300 flex items-center gap-1" title="Save">
            <Bookmark className="w-3.5 h-3.5" /> Save
          </button>
        </div>
        <p className="text-sm font-medium text-slate-100 leading-relaxed font-sans">"{currentAnalysis.answer}"</p>
      </div>

      {/* Evidence Dropdown */}
      <div className="border border-slate-800 rounded-xl overflow-hidden shrink-0">
        <button onClick={() => toggle('evidence')} className="w-full flex items-center justify-between px-4 py-3 bg-slate-900/80 hover:bg-slate-850 text-left transition-colors">
          <span className="font-bold text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-2">VISUAL EVIDENCE {openSections.evidence ? <ChevronUp className="w-3 h-3"/> : <ChevronDown className="w-3 h-3"/>}</span>
        </button>
        {openSections.evidence && (
          <div className="p-3 bg-slate-900/40">
            <EvidencePanel evidence={currentAnalysis.evidence} regions={currentAnalysis.regions} />
          </div>
        )}
      </div>

      {/* Confidence Dropdown */}
      <div className="border border-slate-800 rounded-xl overflow-hidden shrink-0">
        <button onClick={() => toggle('confidence')} className="w-full flex items-center justify-between px-4 py-3 bg-slate-900/80 hover:bg-slate-850 text-left transition-colors">
          <span className="font-bold text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-2">CONFIDENCE & EVIDENCE ASSESSMENT {openSections.confidence ? <ChevronUp className="w-3 h-3"/> : <ChevronDown className="w-3 h-3"/>}</span>
        </button>
        {openSections.confidence && <div className="p-3 bg-slate-900/40"><ConfidenceSection confidence={currentAnalysis.confidence} /></div>}
      </div>

      {/* Execution Trace Dropdown */}
      <div className="border border-slate-800 rounded-xl overflow-hidden shrink-0">
        <button onClick={() => toggle('trace')} className="w-full flex items-center justify-between px-4 py-3 bg-slate-900/80 hover:bg-slate-850 text-left transition-colors">
          <span className="font-bold text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-2">EXECUTION TRACE ({currentAnalysis.executionTrace?.length || 7} EVENTS) {openSections.trace ? <ChevronUp className="w-3 h-3"/> : <ChevronDown className="w-3 h-3"/>}</span>
        </button>
        {openSections.trace && <div className="p-3 bg-slate-900/40"><ExecutionTrace trace={currentAnalysis.executionTrace} /></div>}
      </div>

      {/* Interactive Conversation Dropdown */}
      <div className="border border-slate-800 rounded-xl overflow-hidden shrink-0">
        <button onClick={() => toggle('followUp')} className="w-full flex items-center justify-between px-4 py-3 bg-slate-900/80 hover:bg-slate-850 text-left transition-colors">
          <span className="font-bold text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-2">INTERACTIVE CONVERSATION {openSections.followUp ? <ChevronUp className="w-3 h-3"/> : <ChevronDown className="w-3 h-3"/>}</span>
        </button>
        {openSections.followUp && <div className="p-3 bg-slate-900/40"><FollowUpChat /></div>}
      </div>
    </div>
  );
}