import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAnalysis } from '../../hooks/useAnalysis.js';
import {
  Satellite,
  Compass,
  History,
  BookmarkCheck,
  Database,
  Cpu,
  Info,
  ChevronLeft,
  ChevronRight,
  RotateCcw
} from 'lucide-react';

export function Sidebar({ collapsed, setCollapsed }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentAnalysis, clearAllFiles, files } = useAnalysis();

  const hasActiveWorkspace = files?.before?.before || files?.single || files?.optical_sar?.optical;

  const handleNewAnalysis = () => {
    clearAllFiles();
    // Reset analysis state so panel shows empty
    navigate('/new-analysis');
  };

  const navGroups = [
    {
      group: 'WORKSPACE',
      items: [
        {
          label: 'New Analysis',
          icon: RotateCcw,
          onClick: handleNewAnalysis,
          badge: null
        },
        {
          label: 'Workspace',
          to: '/workspace',
          icon: Compass,
          badge: null
        }
      ]
    },
    {
      group: 'ANALYSIS',
      items: [
        {
          label: 'History',
          to: '/history',
          icon: History
        },

      ]
    },
    {
      group: 'DATA',
      items: [
        {
          label: 'Datasets',
          to: '/datasets',
          icon: Database
        },

      ]
    },
    {
      group: 'SYSTEM',
      items: [
        {
          label: 'Model Registry',
          to: '/models',
          icon: Cpu
        },
        {
          label: 'About System',
          to: '/about',
          icon: Info
        }
      ]
    }
  ];


  return (
    <aside
      className={`relative flex flex-col border-r border-slate-800 bg-slate-950/90 backdrop-blur-xl transition-all duration-300 z-30 select-none ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800/80">
        <NavLink
          to="/"
          className={`flex items-center gap-2.5 transition-opacity hover:opacity-90 ${collapsed ? 'justify-center w-full' : ''}`}
          title="SatQuery AI Home"
        >
          <div className="w-9 h-9 rounded-lg bg-linear-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 shrink-0">
            <Satellite className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-mono text-sm font-bold tracking-wider text-slate-100 flex items-center gap-1.5">
                SATQUERY <span className="text-cyan-400">AI</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono tracking-tight -mt-0.5">
                ASK EARTH · GET EVIDENCE
              </span>
            </div>
          )}
        </NavLink>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-4 px-2 space-y-6">
        {navGroups.map((grp) => (
          <div key={grp.group} className="space-y-1">
            {!collapsed && (
              <div className="px-3 pb-1 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                {grp.group}
              </div>
            )}
            {grp.items.map((item, idx) => {
              const Icon = item.icon;

              if (item.onClick) {
                return (
                  <button
                    key={idx}
                    onClick={item.onClick}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-cyan-300 hover:bg-slate-900/80 transition-all ${
                      collapsed ? 'justify-center' : ''
                    }`}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon className="w-4 h-4 shrink-0 text-slate-400" />
                    {!collapsed && <span>{item.label}</span>}
                  </button>
                );
              }

              return (
                <NavLink
                  key={idx}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      collapsed ? 'justify-center' : ''
                    } ${
                      isActive
                        ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-950'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                    }`
                  }
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {!collapsed && (
                    <div className="flex-1 flex items-center justify-between">
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}
      </div>

      {/* Toggle button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-cyan-300 hover:border-cyan-500/50 transition-all shadow-md z-40"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>
    </aside>
  );
}