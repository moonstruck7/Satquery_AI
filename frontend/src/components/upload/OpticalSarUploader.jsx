import React from 'react';
import { useAnalysis } from '../../hooks/useAnalysis.js';
import { FileUploadZone } from './FileUploadZone.jsx';
import { SAMPLE_IMAGES } from '../../mock/images.js';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export function OpticalSarUploader() {
  const { files, setDeviceFile, removeDeviceFile } = useAnalysis();

  const opticalFile = files.optical_sar?.optical;
  const sarFile = files.optical_sar?.sar;

  const handleOpticalSelect = (file) => {
    setDeviceFile('optical_sar', 'optical', file, {
      sensor: 'Optical Multispectral (Sentinel-2 / Landsat)'
    });
  };

  const handleSarSelect = (file) => {
    setDeviceFile('optical_sar', 'sar', file, {
      sensor: 'Synthetic Aperture Radar (Sentinel-1 SAR VV/VH)'
    });
  };

  const handleUseOpticalSample = () => {
    const sample = SAMPLE_IMAGES.optical;
    setDeviceFile('optical_sar', 'optical', {
      name: sample.name,
      size: sample.size,
      type: sample.type,
      lastModified: Date.now()
    }, {
      previewUrl: sample.url,
      dimensions: sample.dimensions,
      sensor: sample.sensor
    });
  };

  const handleUseSarSample = () => {
    const sample = SAMPLE_IMAGES.sar;
    setDeviceFile('optical_sar', 'sar', {
      name: sample.name,
      size: sample.size,
      type: sample.type,
      lastModified: Date.now()
    }, {
      previewUrl: sample.url,
      dimensions: sample.dimensions,
      sensor: sample.sensor
    });
  };

  const isPairReady = !!opticalFile && !!sarFile;

  return (
    <div className="space-y-4">
      {/* Optical Upload Area */}
      <FileUploadZone
        label="OPTICAL IMAGE"
        sublabel="Multispectral / RGB"
        fileMeta={opticalFile}
        onFileSelect={handleOpticalSelect}
        onFileRemove={() => removeDeviceFile('optical_sar', 'optical')}
        sampleAction={handleUseOpticalSample}
      />

      {/* SAR Upload Area */}
      <FileUploadZone
        label="SAR IMAGE"
        sublabel="Synthetic Aperture Radar"
        fileMeta={sarFile}
        onFileSelect={handleSarSelect}
        onFileRemove={() => removeDeviceFile('optical_sar', 'sar')}
        sampleAction={handleUseSarSample}
      />

      <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/60 font-mono text-xs space-y-1.5">
        <div className="flex items-center gap-2">
          {opticalFile ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <span className="w-4 h-4 rounded-full border border-slate-600 shrink-0 flex items-center justify-center text-[10px] text-slate-400">1</span>
          )}
          <span className={opticalFile ? 'text-slate-200' : 'text-slate-400'}>
            {opticalFile ? '✓ Optical image selected' : 'Waiting for optical image'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {sarFile ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <span className="w-4 h-4 rounded-full border border-slate-600 shrink-0 flex items-center justify-center text-[10px] text-slate-400">2</span>
          )}
          <span className={sarFile ? 'text-slate-200' : 'text-slate-400'}>
            {sarFile ? '✓ SAR image selected' : 'Waiting for SAR image'}
          </span>
        </div>

        <div className="pt-1.5 mt-1.5 border-t border-slate-800/80 flex items-center gap-2 font-semibold">
          {isPairReady ? (
            <span className="text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              ✓ Pair ready for multimodal analysis
            </span>
          ) : (
            <span className="text-amber-400 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" />
              Select both optical and SAR images to begin
            </span>
          )}
        </div>
      </div>
    </div>
  );
}