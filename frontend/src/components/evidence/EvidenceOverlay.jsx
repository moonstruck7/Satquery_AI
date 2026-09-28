import React from 'react';
import { useAnalysis } from '../../hooks/useAnalysis.js';

export function EvidenceOverlay() {
  const {
    currentAnalysis,
    showEvidence,
    activeRegionId,
    setActiveRegionId
  } = useAnalysis();

  const regions = (currentAnalysis?.regions || []).map(r => {
    // Normalize bbox [x1, y1, x2, y2] or {x, y, width, height} to percentages
    // Mock images are ~800x600, so divide pixel values by 8 / 6 for approximate %
    if (r.bbox && r.bbox.length === 4) {
      const [x1, y1, x2, y2] = r.bbox;
      return {
        ...r,
        x: Math.round((x1 / 800) * 100),
        y: Math.round((y1 / 600) * 100),
        width: Math.round(((x2 - x1) / 800) * 100),
        height: Math.round(((y2 - y1) / 600) * 100),
        color: r.color || '#38bdf8'
      };
    }
    return {
      ...r,
      x: r.x || 0,
      y: r.y || 0,
      width: r.width || 10,
      height: r.height || 10,
      color: r.color || '#38bdf8'
    };
  });

  if (!showEvidence || regions.length === 0) {
    return null;
  }

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {regions.map((region) => {
        const isSelected = activeRegionId === region.id;
        const color = region.color || '#38bdf8';

        return (
          <div
            key={region.id}
            onClick={(e) => {
              e.stopPropagation();
              setActiveRegionId(isSelected ? null : region.id);
            }}
            className={`pointer-events-auto absolute cursor-pointer transition-all duration-200 group rounded ${
              isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-950 scale-[1.01]' : 'hover:scale-[1.005]'
            }`}
            style={{
              left: `${region.x}%`,
              top: `${region.y}%`,
              width: `${region.width}%`,
              height: `${region.height}%`,
              border: `2px solid ${color}`,
              backgroundColor: isSelected ? `${color}40` : `${color}20`
            }}
          >
            <div
              className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2"
              style={{ borderColor: color }}
            />
            <div
              className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2"
              style={{ borderColor: color }}
            />
            <div
              className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2"
              style={{ borderColor: color }}
            />
            <div
              className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2"
              style={{ borderColor: color }}
            />

            <div
              className="absolute -top-6 left-0 px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-tight text-white whitespace-nowrap shadow-lg flex items-center gap-1.5 backdrop-blur-md"
              style={{ backgroundColor: color }}
            >
              <span>{region.label}</span>
              {region.confidence && (
                <span className="opacity-90 text-[9px] bg-black/30 px-1 rounded">
                  {region.confidence}
                </span>
              )}
            </div>

            <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 bg-slate-900/95 border border-slate-700 p-2.5 rounded-lg text-[11px] text-slate-200 pointer-events-none z-30 shadow-2xl backdrop-blur-md font-sans leading-tight">
              <div className="font-mono font-bold text-xs mb-1" style={{ color }}>
                {region.label}
              </div>
              <p className="text-slate-300 text-[10px]">
                {region.details}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}