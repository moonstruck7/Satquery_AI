import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useAnalysis } from '../../hooks/useAnalysis.js';
import { SAMPLE_IMAGES } from '../../mock/images.js';
import { EvidenceOverlay } from '../evidence/EvidenceOverlay.jsx';
import { Columns, SplitSquareVertical, Eye, Layers, Flame } from 'lucide-react';

export function TemporalViewer() {
  const {
    files,
    temporalViewMode,
    setTemporalViewMode,
    splitPosition,
    setSplitPosition,
    imageOpacity,
    zoom
  } = useAnalysis();

  const containerRef = useRef(null);
  const isDragging = useRef(false);

  const [flickerState, setFlickerState] = useState(false);

  useEffect(() => {
    if (temporalViewMode !== 'flicker') return;
    const interval = setInterval(() => {
      setFlickerState((prev) => !prev);
    }, 700);
    return () => clearInterval(interval);
  }, [temporalViewMode]);

  const beforeMeta = files.before_after?.before;
  const afterMeta = files.before_after?.after;

  const beforeSrc = beforeMeta?.previewUrl || SAMPLE_IMAGES.before.url;
  const afterSrc = afterMeta?.previewUrl || SAMPLE_IMAGES.after.url;

  const beforeFallback = SAMPLE_IMAGES.before.fallbackUrl;
  const afterFallback = SAMPLE_IMAGES.after.fallbackUrl;

  const handleMouseDown = (e) => {
    isDragging.current = true;
    updateSplit(e.clientX);
  };

  const handleTouchStart = (e) => {
    isDragging.current = true;
    if (e.touches.length > 0) {
      updateSplit(e.touches[0].clientX);
    }
  };

  const updateSplit = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSplitPosition(percentage);
  }, [setSplitPosition]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging.current) return;
      updateSplit(e.clientX);
    };

    const handleTouchMove = (e) => {
      if (!isDragging.current) return;
      if (e.touches.length > 0) {
        updateSplit(e.touches[0].clientX);
      }
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [updateSplit]);

  const viewModes = [
    { id: 'split', label: 'Split Slider', icon: SplitSquareVertical },
    { id: 'side-by-side', label: 'Side by Side', icon: Columns },
    { id: 'flicker', label: 'Flicker', icon: Eye },
    { id: 'difference', label: 'Difference Map', icon: Layers },
    { id: 'change-map', label: 'Change Classes', icon: Flame }
  ];

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-slate-950 relative overflow-hidden select-none">
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900/90 border-b border-slate-800 text-[11px] font-mono shrink-0">
        <div className="flex items-center gap-1.5 text-slate-400">
          <span className="font-bold text-cyan-400">TEMPORAL ANALYSIS</span>
          <span>:</span>
          <span>{beforeMeta?.date || 'T1 (2024)'}</span>
          <span className="text-slate-600">→</span>
          <span className="text-emerald-400">{afterMeta?.date || 'T2 (2026)'}</span>
        </div>

        <div className="flex items-center gap-1">
          {viewModes.map((m) => {
            const Icon = m.icon;
            const isActive = temporalViewMode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setTemporalViewMode(m.id)}
                className={`flex items-center gap-1 px-2 py-0.5 rounded transition-colors ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
                title={m.label}
              >
                <Icon className="w-3 h-3" />
                <span className="hidden md:inline">{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Temporal Display Canvas */}
      <div
        ref={containerRef}
        className="flex-1 relative overflow-hidden flex items-center justify-center bg-slate-950"
      >
        {temporalViewMode === 'side-by-side' && (
          <div className="w-full h-full grid grid-cols-2 divide-x divide-slate-800 relative">
            <div className="relative h-full overflow-hidden flex items-center justify-center bg-slate-950">
              <img
                src={beforeSrc}
                onError={(e) => { e.currentTarget.src = beforeFallback; }}
                alt="Before Scene"
                style={{ opacity: imageOpacity, transform: `scale(${zoom})` }}
                className="w-full h-full object-cover transition-transform duration-100"
              />
              <div className="absolute top-3 left-3 px-2 py-1 rounded bg-slate-950/80 border border-slate-700 text-xs font-mono font-bold text-amber-300">
                BEFORE (T1: {beforeMeta?.date || '2024-03-15'})
              </div>
            </div>

            <div className="relative h-full overflow-hidden flex items-center justify-center bg-slate-950">
              <img
                src={afterSrc}
                onError={(e) => { e.currentTarget.src = afterFallback; }}
                alt="After Scene"
                style={{ opacity: imageOpacity, transform: `scale(${zoom})` }}
                className="w-full h-full object-cover transition-transform duration-100"
              />
              <EvidenceOverlay />
              <div className="absolute top-3 left-3 px-2 py-1 rounded bg-slate-950/80 border border-slate-700 text-xs font-mono font-bold text-cyan-300">
                AFTER (T2: {afterMeta?.date || '2026-04-18'})
              </div>
            </div>
          </div>
        )}

        {temporalViewMode === 'flicker' && (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            <img
              src={flickerState ? afterSrc : beforeSrc}
              onError={(e) => { e.currentTarget.src = flickerState ? afterFallback : beforeFallback; }}
              alt="Flicker Scene"
              style={{ opacity: imageOpacity, transform: `scale(${zoom})` }}
              className="w-full h-full object-cover transition-transform duration-100"
            />
            <EvidenceOverlay />
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-slate-950/90 border border-cyan-500/40 text-xs font-mono font-bold flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${flickerState ? 'bg-cyan-400' : 'bg-amber-400'}`}></span>
              <span>FLICKER: {flickerState ? `AFTER (${afterMeta?.date || 'T2'})` : `BEFORE (${beforeMeta?.date || 'T1'})`}</span>
            </div>
          </div>
        )}

        {temporalViewMode === 'difference' && (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-slate-950">
            <img
              src={afterSrc}
              onError={(e) => { e.currentTarget.src = afterFallback; }}
              alt="Base Imagery"
              style={{ opacity: 0.35, transform: `scale(${zoom})`, filter: 'grayscale(100%)' }}
              className="w-full h-full object-cover"
            />
            <div
              className="absolute inset-0 mix-blend-screen pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle at 68% 45%, rgba(239,68,68,0.7) 0%, rgba(245,158,11,0.5) 25%, transparent 60%)'
              }}
            />
            <EvidenceOverlay />
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-slate-950/90 border border-rose-500/40 text-xs font-mono font-bold text-rose-300">
              SPECTRAL DIFFERENCING |Δ(T2 - T1)|
            </div>
          </div>
        )}

        {temporalViewMode === 'change-map' && (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-slate-950">
            <img
              src={afterSrc}
              onError={(e) => { e.currentTarget.src = afterFallback; }}
              alt="Base Imagery"
              style={{ opacity: 0.45, transform: `scale(${zoom})`, filter: 'grayscale(80%)' }}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 800 600" preserveAspectRatio="none">
                <rect x="420" y="140" width="280" height="340" fill="rgba(239, 68, 68, 0.45)" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 2"/>
                <rect x="340" y="100" width="90" height="380" fill="rgba(245, 158, 11, 0.45)" stroke="#f59e0b" strokeWidth="2"/>
                <line x1="360" y1="200" x2="720" y2="200" stroke="#38bdf8" strokeWidth="8" strokeOpacity="0.8"/>
                <line x1="480" y1="120" x2="480" y2="500" stroke="#38bdf8" strokeWidth="8" strokeOpacity="0.8"/>
              </svg>
            </div>
            <EvidenceOverlay />

            <div className="absolute bottom-3 left-3 bg-slate-950/90 border border-slate-800 p-2.5 rounded-lg font-mono text-[10px] space-y-1 backdrop-blur-md shadow-xl">
              <div className="font-bold text-slate-300 mb-1">CHANGE MAP CLASSIFICATION</div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-red-500 opacity-80"></span>
                <span className="text-slate-300">New Built-Up (+31.4 ha)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-amber-500 opacity-80"></span>
                <span className="text-slate-300">Cleared Vegetation (-36.1 ha)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-cyan-400 opacity-80"></span>
                <span className="text-slate-300">New Road Network (+11.2 ha)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-slate-600 opacity-60"></span>
                <span className="text-slate-400">No Change Detected (380.0 ha)</span>
              </div>
            </div>
          </div>
        )}

        {temporalViewMode === 'split' && (
          <div className="relative w-full h-full overflow-hidden select-none">
            <div className="absolute inset-0 overflow-hidden flex items-center justify-center">
              <img
                src={afterSrc}
                onError={(e) => { e.currentTarget.src = afterFallback; }}
                alt="After Scene"
                style={{ opacity: imageOpacity, transform: `scale(${zoom})` }}
                className="w-full h-full object-cover transition-transform duration-100"
              />
              <EvidenceOverlay />
            </div>

            <div
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `inset(0 ${100 - splitPosition}% 0 0)` }}
            >
              <img
                src={beforeSrc}
                onError={(e) => { e.currentTarget.src = beforeFallback; }}
                alt="Before Scene"
                style={{ opacity: imageOpacity, transform: `scale(${zoom})` }}
                className="w-full h-full object-cover transition-transform duration-100"
              />
            </div>

            <div className="absolute top-3 left-3 pointer-events-none z-10 px-2 py-0.5 rounded bg-slate-950/80 border border-slate-700 text-xs font-mono font-bold text-amber-300">
              BEFORE ({beforeMeta?.date || '15 MAR 2024'})
            </div>
            <div className="absolute top-3 right-3 pointer-events-none z-10 px-2 py-0.5 rounded bg-slate-950/80 border border-slate-700 text-xs font-mono font-bold text-cyan-300">
              AFTER ({afterMeta?.date || '18 APR 2026'})
            </div>

            <div
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
              style={{ left: `${splitPosition}%` }}
              className="absolute top-0 bottom-0 w-1 bg-cyan-400 cursor-ew-resize z-20 shadow-[0_0_15px_rgba(6,182,212,0.8)]"
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-slate-900 border-2 border-cyan-400 flex items-center justify-center text-cyan-300 shadow-xl cursor-ew-resize">
                <SplitSquareVertical className="w-4 h-4" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}