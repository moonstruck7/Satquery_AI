import { useState } from 'react';
import { Paperclip, Send, Image } from 'lucide-react';

export default function QueryComposer({ onAnalyze, loading, disabled }) {
  const [query, setQuery] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const quickPrompts = [
    "Describe the land-cover and major objects visible in this image.",
    "What changed between these two dates?",
    "Has the built-up area increased?",
    "Use the optical and SAR images together to identify built-up and water-covered regions.",
    "Highlight the water body referred to in the query."
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim() || loading || disabled) return;
    onAnalyze(query, { files: uploadedFiles });
  };

  return (
    <div className="p-4 border-b border-white/5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Query Composer</span>
      </div>

      {/* Upload area */}
      <div
        className="mb-4 p-4 rounded-lg border-2 border-dashed border-white/10 bg-earth-700/30 hover:border-satellite-500/30 transition-colors cursor-pointer"
        onClick={() => !disabled && document.getElementById('file-upload').click()}
      >
        <input
          id="file-upload"
          type="file"
          multiple
          accept=".tiff,.tif,.png,.jpeg,.jpg"
          className="hidden"
          disabled={disabled}
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              setUploadedFiles(Array.from(e.target.files));
            }
          }}
        />

        {uploadedFiles.length > 0 ? (
          <div className="space-y-2">
            {uploadedFiles.map((file, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-gray-300">
                <Image className="w-3.5 h-3.5 text-satellite-400" />
                <span className="flex-1 truncate">{file.name}</span>
                <span className="text-[10px] font-mono text-gray-500">{(file.size/1024).toFixed(0)} KB</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <Image className="w-6 h-6 mx-auto text-gray-600 mb-2" />
            <div className="text-xs text-gray-500">Drop imagery here or click to browse</div>
            <div className="text-[10px] text-gray-600 mt-1">GeoTIFF • TIFF • PNG • JPEG</div>
          </div>
        )}
      </div>

      <div className="mb-3">
        <div className="text-[10px] text-gray-500 mb-2 uppercase tracking-wider">Quick prompts</div>
        <div className="flex flex-wrap gap-1.5">
          {quickPrompts.map(p => (
            <button
              key={p}
              onClick={() => setQuery(p)}
              disabled={disabled}
              className="text-[10px] px-2 py-1 rounded bg-earth-700/50 text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              {p.length > 40 ? p.slice(0, 40) + '...' : p}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <textarea
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Ask anything about the selected imagery..."
          disabled={disabled}
          className="w-full h-20 px-3 py-2 rounded-lg bg-earth-700/50 border border-white/10 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-satellite-500/50 resize-none"
        />
        <div className="flex items-center justify-between mt-2">
          <div className="text-[10px] font-mono text-gray-600">Ctrl + Enter to submit</div>
          <button
            type="submit"
            disabled={!query.trim() || loading || disabled}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-satellite-500 hover:bg-satellite-400 text-earth-900 text-xs font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send className="w-3 h-3" /> Ask SatQuery
          </button>
        </div>
      </form>
    </div>
  );
}