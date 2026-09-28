import React, { useState } from 'react';
import { useAnalysis } from '../hooks/useAnalysis.js';
import { BeforeAfterUploader } from '../components/upload/BeforeAfterUploader.jsx';
import { QueryComposer } from '../components/analysis/QueryComposer.jsx';
import { ArrowRight, Sparkles, Satellite } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function NewAnalysis() {
  const { clearAllFiles, files, query } = useAnalysis();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = () => {
    const hasBeforeAfter = files?.before_after?.before && files?.before_after?.after;
    const hasSingle = files?.single;
    if (!hasBeforeAfter && !hasSingle) {
      setErrorMsg('Please upload imagery before submitting.');
      return;
    }
    if (!query.trim()) {
      setErrorMsg('Please enter a query before submitting.');
      return;
    }
    setErrorMsg('');
    setIsLoading(true);
    setTimeout(() => {
      navigate('/workspace');
      setIsLoading(false);
    }, 5000);
  };

  return (
    <div className="h-full w-full p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-start min-h-0 overflow-y-auto">
      <div className="max-w-xl w-full space-y-8">
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-xl bg-linear-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Satellite className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold font-mono text-slate-100">NEW ANALYSIS</h1>
          <p className="text-sm text-cyan-300 font-mono">Upload imagery, submit query, get evidence.</p>
        </div>

        {/* Empty Input Area */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur-md shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">IMAGERY BUFFER</span>
          </div>
          <BeforeAfterUploader />
        </div>

        {/* Query */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur-md shadow-xl space-y-3">
          <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">QUERY</label>
          <QueryComposer required={true} />
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-mono text-base font-bold tracking-wider transition-all shadow-xl ${
            isLoading
              ? 'bg-slate-700 text-slate-400 cursor-wait'
              : 'bg-linear-to-br from-cyan-400 to-blue-500 text-slate-950 hover:from-cyan-300 hover:to-blue-400 hover:scale-[1.01] active:scale-[0.99]'
          }`}>
          {isLoading ? (
            <>
              <span className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
              <span>ANALYZING... (5s)</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>SUBMIT & VIEW RESULTS</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
        {errorMsg && (
          <p className="text-xs text-rose-400 font-mono text-center -mt-2">{errorMsg}</p>
        )}
      </div>
    </div>
  );
}
