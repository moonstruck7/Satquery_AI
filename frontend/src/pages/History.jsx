import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAnalysis } from '../hooks/useAnalysis.js';
import { analysisService } from '../services/analysisService.js';
import { formatDate, formatDateTime } from '../utils/helpers.js';
import { StatusBadge } from '../components/common/StatusBadge.jsx';
import { Modal } from '../components/common/Modal.jsx';
import {
  History as HistoryIcon,
  Search,
  Filter,
  ArrowUpDown,
  Bookmark,
  BookmarkCheck,
  Trash2,
  ExternalLink,
  Clock,
  Layers,
  Sparkles,
  RotateCcw
} from 'lucide-react';

export function History() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const filterParam = searchParams.get('filter');

  const { loadHistoricalAnalysis, addToast } = useAnalysis();

  const [historyItems, setHistoryItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [taskFilter, setTaskFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [savedOnly, setSavedOnly] = useState(filterParam === 'saved');
  const [sortBy, setSortBy] = useState('date_desc');

  const [deleteTargetId, setDeleteTargetId] = useState(null);

  useEffect(() => {
    if (filterParam === 'saved') {
      setSavedOnly(true);
    }
  }, [filterParam]);

  const loadHistory = async () => {
    const data = await analysisService.getHistory();
    setHistoryItems(data);
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleOpenAnalysis = async (id) => {
    await loadHistoricalAnalysis(id);
    navigate('/workspace');
  };

  const handleToggleSave = (id, e) => {
    e.stopPropagation();
    const updated = analysisService.toggleSaveAnalysis(id);
    setHistoryItems(updated);
    addToast('Bookmark updated.', 'success');
  };

  const confirmDelete = () => {
    if (deleteTargetId) {
      const updated = analysisService.deleteHistoryItem(deleteTargetId);
      setHistoryItems(updated);
      setDeleteTargetId(null);
      addToast('Analysis record deleted.', 'info');
    }
  };

  const filteredItems = useMemo(() => {
    return historyItems.filter((item) => {
      const matchesSearch =
        !searchTerm ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.query.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.taskLabel?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesTask = taskFilter === 'all' || item.task === taskFilter;

      const matchesStatus = statusFilter === 'all' || item.status.toLowerCase() === statusFilter.toLowerCase();

      const matchesSaved = !savedOnly || item.saved;

      return matchesSearch && matchesTask && matchesStatus && matchesSaved;
    }).sort((a, b) => {
      if (sortBy === 'date_desc') return new Date(b.date) - new Date(a.date);
      if (sortBy === 'date_asc') return new Date(a.date) - new Date(b.date);
      if (sortBy === 'duration') return parseFloat(b.duration) - parseFloat(a.duration);
      return 0;
    });
  }, [historyItems, searchTerm, taskFilter, statusFilter, savedOnly, sortBy]);

  return (
    <div className="min-h-full p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-mono text-slate-100 flex items-center gap-2.5">
            <HistoryIcon className="w-6 h-6 text-cyan-400" />
            ANALYSIS HISTORY & LOGS
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Persisted execution sessions, visual evidence packages, and query traces
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSavedOnly(!savedOnly)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              savedOnly
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            <BookmarkCheck className="w-3.5 h-3.5" />
            <span>{savedOnly ? 'Showing Saved' : 'Filter Saved'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 font-mono text-xs">
        <div className="lg:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search query, ID, or model..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <select
            value={taskFilter}
            onChange={(e) => setTaskFilter(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Tasks</option>
            <option value="change_detection">Change Detection</option>
            <option value="optical_sar">Optical + SAR</option>
            <option value="vqa">Visual QA</option>
            <option value="grounding">Spatial Grounding</option>
          </select>
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="running">Processing</option>
          </select>
        </div>

        <div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="date_desc">Newest First</option>
            <option value="date_asc">Oldest First</option>
            <option value="duration">Execution Duration</option>
          </select>
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 space-y-3 font-mono">
          <HistoryIcon className="w-8 h-8 text-slate-400 mx-auto opacity-40" />
          <h3 className="text-sm font-bold text-slate-300">NO ANALYSES FOUND</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto font-sans">
            No analysis sessions match your active filters. Launch the workspace to run a new remote sensing query.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setTaskFilter('all');
              setStatusFilter('all');
              setSavedOnly(false);
            }}
            className="px-3 py-1.5 rounded-lg bg-slate-800 text-cyan-300 text-xs hover:bg-slate-700 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="border border-slate-800 rounded-xl overflow-hidden shadow-xl bg-slate-900/60 font-mono text-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/80 text-[10px] text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">ANALYSIS ID</th>
                  <th className="py-3 px-4">DATE</th>
                  <th className="py-3 px-4">TASK</th>
                  <th className="py-3 px-4">QUERY</th>
                  <th className="py-3 px-4">INPUT TYPE</th>
                  <th className="py-3 px-4">STATUS</th>
                  <th className="py-3 px-4">MODEL</th>
                  <th className="py-3 px-4">TIME</th>
                  <th className="py-3 px-4 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredItems.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => handleOpenAnalysis(item.id)}
                    className="hover:bg-slate-800/60 cursor-pointer transition-colors group"
                  >
                    <td className="py-3 px-4 font-bold text-cyan-300 whitespace-nowrap">
                      {item.id}
                    </td>

                    <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                      {formatDate(item.date)}
                    </td>

                    <td className="py-3 px-4 text-slate-200 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[11px]">
                        {item.taskLabel || item.task}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-slate-300 font-sans max-w-xs truncate" title={item.query}>
                      {item.query}
                    </td>

                    <td className="py-3 px-4 text-slate-400 text-[11px] whitespace-nowrap">
                      {item.inputType}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <StatusBadge status={item.status} size="sm" />
                    </td>

                    <td className="py-3 px-4 text-slate-400 text-[11px] whitespace-nowrap">
                      {item.model}
                    </td>

                    <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                      {item.duration}
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={(e) => handleToggleSave(item.id, e)}
                          className={`p-1.5 rounded hover:bg-slate-700 transition-colors ${
                            item.saved ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
                          }`}
                          title={item.saved ? 'Remove Bookmark' : 'Bookmark Analysis'}
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleOpenAnalysis(item.id)}
                          className="p-1.5 rounded text-cyan-400 hover:bg-slate-700 hover:text-cyan-300 transition-colors"
                          title="Open in Workspace"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => setDeleteTargetId(item.id)}
                          className="p-1.5 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
                          title="Delete from log"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        title="DELETE HISTORICAL ANALYSIS"
        actions={
          <>
            <button
              onClick={() => setDeleteTargetId(null)}
              className="px-3.5 py-1.5 rounded-lg text-xs font-mono text-slate-300 hover:bg-slate-800 transition-colors"
            >
              CANCEL
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-1.5 rounded-lg text-xs font-mono font-bold bg-rose-600 hover:bg-rose-500 text-white transition-colors"
            >
              DELETE PERMANENTLY
            </button>
          </>
        }
      >
        <p>
          Are you sure you want to remove analysis <strong className="text-cyan-300 font-mono">{deleteTargetId}</strong> from local session storage? This action cannot be reversed.
        </p>
      </Modal>
    </div>
  );
}