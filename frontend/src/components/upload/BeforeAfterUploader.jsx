import React from 'react';
import { useAnalysis } from '../../hooks/useAnalysis.js';
import { FileUploadZone } from './FileUploadZone.jsx';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export function BeforeAfterUploader() {
  const { files, setDeviceFile, removeDeviceFile } = useAnalysis();

  const beforeFile = files.before_after?.before;
  const afterFile = files.before_after?.after;

  const handleBeforeSelect = (file) => {
    setDeviceFile('before_after', 'before', file, {
      date: '2024-03-15',
      sensor: 'Historical Baseline (T1)'
    });
  };

  const handleAfterSelect = (file) => {
    setDeviceFile('before_after', 'after', file, {
      date: '2026-04-18',
      sensor: 'Post-Event / Recent (T2)'
    });
  };

  const handleBeforeDateChange = (date) => {
    if (beforeFile) {
      setDeviceFile('before_after', 'before', beforeFile.file || { name: beforeFile.name, size: beforeFile.size, type: beforeFile.type }, {
        ...beforeFile,
        date
      });
    }
  };

  const handleAfterDateChange = (date) => {
    if (afterFile) {
      setDeviceFile('before_after', 'after', afterFile.file || { name: afterFile.name, size: afterFile.size, type: afterFile.type }, {
        ...afterFile,
        date
      });
    }
  };

  const isPairReady = !!beforeFile && !!afterFile;

  return (
    <div className="space-y-4">
      <FileUploadZone
        label="BEFORE IMAGE (T1)"
        sublabel="Historical Baseline"
        fileMeta={beforeFile}
        onFileSelect={handleBeforeSelect}
        onFileRemove={() => removeDeviceFile('before_after', 'before')}
        onDateChange={handleBeforeDateChange}
        showDatePicker={true}
              />

      <FileUploadZone
        label="AFTER IMAGE (T2)"
        sublabel="Recent Observation"
        fileMeta={afterFile}
        onFileSelect={handleAfterSelect}
        onFileRemove={() => removeDeviceFile('before_after', 'after')}
        onDateChange={handleAfterDateChange}
        showDatePicker={true}
              />

      <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/60 font-mono text-xs space-y-1.5">
        <div className="flex items-center gap-2">
          {beforeFile ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <span className="w-4 h-4 rounded-full border border-slate-600 shrink-0 flex items-center justify-center text-[10px] text-slate-400">1</span>
          )}
          <span className={beforeFile ? 'text-slate-200' : 'text-slate-400'}>
            {beforeFile ? `✓ Before image selected (${beforeFile.date || 'T1'})` : 'Waiting for baseline (T1) image'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {afterFile ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <span className="w-4 h-4 rounded-full border border-slate-600 shrink-0 flex items-center justify-center text-[10px] text-slate-400">2</span>
          )}
          <span className={afterFile ? 'text-slate-200' : 'text-slate-400'}>
            {afterFile ? `✓ After image selected (${afterFile.date || 'T2'})` : 'Waiting for target (T2) image'}
          </span>
        </div>

        <div className="pt-1.5 mt-1.5 border-t border-slate-800/80 flex items-center gap-2 font-semibold">
          {isPairReady ? (
            <span className="text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              ✓ Temporal comparison ready
            </span>
          ) : (
            <span className="text-amber-400 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" />
              Select both Before and After images for bi-temporal analysis
            </span>
          )}
        </div>
      </div>
    </div>
  );
}