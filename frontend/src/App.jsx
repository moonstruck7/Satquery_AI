import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnalysisProvider } from './store/analysisStore.jsx';
import { AppShell } from './components/layout/AppShell.jsx';
import { Home } from './pages/Home.jsx';
import { Workspace } from './pages/Workspace.jsx';
import { NewAnalysis } from './pages/NewAnalysis.jsx';
import { History } from './pages/History.jsx';
import { Datasets } from './pages/Datasets.jsx';
import { Models } from './pages/Models.jsx';
import { About } from './pages/About.jsx';

export default function App() {
  return (
    <AnalysisProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<Home />} />
            <Route path="/new-analysis" element={<NewAnalysis />} />
            <Route path="/workspace" element={<Workspace />} />
            <Route path="/history" element={<History />} />
            <Route path="/datasets" element={<Datasets />} />
            <Route path="/models" element={<Models />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AnalysisProvider>
  );
}
