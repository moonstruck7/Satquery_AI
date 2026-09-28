import React from 'react';
import {
  Satellite,
  Compass,
  Layers,
  Sparkles,
  ShieldCheck,
  Cpu,
  ArrowRight,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function About() {
  return (
    <div className="min-h-full p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-10">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6 space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-100">
          ABOUT SATQUERY AI
        </h1>
        <p className="text-sm text-cyan-300 font-mono">
          "Ask Earth. Get Evidence."
        </p>
      </div>

      {/* Overview Sections */}
      <div className="space-y-8 font-sans text-sm text-slate-300 leading-relaxed">
        {/* Section 1: What is SatQuery AI */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold font-mono text-slate-100 flex items-center gap-2">
            <Satellite className="w-5 h-5 text-cyan-400" />
            1. What is SatQuery AI?
          </h2>
          <p>
            <strong>SatQuery AI</strong> is an interactive vision-language assistant engineered for multimodal remote sensing and earth observation image analysis through natural language text queries. The project empowers environmental scientists, urban planners, disaster response coordinators, and geospatial analysts to interrogate complex satellite imagery without writing intricate GIS scripts or manual raster algebra formulas.
          </p>
        </section>

        {/* Section 2: Why Remote Sensing */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold font-mono text-slate-100 flex items-center gap-2">
            <Compass className="w-5 h-5 text-cyan-400" />
            2. Why Remote Sensing Requires Specialized AI?
          </h2>
          <p>
            General computer vision models (trained on ordinary web photography) fail on remote sensing imagery due to extreme differences in observation geometry:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-400">
            <li><strong>Nadir & Off-Nadir Perspectives:</strong> Overhead viewpoints with absence of standard horizons and arbitrary rotation invariance.</li>
            <li><strong>Non-RGB Spectral Bands:</strong> Essential physical signals reside in Near-Infrared (NIR), Shortwave Infrared (SWIR), and Red Edge bands (Sentinel-2).</li>
            <li><strong>Radar Modalities (SAR):</strong> Synthetic Aperture Radar (Sentinel-1) captures dielectric roughness and volume backscatter rather than visual light reflectance.</li>
            <li><strong>Temporal Dimensions:</strong> Surface changes (urbanization, flood progression, forest fires) require co-registered bi-temporal reasoning across multiple calendar years.</li>
          </ul>
        </section>

        {/* Section 3: Architecture Pipeline Visualization */}
        <section className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
          <h2 className="text-base font-bold font-mono text-cyan-400 uppercase tracking-wider">
            3. End-to-End System Architecture
          </h2>

          <div className="flex flex-col md:flex-row items-center justify-between gap-2 font-mono text-xs text-center">
            <div className="w-full md:w-auto p-3 rounded-lg bg-slate-950 border border-slate-800 flex-1">
              <span className="text-slate-400 block text-[10px]">STAGE 1</span>
              <strong className="text-slate-100">USER</strong>
            </div>
            <span className="text-cyan-400 font-bold">↓</span>

            <div className="w-full md:w-auto p-3 rounded-lg bg-slate-950 border border-slate-800 flex-1">
              <span className="text-slate-400 block text-[10px]">STAGE 2</span>
              <strong className="text-cyan-300">NATURAL LANGUAGE QUERY</strong>
            </div>
            <span className="text-cyan-400 font-bold">↓</span>

            <div className="w-full md:w-auto p-3 rounded-lg bg-slate-950 border border-cyan-500/40 flex-1">
              <span className="text-slate-400 block text-[10px]">STAGE 3</span>
              <strong className="text-cyan-400">SATQUERY ANALYSIS</strong>
            </div>
            <span className="text-cyan-400 font-bold">↓</span>

            <div className="w-full md:w-auto p-3 rounded-lg bg-slate-950 border border-slate-800 flex-1">
              <span className="text-slate-400 block text-[10px]">STAGE 4</span>
              <strong className="text-slate-200">SPECIALIST CAPABILITY</strong>
            </div>
            <span className="text-cyan-400 font-bold">↓</span>

            <div className="w-full md:w-auto p-3 rounded-lg bg-slate-950 border border-emerald-500/40 flex-1">
              <span className="text-slate-400 block text-[10px]">STAGE 5</span>
              <strong className="text-emerald-400">EVIDENCE & ANSWER</strong>
            </div>
          </div>
        </section>

        {/* Section 4: Supported Analysis Types */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold font-mono text-slate-100 flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            4. Supported Multimodal Analysis Types
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <h4 className="font-bold font-mono text-slate-200">Bi-Temporal Change Detection</h4>
              <p className="text-slate-400">
                Identify and quantify land-use conversions between two acquisition dates with Siamese cross-attention feature differencing.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <h4 className="font-bold font-mono text-slate-200">Optical + SAR Cross Fusion</h4>
              <p className="text-slate-400">
                Integrate multispectral imagery with radar backscatter to eliminate cloud obscuration and verify metallic or concrete urban structures.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <h4 className="font-bold font-mono text-slate-200">Visual Question Answering (VQA)</h4>
              <p className="text-slate-400">
                Ask targeted queries regarding vessel density, solar farm dimensions, canal navigability, or forest canopy health.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <h4 className="font-bold font-mono text-slate-200">Spatial Referring Grounding</h4>
              <p className="text-slate-400">
                Direct the assistant to localize specific physical entities (e.g. "Highlight the primary reservoir body") with pixel-precise reticles.
              </p>
            </div>
          </div>
        </section>

        {/* Section 5: Evidence-Based Results */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold font-mono text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            5. Verifiable Evidence vs. Hallucination
          </h2>
          <p>
            Standard generative AI tends to generate confident yet ungrounded claims when presented with dense satellite rasters. SatQuery AI pairs every natural-language assertion with explicit visual bounding coordinates, surface area measurements, confidence bounds, and observable execution logs.
          </p>
        </section>
      </div>

      {/* CTA */}
      <div className="pt-4 border-t border-slate-800 flex justify-end">
        <Link
          to="/workspace"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-all shadow-lg shadow-cyan-500/20"
        >
          <span>PROCEED TO WORKSPACE</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
