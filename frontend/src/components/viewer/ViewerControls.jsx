import React from 'react';
import { useAnalysis } from '../../hooks/useAnalysis.js';
import {
  ZoomIn,
  ZoomOut,
  Maximize,
  RotateCcw,
  Eye,
  Grid,
  Compass,
  Layers,
  Sparkles
} from 'lucide-react';

export function ViewerControls() {
  const {
    zoom,
    setZoom,
    imageOpacity,
    setImageOpacity,
    showGrid,
    setShowGrid,
    showNorth,
    setShowNorth,
    showEvidence,
    setShowEvidence
  } = useAnalysis();

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.25, 3));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.5));
  const handleResetZoom = () => {
    setZoom(1);
    setImageOpacity(1);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-slate-950/90 border-b border-slate-800 text-xs font-mono select-none">
      <div className="flex items-center gap-1">
        <button
          onClick={handleZoomOut}
          disabled={zoom <= 0.5}
          className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-cyan-300 disabled:opacity-40 transition-colors"
          title="Zoom Out (-)"
          aria-label="Zoom out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <span className="px-1.5 text-[11px] text-slate-400 font-semibold w-12 text-center">
          {Math.round(zoom * 100)}%
        </span>

        <button
          onClick={handleZoomIn}
          disabled={zoom >= 3}
          className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-cyan-300 disabled:opacity-40 transition-colors"
          title="Zoom In (+)"
          aria-label="Zoom in"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        <button
          onClick={handleResetZoom}
          className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors ml-1"
          title="Reset View"
          aria-label="Reset zoom"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
          <Eye className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[10px] text-slate-400">Opacity</span>
          <input
            type="range"
            min="0.2"
            max="1"
            step="0.05"
            value={imageOpacity}
            onChange={(e) => setImageOpacity(parseFloat(e.target.value))}
            className="w-16 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>

        <button
          onClick={() => setShowGrid(!showGrid)}
          className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
            showGrid
              ? 'bg-slate-800 text-cyan-400 border border-slate-700'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
          title="Toggle Geospatial Grid"
        >
          <Grid className="w-3.5 h-3.5" />
          <span className="text-[10px]">Grid</span>
        </button>

        <button
          onClick={() => setShowNorth(!showNorth)}
          className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
            showNorth
              ? 'bg-slate-800 text-cyan-400 border border-slate-700'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
          title="Toggle North Arrow"
        >
          <Compass className="w-3.5 h-3.5" />
          <span className="text-[10px]">North</span>
        </button>

        <button
          onClick={() => setShowEvidence(!showEvidence)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded font-bold transition-all ${
            showEvidence
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm shadow-cyan-950'
              : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
          }`}
          title="Toggle AI Evidence Overlays"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[11px]">EVIDENCE OVERLAY</span>
        </button>
      </div>
    </div>
  );
}