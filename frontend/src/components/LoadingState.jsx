import { Loader2 } from 'lucide-react';

const stages = [
  { label: 'Understanding query', complete: true },
  { label: 'Validate imagery', complete: true },
  { label: 'Select task', complete: true },
  { label: 'Executing model', complete: false },
  { label: 'Collect evidence', complete: false },
  { label: 'Generate response', complete: false },
];

export default function LoadingState() {
  return (
    <div className="flex-1 flex items-center justify-center bg-earth-900">
      <div className="text-center max-w-md">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-lg bg-satellite-500/20 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-satellite-400 animate-spin" />
          </div>
          <div>
            <div className="text-lg font-semibold text-white">SATQUERY AGENT</div>
            <div className="text-xs text-gray-500">Processing analysis...</div>
          </div>
        </div>
        <div className="space-y-3">
          {stages.map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              {s.complete ? (
                <div className="w-5 h-5 rounded-full bg-earthGreen-500/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-earthGreen-400"></div>
                </div>
              ) : (
                <div className="w-5 h-5 rounded-full border border-white/10 flex items-center justify-center">
                  {i === 3 && <div className="w-2 h-2 rounded-full bg-satellite-400 animate-pulse"></div>}
                </div>
              )}
              <span className={`text-xs ${s.complete ? 'text-earthGreen-400' : i === 3 ? 'text-satellite-400' : 'text-gray-500'}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}