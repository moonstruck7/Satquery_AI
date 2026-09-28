import React from 'react';
import { useAnalysis } from '../../hooks/useAnalysis.js';
import { SAMPLE_IMAGES } from '../../mock/images.js';
import { EvidenceOverlay } from '../evidence/EvidenceOverlay.jsx';
import { FileText, Sparkles } from 'lucide-react';
import { formatBytes } from '../../utils/helpers.js';

export function SingleImageViewer() {
  const {
    files,
    imageOpacity,
    zoom,
    currentAnalysis
  } = useAnalysis();

  const singleMeta = files.single;
  const imgSrc = singleMeta?.previewUrl || SAMPLE_IMAGES.single.url;
  const imgFallback = SAMPLE_IMAGES.single.fallbackUrl;

  const isGeoTiffWithoutPreview = singleMeta?.isGeoTiff && !singleMeta?.previewUrl;

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-slate-950 relative overflow-hidden select-none">
      <div className="flex-1 relative overflow-hidden flex items-center justify-center bg-slate-950">
        {isGeoTiffWithoutPreview ? (
          /* File Selected Card for unrenderable GeoTIFF */
          <div className="max-w-md w-full p-8 border-2 border-dashed border-cyan-500/40 rounded-2xl bg-slate-900/80 text-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                GEOTIFF RASTER READY
              </div>
              <h4 className="text-base font-bold text-slate-100 mt-1 font-mono truncate">
                {singleMeta.name}
              </h4>
              <p className="text-xs text-slate-400 font-mono mt-1">
                {formatBytes(singleMeta.size)} · {singleMeta.type}
              </p>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans bg-slate-950/60 p-3 rounded-lg border border-slate-800">
              Raster data buffered into client memory. SatQuery AI parser extracts spectral bands for VLM inference while vector geometries and evidence bounds render onto the canvas.
            </p>
          </div>
        ) : (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            <img
              src={imgSrc}
              onError={(e) => { e.currentTarget.src = imgFallback; }}
              alt="Remote Sensing Scene"
              style={{ opacity: imageOpacity, transform: `scale(${zoom})` }}
              className="w-full h-full object-cover transition-transform duration-100"
            />
            <EvidenceOverlay />

            <div className="absolute top-3 left-3 bg-slate-950/85 border border-slate-800 px-2.5 py-1 rounded text-xs font-mono font-bold text-cyan-300 flex items-center gap-1.5 shadow-lg">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>{singleMeta?.name || 'Sentinel2_Rotterdam_Harbor.tif'}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}