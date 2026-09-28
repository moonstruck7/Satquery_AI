import React, { useState, useEffect } from 'react';
import { analysisService } from '../services/analysisService.js';
import { Database, Layers, CheckCircle2, Search, ExternalLink, HardDrive } from 'lucide-react';

export function Datasets() {
  const [datasets, setDatasets] = useState([]);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function load() {
      const data = await analysisService.getDatasets();
      setDatasets(data);
    }
    load();
  }, []);

  const categories = ['ALL', 'REMOTE-SENSING ADAPTATION', 'EVALUATION / BENCHMARKS'];

  const filtered = datasets.filter((ds) => {
    const matchesCat = activeCategory === 'ALL' || ds.category === activeCategory;
    const matchesSearch =
      !searchTerm ||
      ds.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ds.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ds.task.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-full p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-xl sm:text-2xl font-bold font-mono text-slate-100 flex items-center gap-2.5">
          <Database className="w-6 h-6 text-cyan-400" />
          REMOTE SENSING BENCHMARKS & DATASETS
        </h1>
        <p className="text-xs text-slate-400 font-mono mt-1">
          Ground-truth training corpora and multimodal benchmarks powering SatQuery AI adaptation
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl font-mono text-xs w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeCategory === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search dataset or task..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((ds) => (
          <div
            key={ds.id}
            className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                    {ds.category}
                  </span>
                  <h3 className="text-lg font-bold font-mono text-slate-100 mt-0.5">
                    {ds.name}
                  </h3>
                </div>
                <div className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-300 shrink-0">
                  {ds.samples}
                </div>
              </div>

              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                {ds.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="p-2 rounded bg-slate-950/80 border border-slate-800/60">
                <span className="text-[9px] text-slate-400 uppercase block">MODALITY</span>
                <span className="text-slate-200 font-medium block truncate mt-0.5" title={ds.modality}>
                  {ds.modality}
                </span>
              </div>

              <div className="p-2 rounded bg-slate-950/80 border border-slate-800/60">
                <span className="text-[9px] text-slate-400 uppercase block">RESOLUTION (GSD)</span>
                <span className="text-emerald-400 font-medium block truncate mt-0.5">
                  {ds.spatialResolution}
                </span>
              </div>

              <div className="col-span-2 p-2 rounded bg-slate-950/80 border border-slate-800/60">
                <span className="text-[9px] text-slate-400 uppercase block">TASK DOMAIN</span>
                <span className="text-cyan-300 font-medium block truncate mt-0.5">
                  {ds.task}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}