import React from 'react';
import { useAnalysis } from '../hooks/useAnalysis.js';
import { ImageViewer } from '../components/viewer/ImageViewer.jsx';
import { ResultPanel } from '../components/results/ResultPanel.jsx';
import { Sparkles, Maximize2, Trash2 } from 'lucide-react';

export function Workspace() {
  const {
    isPresentationMode,
    setIsPresentationMode
  } = useAnalysis();

  return (
    <div className="h-full w-full p-3 sm:p-4 lg:p-5 flex flex-col min-h-0 overflow-y-auto select-none">
      {/* 3-Column Responsive Workspace Grid */}
      <div
        className={`flex-1 grid gap-3 md:gap-4 min-h-0 grid-cols-1 lg:grid-cols-12 ${
          isPresentationMode
            ? 'lg:grid-cols-12'
            : 'xl:grid-cols-12'
        }`}
      >
        {/* Center Column: Interactive Geospatial Image Viewer */}
        <div
          className={`${
            isPresentationMode
              ? 'lg:col-span-8 h-[calc(100vh-6rem)]'
              : 'lg:col-span-4 xl:col-span-5 h-105 lg:h-[calc(100vh-8rem)]'
          } min-h-0 flex flex-col order-2`}
        >
          <ImageViewer />
        </div>

        {/* RIGHT COLUMN: Synthesized Results, Evidence & Telemetry */}
        <div
          className={`${
            isPresentationMode
              ? 'lg:col-span-4 h-[calc(100vh-6rem)]'
              : 'lg:col-span-4 xl:col-span-4'
          } flex flex-col min-h-0 overflow-y-auto order-3`}
        >
          <ResultPanel />
        </div>
      </div>
    </div>
  );
}
