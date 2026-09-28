import React, { useState, useEffect } from 'react';
import { useAnalysis } from '../../hooks/useAnalysis.js';
import { Compass, Crosshair } from 'lucide-react';

export function TelemetryOverlay({ sensor = 'Sentinel-2 L2A', gsd = '10m GSD', coords = '51°55\'12" N, 4°28\'48" E' }) {
  const { showNorth, showGrid, zoom } = useAnalysis();
  const [mouseCoords, setMouseCoords] = useState({ x: 420, y: 310, lat: '51.9214° N', lon: '4.4812° E' });

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-3 select-none">
      <div className="flex items-start justify-between">
        <div className="bg-slate-950/80 backdrop-blur-md border border-slate-800 px-2.5 py-1.5 rounded-lg text-[10px] font-mono space-y-0.5 shadow-lg">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            <span className="text-slate-300 font-bold">{sensor}</span>
          </div>
          <div className="text-slate-400 flex items-center gap-2">
            <span>CRS: EPSG:4326 (WGS84)</span>
            <span>·</span>
            <span>{gsd}</span>
          </div>
        </div>

        {showNorth && (
          <div className="bg-slate-950/80 backdrop-blur-md border border-slate-800 p-2 rounded-lg flex flex-col items-center justify-center shadow-lg">
            <div className="w-6 h-6 relative flex items-center justify-center">
              <Compass className="w-5 h-5 text-cyan-400" />
            </div>
            <span className="text-[9px] font-mono font-bold text-slate-300 mt-0.5">N</span>
          </div>
        )}
      </div>

      <div className="flex items-end justify-between">
        <div className="bg-slate-950/80 backdrop-blur-md border border-slate-800 px-2.5 py-1 rounded text-[10px] font-mono text-slate-300 flex items-center gap-2 shadow-lg">
          <Crosshair className="w-3 h-3 text-cyan-400" />
          <span>{coords}</span>
        </div>

        <div className="bg-slate-950/80 backdrop-blur-md border border-slate-800 px-3 py-1.5 rounded-lg text-[10px] font-mono flex flex-col items-end shadow-lg">
          <span className="text-slate-300 mb-1">
            {Math.round(500 / zoom)} m
          </span>
          <div className="w-24 h-1 bg-slate-700 relative">
            <div className="absolute left-0 top-0 bottom-0 w-1/2 bg-cyan-400"></div>
            <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-white"></div>
          </div>
        </div>
      </div>
    </div>
  );
}