import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar.jsx';
import { TopBar } from './TopBar.jsx';
import { ToastContainer } from '../common/ToastContainer.jsx';

export function AppShell() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans geo-grid-pattern">
      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
        {/* TopBar */}
        <TopBar />

        {/* Dynamic Page Routed Content */}
        <main className="flex-1 min-h-0 overflow-y-auto relative">
          <Outlet />
        </main>

        {/* Global Toast Notifications */}
        <ToastContainer />
      </div>
    </div>
  );
}