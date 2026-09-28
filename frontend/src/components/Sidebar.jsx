import { useState } from 'react';
import { LayoutGrid, Clock, Database, Cpu, Menu, X, Satellite } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const nav = [
  { icon: LayoutGrid, label: 'Workspace', path: '/workspace', desc: 'Start analysis' },
  { icon: Clock, label: 'History', path: '/history', desc: 'Past results' },
  { icon: Database, label: 'Datasets', path: '/datasets', desc: 'Imagery & data' },
  { icon: Cpu, label: 'Models', path: '/models', desc: 'Engine registry' },
];

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  return (
    <aside className={`fixed left-0 top-0 h-screen z-40 flex flex-col bg-white border-r border-[#EAE6DF] transition-all duration-300 ease-out ${open ? 'w-64' : 'w-16'}`}>
      <div className="flex items-center justify-between h-16 px-4 border-b border-[#EAE6DF]">
        <NavLink to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-md bg-stone/20 flex items-center justify-center">
            <Satellite className="w-4 h-4 text-stone" />
          </div>
          <span className={`font-serif font-bold text-[#2A2522] whitespace-nowrap overflow-hidden transition-all ${open ? 'w-auto opacity-100' : 'w-0 opacity-0'}`}>SatQuery</span>
        </NavLink>
        <button onClick={() => setOpen(o => !o)} className="p-1 text-[#8A7D70] hover:text-[#2A2522]" aria-label="Toggle">
          {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {nav.map(item => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-3 transition-colors text-sm ${isActive ? 'text-[#2A2522] bg-[#F0EBE0]' : 'text-[#6B5D52] hover:text-[#2A2522] hover:bg-stone/5'} ${!open ? 'justify-center' : ''}`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className={`overflow-hidden transition-all whitespace-nowrap ${open ? 'w-auto opacity-100' : 'w-0 opacity-0'}`}>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="px-4 py-3 border-t border-[#EAE6DF] text-[10px] text-stone/40 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
        <span className={`${open ? 'block' : 'hidden'}`}>Live</span>
      </div>
    </aside>
  );
}