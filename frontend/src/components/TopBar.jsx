import { Settings, Bell, MonitorPlay } from 'lucide-react';
import { usePresentationMode } from '../hooks/usePresentationMode';

export default function TopBar({ title }) {
  const { presentationMode, setPresentationMode } = usePresentationMode();
  return (
    <header className="sticky top-0 z-30 h-14 bg-ink-900/80 backdrop-blur-xl border-b border-white/[0.06] flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-3 text-sm">
        <span className="text-cream/40 font-medium tracking-tight">SatQuery</span>
        <span className="text-cream/20">/</span>
        <span className="text-cream font-medium tracking-tight">{title || 'Workspace'}</span>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={() => setPresentationMode(!presentationMode)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-azure-400/10 text-azure-300 hover:bg-azure-400/20 border border-azure-400/10 transition-all">
          <MonitorPlay className="w-3.5 h-3.5" /> Present
        </button>
        <button className="p-2 rounded-lg hover:bg-white/[0.06] text-cream/50 hover:text-cream transition-colors" aria-label="Notifications"><Bell className="w-4 h-4" /></button>
        <button className="p-2 rounded-lg hover:bg-white/[0.06] text-cream/50 hover:text-cream transition-colors" aria-label="Settings"><Settings className="w-4 h-4" /></button>
      </div>
    </header>
  );
}