import React from 'react';
import { useAnalysis } from '../../hooks/useAnalysis.js';
import { ViewerControls } from './ViewerControls.jsx';
import { TelemetryOverlay } from './TelemetryOverlay.jsx';
import { SingleImageViewer } from './SingleImageViewer.jsx';
import { TemporalViewer } from './TemporalViewer.jsx';
import { OpticalSarViewer } from './OpticalSarViewer.jsx';
import { ProcessingWorkflow } from '../analysis/ProcessingWorkflow.jsx';

export function ImageViewer() {
  const { inputMode, showGrid } = useAnalysis();

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden relative shadow-2xl">
      <ViewerControls />

      <div className="flex-1 relative overflow-hidden flex flex-col min-h-0">
        {showGrid && (
          <div className="absolute inset-0 geo-grid-pattern pointer-events-none z-10 opacity-70" />
        )}

        {inputMode === 'before_after' && <TemporalViewer />}
        {inputMode === 'optical_sar' && <OpticalSarViewer />}
        {inputMode === 'single' && <SingleImageViewer />}

        <TelemetryOverlay
          sensor={
            inputMode === 'before_after'
              ? 'Landsat-8/9 Bi-Temporal'
              : inputMode === 'optical_sar'
              ? 'Sentinel-2 MSI + Sentinel-1 SAR'
              : 'Sentinel-2 MSI (10m GSD)'
          }
        />

        <ProcessingWorkflow />
      </div>
    </div>
  );
}