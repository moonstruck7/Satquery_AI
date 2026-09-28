import { useRef, useEffect, useState, useCallback } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Grid, Crosshair, Square, Download } from 'lucide-react';

export default function SatelliteViewer({ analysis }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [mode, setMode] = useState('single');
  const [layers, setLayers] = useState({
    source: true, evidence: false, changeRegions: false,
    boxes: false, grid: false, coordinates: false
  });

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');
    const w = container.clientWidth;
    const h = container.clientHeight;

    canvas.width = w;
    canvas.height = h;

    ctx.fillStyle = '#0A1118';
    ctx.fillRect(0, 0, w, h);

    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#0D151D');
    grad.addColorStop(0.5, '#101A23');
    grad.addColorStop(1, '#0D151D');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    if (layers.grid) {
      ctx.strokeStyle = 'rgba(0,180,216,0.08)';
      ctx.lineWidth = 0.5;
      for (let x = 0; x < w; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
      for (let y = 0; y < h; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
    }

    ctx.fillStyle = 'rgba(45,106,79,0.25)';
    ctx.fillRect(w*0.05, h*0.1, w*0.25, h*0.2);
    ctx.fillStyle = 'rgba(82,183,136,0.1)';
    ctx.fillRect(w*0.55, h*0.12, w*0.22, h*0.18);
    ctx.fillStyle = 'rgba(20,60,90,0.3)';
    ctx.fillRect(w*0.12, h*0.45, w*0.32, h*0.25);

    ctx.fillStyle = 'rgba(0,100,180,0.25)';
    ctx.beginPath();
    ctx.ellipse(w*0.72, h*0.55, w*0.12, h*0.08, 0.2, 0, Math.PI*2);
    ctx.fill();

    ctx.fillStyle = 'rgba(120,100,80,0.35)';
    ctx.fillRect(w*0.6, h*0.08, w*0.18, h*0.12);
    ctx.fillRect(w*0.78, h*0.25, w*0.12, h*0.1);

    if (layers.evidence && analysis?.evidence?.boxes) {
      analysis.evidence.boxes.forEach(box => {
        ctx.strokeStyle = '#00B4D8';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        const bx = (box.x / 300) * w;
        const by = (box.y / 400) * h;
        const bw = (box.w / 300) * w;
        const bh = (box.h / 400) * h;
        ctx.strokeRect(bx, by, bw, bh);
        ctx.fillStyle = 'rgba(0,180,216,0.08)';
        ctx.fillRect(bx, by, bw, bh);
        ctx.setLineDash([]);
        ctx.fillStyle = '#00B4D8';
        ctx.font = '10px sans-serif';
        ctx.fillText(box.label, bx, by - 5);
      });
    }

    if (layers.changeRegions && analysis?.evidence?.regions) {
      analysis.evidence.regions.forEach(r => {
        ctx.strokeStyle = r.type === 'new_builtup' ? '#F59E0B' : '#EF4444';
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 3]);
        ctx.strokeRect(w*0.55 + r.coordinates[0]*50, h*0.25 + r.coordinates[1]*150, 80, 60);
        ctx.setLineDash([]);
        ctx.fillStyle = r.type === 'new_builtup' ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)';
        ctx.fillRect(w*0.55 + r.coordinates[0]*50, h*0.25 + r.coordinates[1]*150, 80, 60);
      });
    }

    if (layers.boxes && analysis?.evidence?.boxes) {
      analysis.evidence.boxes.forEach(box => {
        ctx.strokeStyle = '#52B788';
        ctx.lineWidth = 1.5;
        const bx = (box.x / 300) * w;
        const by = (box.y / 400) * h;
        ctx.strokeRect(bx, by, (box.w/300)*w, (box.h/400)*h);
      });
    }

    if (layers.coordinates) {
      ctx.fillStyle = 'rgba(0,180,216,0.7)';
      ctx.font = '10px monospace';
      ctx.fillText('28.50°N  77.20°E', 10, h - 30);
      ctx.fillText('28.55°N  77.30°E', 10, h - 15);
    }

    ctx.fillStyle = '#EF4444';
    ctx.beginPath();
    ctx.moveTo(w/2, 12);
    ctx.lineTo(w/2 - 8, 30);
    ctx.lineTo(w/2 + 8, 30);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#EF4444';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('N', w/2, 44);
    ctx.textAlign = 'left';

    ctx.strokeStyle = 'rgba(255,255,255,0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(20, h-20); ctx.lineTo(120, h-20); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(20, h-24); ctx.lineTo(20, h-16); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(120, h-24); ctx.lineTo(120, h-16); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '9px sans-serif';
    ctx.fillText('500m', 55, h-10);
  }, [zoom, mode, layers, analysis]);

  useEffect(() => { draw(); }, [draw]);

  const toggleLayer = (key) => setLayers(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="h-9 bg-earth-800 border-b border-white/5 flex items-center justify-between px-3">
        <div className="flex items-center gap-1">
          <button onClick={() => setZoom(z => Math.min(z+0.2, 3))} className="p-1 rounded hover:bg-white/5 text-gray-400 hover:text-white">
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => setZoom(z => Math.max(z-0.2, 0.5))} className="p-1 rounded hover:bg-white/5 text-gray-400 hover:text-white">
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] font-mono text-gray-500 ml-1">{Math.round(zoom*100)}%</span>
        </div>
        <div className="flex items-center gap-1">
          {analysis?.inputs?.length === 2 && (
            <>
              {['before','after','split','diff'].map(m => (
                <button key={m} onClick={() => setMode(m)} className={"px-2 py-0.5 rounded text-[10px] " + (mode===m?'bg-satellite-500/20 text-satellite-300':'text-gray-500 hover:text-white')}>
                  {m.toUpperCase()}
                </button>
              ))}
            </>
          )}
          {analysis?.inputs?.some(i => i.modality === 'sar') && (
            <>
              <span className="w-px h-4 bg-white/10 mx-1"></span>
              {['optical','sar','fused'].map(m => (
                <button key={m} onClick={() => setMode(m)} className={"px-2 py-0.5 rounded text-[10px] " + (mode===m?'bg-satellite-500/20 text-satellite-300':'text-gray-500 hover:text-white')}>
                  {m.toUpperCase()}
                </button>
              ))}
            </>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button className="p-1 rounded hover:bg-white/5 text-gray-400 hover:text-white"><Download className="w-3.5 h-3.5" /></button>
          <button className="p-1 rounded hover:bg-white/5 text-gray-400 hover:text-white"><Maximize2 className="w-3.5 h-3.5" /></button>
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden bg-earth-900" ref={containerRef}>
        <canvas ref={canvasRef} className="w-full h-full" style={{ imageRendering: 'pixelated' }} />

        <div className="absolute top-3 left-3 px-2 py-1 rounded bg-earth-900/80 border border-white/10">
          <span className="text-[10px] font-mono text-gray-400">{mode.toUpperCase()}</span>
        </div>

        <div className="absolute bottom-3 left-3 px-2 py-1 rounded bg-earth-900/80 border border-white/10">
          <span className="text-[10px] font-mono text-gray-500">{Math.round(zoom*100)}% zoom</span>
        </div>
      </div>

      <div className="h-auto bg-earth-800 border-t border-white/5 p-3">
        <div className="flex items-center gap-4 flex-wrap">
          {Object.entries(layers).map(([key, val]) => (
            <label key={key} className="flex items-center gap-1.5 cursor-pointer">
              <input type="checkbox" checked={val} onChange={() => toggleLayer(key)}
                className="w-3 h-3 rounded border-white/20 bg-earth-700 text-satellite-500" />
              <span className="text-[10px] text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}