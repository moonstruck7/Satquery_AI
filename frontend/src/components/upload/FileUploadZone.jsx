import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, CheckCircle2, AlertCircle, RefreshCw, Trash2, Calendar, FileText } from 'lucide-react';
import { formatBytes } from '../../utils/helpers.js';

export function FileUploadZone({
  label,
  sublabel,
  fileMeta,
  onFileSelect,
  onFileRemove,
  onDateChange,
  showDatePicker = false,
  sampleAction = null,
  accept = 'image/png,image/jpeg,image/tiff,image/*,.tif,.tiff,.jp2'
}) {
  const fileInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragError, setDragError] = useState(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    setDragError(null);

    const droppedFiles = e.dataTransfer?.files;
    if (droppedFiles && droppedFiles.length > 0) {
      const file = droppedFiles[0];
      processFile(file);
    }
  };

  const handleInputChange = (e) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      processFile(selectedFiles[0]);
    }
    // Reset input value so re-selecting same file triggers change
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const processFile = (file) => {
    // Check file size limit (500MB max)
    if (file.size > 500 * 1024 * 1024) {
      setDragError('File size exceeds 500MB frontend limit.');
      return;
    }
    setDragError(null);
    onFileSelect(file);
  };

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-2">
      {/* Hidden Native File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
        aria-label={label}
      />

      <div className="flex items-center justify-between">
        <label className="text-xs font-mono font-semibold text-slate-300 tracking-wider flex items-center gap-1.5">
          {fileMeta ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <span className="w-2 h-2 rounded-full bg-slate-600"></span>
          )}
          {label}
        </label>
        {sublabel && (
          <span className="text-[10px] font-mono text-slate-400">{sublabel}</span>
        )}
      </div>

      {/* Upload Zone / Preview Card */}
      {!fileMeta ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleBrowseClick}
          className={`relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group ${
            isDragOver
              ? 'border-cyan-400 bg-cyan-950/40 text-cyan-200'
              : 'border-slate-700/80 bg-slate-900/40 hover:bg-slate-900/80 hover:border-slate-600 text-slate-400'
          }`}
        >
          <div className="w-10 h-10 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center group-hover:scale-105 group-hover:border-cyan-500/50 transition-all text-slate-300 group-hover:text-cyan-400">
            <UploadCloud className="w-5 h-5" />
          </div>

          <div className="space-y-0.5">
            <p className="text-xs font-medium text-slate-200">
              <span className="text-cyan-400 font-semibold group-hover:underline">Browse from device</span> or drop image
            </p>
            <p className="text-[10px] text-slate-400 font-mono">
              PNG, JPG, TIFF, GeoTIFF, JP2 up to 500MB
            </p>
          </div>

          {dragError && (
            <p className="text-xs text-rose-400 flex items-center gap-1 font-mono mt-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {dragError}
            </p>
          )}
        </div>
      ) : (
        /* File Selected State */
        <div className="border border-slate-700/90 bg-slate-900/80 rounded-xl p-3 space-y-2.5 transition-all">
          <div className="flex items-start gap-3">
            {/* Visual Thumbnail */}
            <div className="w-16 h-16 rounded-lg bg-slate-950 border border-slate-800 overflow-hidden shrink-0 flex items-center justify-center relative">
              {fileMeta.previewUrl ? (
                <img
                  src={fileMeta.previewUrl}
                  alt={fileMeta.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-1 text-center">
                  <FileText className="w-6 h-6 text-cyan-400" />
                  <span className="text-[8px] font-mono text-cyan-300 mt-0.5">RASTER</span>
                </div>
              )}
            </div>

            {/* Metadata Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-semibold text-emerald-400 uppercase tracking-wider">
                  FILE SELECTED
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {formatBytes(fileMeta.size)}
                </span>
              </div>

              <p className="text-xs font-mono font-bold text-slate-200 truncate mt-0.5" title={fileMeta.name}>
                {fileMeta.name}
              </p>

              <div className="text-[10px] font-mono text-slate-400 truncate mt-0.5">
                {fileMeta.type} {fileMeta.dimensions ? `· ${fileMeta.dimensions}` : ''}
              </div>

              {fileMeta.sensor && (
                <div className="text-[10px] font-mono text-cyan-400/90 truncate mt-0.5">
                  Sensor: {fileMeta.sensor}
                </div>
              )}
            </div>
          </div>

          {/* Date Picker for Bi-Temporal Mode */}
          {showDatePicker && (
            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
              <label className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                ACQUISITION DATE:
              </label>
              <input
                type="date"
                value={fileMeta.date || ''}
                onChange={(e) => onDateChange && onDateChange(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded px-2 py-0.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
          )}

          {/* Action Buttons: Replace / Remove */}
          <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-800/60">
            <button
              type="button"
              onClick={handleBrowseClick}
              className="flex items-center gap-1 px-2 py-1 rounded text-[11px] font-mono text-slate-300 hover:text-cyan-300 hover:bg-slate-800 transition-colors"
              title="Replace this image"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Replace</span>
            </button>

            <button
              type="button"
              onClick={onFileRemove}
              className="flex items-center gap-1 px-2 py-1 rounded text-[11px] font-mono text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors"
              title="Remove this image"
            >
              <Trash2 className="w-3 h-3" />
              <span>Remove</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
