const makeSatSvg = (bg, elements, label) => {
`data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
      </pattern>
      <linearGradient id="waterGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="%230c4a6e" />
        <stop offset="100%" stop-color="%230369a1" />
      </linearGradient>
      <linearGradient id="forestGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="%23064e3b" />
        <stop offset="100%" stop-color="%23065f46" />
      </linearGradient>
      <linearGradient id="urbanGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="%23334155" />
        <stop offset="100%" stop-color="%23475569" />
      </linearGradient>
    </defs>
    <rect width="800" height="600" fill="${bg}" />
    ${elements}
    <rect width="800" height="600" fill="url(%23grid)" />
    <rect x="20" y="20" width="180" height="30" rx="4" fill="rgba(15,23,42,0.85)" stroke="rgba(56,189,248,0.4)" stroke-width="1"/>
    <text x="30" y="40" fill="%2338bdf8" font-family="monospace" font-size="12" font-weight="bold">${label}</text>
  </svg>`;
};

export const SAMPLE_IMAGES = {
  single: {
    id: 'sample-opt-harbor',
    name: 'Sentinel2_L2A_Rotterdam_Harbor.tif',
    size: 24500000,
    type: 'image/tiff (Rendered RGB)',
    dimensions: '10980 × 10980 px (10m GSD)',
    sensor: 'Sentinel-2 MSI (Level 2A BOA)',
    date: '2026-06-14',
    url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
    fallbackUrl: makeSatSvg('%231e293b', `
      <path d="M 0,220 Q 300,280 450,210 T 800,230 L 800,600 L 0,600 Z" fill="url(%23waterGrad)" />
      <polygon points="120,40 280,30 350,180 150,200" fill="url(%23urbanGrad)" stroke="%2364748b" stroke-width="2"/>
      <polygon points="400,20 620,10 680,160 430,190" fill="url(%23urbanGrad)" stroke="%2364748b" stroke-width="2"/>
      <!-- Cargo vessels and docks -->
      <rect x="220" y="260" width="90" height="24" rx="6" fill="%23e2e8f0" stroke="%230f172a" stroke-width="2"/>
      <rect x="360" y="320" width="120" height="28" rx="6" fill="%23f87171" stroke="%230f172a" stroke-width="2"/>
      <rect x="540" y="280" width="80" height="22" rx="5" fill="%2338bdf8" stroke="%230f172a" stroke-width="2"/>
      <!-- Docks -->
      <line x1="200" y1="200" x2="200" y2="350" stroke="%2394a3b8" stroke-width="12" />
      <line x1="330" y1="210" x2="330" y2="390" stroke="%2394a3b8" stroke-width="14" />
      <line x1="500" y1="210" x2="500" y2="380" stroke="%2394a3b8" stroke-width="14" />
    `, 'OPTICAL: ROTTERDAM PORT')
  },

  optical: {
    id: 'sample-opt-river',
    name: 'Sentinel2_RGB_Krishna_Basin.jp2',
    size: 32000000,
    type: 'image/jp2',
    dimensions: '10980 × 10980 px',
    sensor: 'Sentinel-2 MSI (Band 4-3-2 True Color)',
    date: '2026-08-11',
    url: 'https://images.unsplash.com/photo-1542314831-c6a4d2729a0f?auto=format&fit=crop&w=1200&q=80',
    fallbackUrl: makeSatSvg('%2314532d', `
      <path d="M 100,0 Q 250,220 380,310 T 680,600" fill="none" stroke="%230284c7" stroke-width="70" stroke-linecap="round"/>
      <ellipse cx="250" cy="180" rx="90" ry="70" fill="%23047857"/>
      <ellipse cx="580" cy="420" rx="140" ry="90" fill="%23b45309" opacity="0.6"/>
      <path d="M 450,150 L 600,120 L 640,240 L 490,270 Z" fill="%2364748b"/>
    `, 'OPTICAL RGB (S2)')
  },

  sar: {
    id: 'sample-sar-river',
    name: 'Sentinel1_IW_GRDH_VV_VH_Krishna.tiff',
    size: 58000000,
    type: 'image/tiff (SAR Calibrated)',
    dimensions: '25400 × 16800 px',
    sensor: 'Sentinel-1 C-Band SAR (VV/VH dual-pol)',
    date: '2026-08-12',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    fallbackUrl: makeSatSvg('%230f172a', `
      <!-- High backscatter urban bright spots and low backscatter dark water -->
      <path d="M 100,0 Q 250,220 380,310 T 680,600" fill="none" stroke="%23020617" stroke-width="70" stroke-linecap="round"/>
      <!-- Bright SAR speckle clusters (urban double-bounce) -->
      <g fill="%23ffffff" opacity="0.9">
        <circle cx="480" cy="160" r="3"/><circle cx="510" cy="170" r="4"/><circle cx="530" cy="140" r="5"/>
        <circle cx="560" cy="180" r="4"/><circle cx="580" cy="210" r="6"/><circle cx="610" cy="150" r="3"/>
        <circle cx="470" cy="220" r="5"/><circle cx="540" cy="240" r="4"/><circle cx="630" cy="220" r="5"/>
      </g>
      <!-- Rough vegetation intermediate texture -->
      <rect x="0" y="0" width="800" height="600" fill="%23475569" opacity="0.25"/>
    `, 'SAR C-BAND (S1 VV+VH)')
  },

  before: {
    id: 'sample-before-urban',
    name: 'Landsat8_OLI_Suburban_Corridor_T1.tif',
    size: 21800000,
    type: 'image/tiff',
    dimensions: '7800 × 7900 px',
    sensor: 'Landsat 8 OLI/TIRS',
    date: '2024-03-15',
    url: 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=1200&q=80',
    fallbackUrl: makeSatSvg('%233f6212', `
      <!-- Dense green agricultural / vegetative cover before development -->
      <rect x="350" y="100" width="380" height="420" fill="%234d7c0f" opacity="0.8" />
      <path d="M 0,300 L 800,280" stroke="%23713f12" stroke-width="12" />
      <path d="M 220,0 L 260,600" stroke="%2364748b" stroke-width="10" />
      <rect x="80" y="120" width="120" height="150" fill="%23475569"/>
    `, 'T1: BEFORE (15 MAR 2024)')
  },

  after: {
    id: 'sample-after-urban',
    name: 'Landsat9_OLI2_Suburban_Corridor_T2.tif',
    size: 23100000,
    type: 'image/tiff',
    dimensions: '7800 × 7900 px',
    sensor: 'Landsat 9 OLI-2',
    date: '2026-04-18',
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    fallbackUrl: makeSatSvg('%231e293b', `
      <!-- Urbanization expansion in eastern sector -->
      <rect x="350" y="100" width="380" height="420" fill="%2364748b" opacity="0.9" />
      <!-- New road grid -->
      <line x1="380" y1="120" x2="380" y2="500" stroke="%23cbd5e1" stroke-width="4" />
      <line x1="480" y1="120" x2="480" y2="500" stroke="%23cbd5e1" stroke-width="4" />
      <line x1="580" y1="120" x2="580" y2="500" stroke="%23cbd5e1" stroke-width="4" />
      <line x1="680" y1="120" x2="680" y2="500" stroke="%23cbd5e1" stroke-width="4" />
      <line x1="360" y1="200" x2="720" y2="200" stroke="%23cbd5e1" stroke-width="4" />
      <line x1="360" y1="320" x2="720" y2="320" stroke="%23cbd5e1" stroke-width="4" />
      <line x1="360" y1="440" x2="720" y2="440" stroke="%23cbd5e1" stroke-width="4" />
      <!-- New industrial warehouse blocks -->
      <rect x="400" y="140" width="60" height="45" fill="%23ef4444" opacity="0.8"/>
      <rect x="500" y="140" width="60" height="45" fill="%23ef4444" opacity="0.8"/>
      <rect x="400" y="220" width="60" height="80" fill="%23ef4444" opacity="0.8"/>
      <rect x="500" y="220" width="60" height="80" fill="%23ef4444" opacity="0.8"/>
      <rect x="600" y="220" width="70" height="80" fill="%23ef4444" opacity="0.8"/>
    `, 'T2: AFTER (18 APR 2026)')
  }
};
