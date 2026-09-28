import React from 'react';
import { Link } from 'react-router-dom';
import {
  Satellite,
  Compass,
  ArrowRight,
  Layers,
  Clock,
  Sparkles,
  ShieldCheck,
  Cpu,
  Database,
  Eye,
  CheckCircle2
} from 'lucide-react';

export function Home() {
  const capabilities = [
    {
      icon: Eye,
      title: 'Single-Image VQA & Grounding',
      desc: 'Ask complex spatial and land-cover questions about high-resolution Sentinel, Landsat, and commercial rasters with token-level visual grounding.'
    },
    {
      icon: Clock,
      title: 'Bi-Temporal Change Analysis',
      desc: 'Compare co-registered pre- and post-event imagery with Siamese cross-attention to isolate urban expansion, deforestation, and infrastructure loss.'
    },
    {
      icon: Layers,
      title: 'Optical + SAR Fusion',
      desc: 'Harness complementary multispectral reflection and Sentinel-1 C-Band synthetic aperture radar backscatter to penetrate monsoon cloud cover.'
    },
    {
      icon: Sparkles,
      title: 'Evidence-Grounded Insights',
      desc: 'Never accept ungrounded hallucinated numbers. SatQuery AI outputs verifiable bounding reticles, quantitative hectare metrics, and radar scatter points.'
    }
  ];

  return (
    <div className="min-h-full overflow-y-auto px-4 py-8 lg:py-14 max-w-7xl mx-auto space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6 pt-4 lg:pt-8">
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white font-mono">
          SATQUERY <span className="bg-linear-to-r from-cyan-400 via-blue-500 to-indigo-400 bg-clip-text text-transparent">AI</span>
        </h1>

        <p className="text-xl sm:text-2xl font-light text-cyan-200 tracking-wide">
          "Ask Earth. Get Evidence."
        </p>

        <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-400 leading-relaxed font-sans">
          An interactive vision-language assistant for multimodal remote-sensing image analysis.
          Query optical, SAR, and temporal satellite imagery with natural language and inspect verified geospatial evidence.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            to="/new-analysis"
            className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-mono text-sm font-bold tracking-wider text-slate-950 bg-linear-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 shadow-xl shadow-cyan-500/25 transition-all hover:scale-105 active:scale-95"
          >
            <Compass className="w-4 h-4" />
            <span>LAUNCH WORKSPACE</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/about"
            className="flex items-center gap-2 px-5 py-3.5 rounded-xl font-mono text-sm font-medium text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 transition-all"
          >
            <span>Explore Architecture</span>
          </Link>
        </div>
      </section>

      {/* Interactive Architecture Flow Diagram */}
      <section className="p-6 sm:p-8 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md shadow-2xl space-y-6">
        <div className="text-center space-y-1">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold">
            MULTIMODAL PIPELINE
          </span>
          <h2 className="text-lg sm:text-xl font-bold font-mono text-slate-100">
            HOW SATQUERY AI PROCESSES EARTH OBSERVATION QUERIES
          </h2>
        </div>

        {/* Horizontal Flow Steps */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
          {[
            { step: '01', title: 'USER', subtitle: 'Observer / Analyst', detail: 'Submits raster + text prompt' },
            { step: '02', title: 'QUERY', subtitle: 'Intent Decomposition', detail: 'Identifies temporal or SAR task' },
            { step: '03', title: 'ANALYSIS', subtitle: 'Specialist Backbone', detail: 'RS-VLM cross-modal attention' },
            { step: '04', title: 'EVIDENCE', subtitle: 'Pixel Grounds', detail: 'Boxes, masks & backscatter' },
            { step: '05', title: 'ANSWER', subtitle: 'Synthesized Insight', detail: 'Grounded verifiable report' }
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-2 group"
            >
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-cyan-400 font-bold">{item.step}</span>
                <span className="text-slate-400 text-[10px]">STEP</span>
              </div>
              <div>
                <h3 className="text-base font-bold font-mono text-slate-100 group-hover:text-cyan-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-cyan-400/90 font-mono mt-0.5">
                  {item.subtitle}
                </p>
                <p className="text-[11px] text-slate-400 mt-1 font-sans">
                  {item.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Core Capabilities Grid */}
      <section className="space-y-6">
        <div className="text-center space-y-1">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold">
            CORE DOMAINS
          </span>
          <h2 className="text-2xl font-bold font-mono text-slate-100">
            ENGINEERED FOR MULTISPECTRAL & RADAR EARTH OBSERVATION
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {capabilities.map((cap, idx) => {
            const Icon = cap.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl border border-slate-800 bg-slate-900/50 hover:bg-slate-900/80 hover:border-slate-700 transition-all space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold font-mono text-slate-200">
                  {cap.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  {cap.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom Launch Banner */}
      <section className="p-8 rounded-2xl border border-cyan-500/30 bg-linear-to-br from-slate-900 via-slate-950 to-cyan-950/40 text-center space-y-4">
        <h3 className="text-xl font-bold font-mono text-slate-100">
          Ready to interrogate satellite imagery?
        </h3>
        <p className="text-xs text-slate-400 max-w-lg mx-auto font-sans">
          Select imagery directly from your local device or test with pre-buffered Sentinel-1/2 and Landsat bi-temporal benchmarks.
        </p>
        <Link
          to="/new-analysis"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-mono text-xs font-bold tracking-wider text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-all shadow-lg shadow-cyan-500/20"
        >
          <span>OPEN SATQUERY WORKSPACE</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
}
