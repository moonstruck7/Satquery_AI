import React from 'react';
import { useAnalysis } from '../../hooks/useAnalysis.js';
import { SAMPLE_IMAGES } from '../../mock/images.js';
import { EvidenceOverlay } from '../evidence/EvidenceOverlay.jsx';
import { Layers, Radio, Sparkles, Eye } from 'lucide-react';

export function OpticalSarViewer() {
  const {
    files,
    optSarTab,
    setOptSarTab,
    imageOpacity,
    zoom
  } = useAnalysis();

  const optMeta = files.optical_sar?.optical;
  const sarMeta = files.optical_sar?.sar;

  const optSrc = optMeta?.previewUrl || SAMPLE_IMAGES.optical.url;
  const sarSrc = sarMeta?.previewUrl || SAMPLE_IMAGES.sar.url;

  const optFallback = SAMPLE_IMAGES.optical.fallbackUrl;
  const sarFallback = SAMPLE_IMAGES.sar.fallbackUrl;

  const tabs = [
    { id: 'optical', label: 'OPTICAL', icon: Eye, sensor: 'Sentinel-2 MSI', modality: 'Multispectral RGB' },
    { id: 'sar', label: 'SAR', icon: Radio, sensor: 'Sentinel-1 C-SAR', modality: 'SAR (VV/VH Calibrated)' },
    { id: 'fused', label: 'FUSED', icon: Layers, sensor: 'Cross-Modal Composite', modality: 'Dual-Domain Synthetic' },
    { id: 'evidence', label: 'EVIDENCE', icon: Sparkles, sensor: 'Ground Truth Overlay', modality: 'Segmented Bounds' }
  ];

  const currentTab = tabs.find((t) => t.id === optSarTab) || tabs[0];

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-slate-950 relative overflow-hidden select-none">
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900/90 border-b border-slate-800 text-[11px] font-mono shrink-0">
        <div className="flex items-center gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = optSarTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setOptSarTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded transition-all ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="hidden sm:flex items-center gap-2 text-slate-400">
          <span className="text-cyan-400 font-semibold">{currentTab.sensor}</span>
          <span>·</span>
          <span>{currentTab.modality}</span>
        </div>
      </div>

      {/* Main Canvas Display */}
      <div className="flex-1 relative overflow-hidden flex items-center justify-center bg-slate-950">
        {optSarTab === 'optical' && (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            <img
              src={optSrc}
              onError={(e) => { e.currentTarget.src = optFallback; }}
              alt="Optical Multispectral"
              style={{ opacity: imageOpacity, transform: `scale(${zoom})` }}
              className="w-full h-full object-cover transition-transform duration-100"
            />
            <div className="absolute top-3 left-3 bg-slate-950/80 border border-slate-800 px-2 py-1 rounded text-xs font-mono font-bold text-emerald-400">
              OPTICAL RGB: {optMeta?.name || 'Sentinel2_Krishna_Basin.jp2'}
            </div>
          </div>
        )}

        {optSarTab === 'sar' && (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            <img
              src={sarSrc}
              onError={(e) => { e.currentTarget.src = sarFallback; }}
              alt="Synthetic Aperture Radar"
              style={{ opacity: imageOpacity, transform: `scale(${zoom})`, filter: 'contrast(130%) brightness(95%)' }}
              className="w-full h-full object-cover transition-transform duration-100"
            />
            <div className="absolute top-3 left-3 bg-slate-950/80 border border-slate-800 px-2 py-1 rounded text-xs font-mono font-bold text-cyan-400">
              SAR C-BAND (VV/VH): {sarMeta?.name || 'Sentinel1_IW_GRDH.tiff'}
            </div>
            <div className="absolute bottom-3 left-3 bg-slate-950/90 border border-slate-800 p-2 rounded text-[10px] font-mono text-slate-300">
              <div>Bright clusters: Double-bounce urban corners (+12 dB)</div>
              <div>Dark tone: Smooth water surface specular loss (&lt; -22 dB)</div>
            </div>
          </div>
        )}

        {optSarTab === 'fused' && (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-slate-950">
            <img
              src={optSrc}
              onError={(e) => { e.currentTarget.src = optFallback; }}
              alt="Base Optical"
              style={{ opacity: 0.7, transform: `scale(${zoom})` }}
              className="w-full h-full object-cover"
            />
            <img
              src={sarSrc}
              onError={(e) => { e.currentTarget.src = sarFallback; }}
              alt="SAR Texture"
              style={{ opacity: 0.45, transform: `scale(${zoom})`, mixBlendMode: 'color-dodge' }}
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />
            <EvidenceOverlay />
            <div className="absolute top-3 left-3 bg-slate-950/90 border border-cyan-500/40 px-2.5 py-1 rounded text-xs font-mono font-bold text-cyan-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              CROSS-MODAL OPTICAL-SAR FUSION
            </div>
          </div>
        )}

        {optSarTab === 'evidence' && (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-slate-950">
            <img
              src={optSrc}
              onError={(e) => { e.currentTarget.src = optFallback; }}
              alt="Evidence Background"
              style={{ opacity: 0.5, transform: `scale(${zoom})`, filter: 'grayscale(50%)' }}
              className="w-full h-full object-cover"
            />
            <EvidenceOverlay />
            <div className="absolute top-3 left-3 bg-slate-950/90 border border-cyan-500/40 px-2.5 py-1 rounded text-xs font-mono font-bold text-cyan-300">
              MULTIMODAL EVIDENCE MAP
            </div>
          </div>
        )}
      </div>
    </div>
  );
}