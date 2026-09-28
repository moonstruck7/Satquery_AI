import React from 'react';
import { useAnalysis } from '../../hooks/useAnalysis.js';
import { FileUploadZone } from './FileUploadZone.jsx';

export function SingleImageUploader() {
  const { files, setDeviceFile, removeDeviceFile } = useAnalysis();

  const handleFileSelect = (file) => {
    setDeviceFile('single', null, file, {
      sensor: 'User Remote Sensing Raster'
    });
  };

  return (
    <div className="space-y-3">
      <FileUploadZone
        label="PRIMARY SATELLITE SCENE"
        sublabel="Single Image (VQA / Grounding)"
        fileMeta={files.single}
        onFileSelect={handleFileSelect}
        onFileRemove={() => removeDeviceFile('single')}
              />
    </div>
  );
}