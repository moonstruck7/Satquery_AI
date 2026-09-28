import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAnalysis } from '../../hooks/useAnalysis.js';
import {
  Satellite,
  Maximize2,
  Minimize2,
  SlidersHorizontal,
  Bookmark,
  BookmarkCheck,
  Share2,
  Terminal,
  Activity,
  Layers,
  HelpCircle
} from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge.jsx';
import { Modal } from '../common/Modal.jsx';

export function TopBar() {
  const location = useLocation();
  const {
    currentAnalysis,
    isPresentationMode,
    setIsPresentationMode,
    toggleSaveCurrentAnalysis,
    addToast
  } = useAnalysis();

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [telemetryRate, setTelemetryRate] = useState('Real-Time (10Hz)');

  const getPageTitle = (pathname) => {
    switch (pathname) {
      case '/':
        return 'Overview';
      case '/workspace':
        return 'Analysis Workspace';
      case '/history':
        return 'Analysis History';
      case '/datasets':
        return 'Remote Sensing Datasets';
      case '/models':
        return 'Model & Tool Registry';
      case '/about':
        return 'About Architecture';
      default:
        return 'SatQuery Console';
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast('Current analysis link copied to clipboard.', 'success');
    }
  };

  return (
    <>
      <header className="h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-6 flex items-center justify-between z-20 shrink-0">
        {/* Left: Breadcrumbs & Current Context */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="text-slate-200 font-semibold tracking-wider">SATQUERY</span>
            <span>/</span>
            <span className="text-cyan-400 font-medium">{getPageTitle(location.pathname)}</span>
          </div>

          {location.pathname === '/workspace' && currentAnalysis?.id && (
            <div className="hidden sm:flex items-center gap-2 ml-3 pl-3 border-l border-slate-800">
              <span className="text-[11px] font-mono text-slate-400">ID:</span>
              <span className="text-xs font-mono font-bold text-slate-200 bg-slate-900 px-2 py-0.5 rounded border border-slate-700/80">
                {currentAnalysis.id}
              </span>
              <StatusBadge status={currentAnalysis.status || 'COMPLETE'} size="sm" />
            </div>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Active Task Tag */}
          {location.pathname === '/workspace' && currentAnalysis?.taskLabel && (
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>{currentAnalysis.taskLabel}</span>
            </div>
          )}

          {/* Bookmark / Save current */}
          {location.pathname === '/workspace' && currentAnalysis?.id && (
            <button
              onClick={toggleSaveCurrentAnalysis}
              className="p-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors"
              title="Bookmark / Save Analysis"
              aria-label="Save analysis"
            >
              <Bookmark className="w-4 h-4" />
            </button>
          )}

          {/* Share */}
          <button
            onClick={handleShare}
            className="p-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors"
            title="Copy Share Link"
            aria-label="Share link"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* Settings Modal Trigger */}
          <button
            onClick={() => setSettingsOpen(true)}
            className="p-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors"
            title="Application Settings"
            aria-label="Settings"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>

        </div>
      </header>

      {/* Settings Modal */}
      <Modal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        title="WORKSPACE CONFIGURATION & SETTINGS"
        actions={
          <button
            onClick={() => setSettingsOpen(false)}
            className="px-4 py-2 text-xs font-mono font-semibold bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors"
          >
            DONE
          </button>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">
              RENDER QUALITY
            </label>
            <select
              value={telemetryRate}
              onChange={(e) => setTelemetryRate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="Real-Time (10Hz)">Real-Time Local Canvas (Hardware Accelerated)</option>
              <option value="Balanced (60fps)">Balanced WebGL Interpolation</option>
              <option value="Crisp Pixel Raster">Crisp Nearest-Neighbor (Remote Sensing Standard)</option>
            </select>
          </div>

          <div className="pt-2 border-t border-slate-800">
            <h4 className="text-xs font-mono font-semibold text-slate-300 mb-1">
              BACKEND CONNECTOR STATUS
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              SatQuery AI is currently operating in <strong className="text-cyan-400">Frontend Simulation Mode</strong> with local state and device image buffers. Python / FastAPI endpoints will mount transparently to <code className="text-slate-300 bg-slate-950 px-1 py-0.5 rounded">/src/services/analysisService.js</code>.
            </p>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Client Build</span>
            <span className="text-slate-300">v2.4.0 </span>
          </div>
        </div>
      </Modal>
    </>
  );
}
