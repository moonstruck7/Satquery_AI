import { MOCK_ANALYSES } from '../mock/analyses.js';
import { INITIAL_HISTORY } from '../mock/history.js';
import { MOCK_MODELS } from '../mock/models.js';
import { MOCK_DATASETS } from '../mock/datasets.js';
import { generateId, sleep } from '../utils/helpers.js';

const STORAGE_HISTORY_KEY = 'satquery_history_v1';
const STORAGE_SAVED_KEY = 'satquery_saved_analyses_v1';

export const analysisService = {
  async runAnalysis(payload) {
    const { mode, query, files, onProgress } = payload;

    const stages = [
      'Understanding query',
      'Preparing response'
    ];

    for (let i = 0; i < stages.length; i++) {
      if (typeof onProgress === 'function') {
        onProgress(i, stages[i]);
      }
      await sleep(350 + Math.random() * 200);
    }

    let templateKey = 'change_detection';
    if (mode === 'before_after') {
      templateKey = 'change_detection';
    } else if (mode === 'optical_sar') {
      templateKey = 'optical_sar';
    } else {
      const qLower = (query || '').toLowerCase();
      if (qLower.includes('highlight') || qLower.includes('box') || qLower.includes('ground') || qLower.includes('where')) {
        templateKey = 'grounding';
      } else {
        templateKey = 'vqa';
      }
    }

    const template = MOCK_ANALYSES[templateKey];
    const newId = generateId('SQ');

    const result = {
      ...template,
      id: newId,
      task: template.task,
      taskLabel: template.taskLabel,
      query: query || template.query,
      mode: mode,
      createdAt: new Date().toISOString(),
      filesInfo: files || {},
      conversation: [
        {
          id: 'msg-initial-user',
          sender: 'user',
          text: query || template.query,
          timestamp: new Date().toISOString()
        },
        {
          id: 'msg-initial-assistant',
          sender: 'assistant',
          text: template.answer,
          timestamp: new Date(Date.now() + 2500).toISOString()
        }
      ]
    };

    this.recordToHistory(result);

    return result;
  },

  async sendFollowUp(analysisId, question, currentAnalysis) {
    await sleep(900 + Math.random() * 400);

    const qLower = question.toLowerCase();
    let followUpAnswer = '';

    if (qLower.includes('where') || qLower.includes('location') || qLower.includes('coordinate') || qLower.includes('quadrant')) {
      followUpAnswer = 'The primary detected features are located in the eastern quadrant (lat/lon offset approximately 1.4 km from scene center). Spatial coordinate bounds are marked in the active evidence overlays.';
    } else if (qLower.includes('vessel') || qLower.includes('ship') || qLower.includes('size') || qLower.includes('length')) {
      followUpAnswer = 'The largest detected vessel along Quay 2 measures 240.5 meters in length with an estimated beam of 32.2 meters, classified as a Panamax-class commercial container carrier.';
    } else if (qLower.includes('confidence') || qLower.includes('uncertain') || qLower.includes('accuracy')) {
      followUpAnswer = 'Model evidence strength is rated HIGH based on multi-spectral reflectance clarity (cloud cover < 2%) and cross-modal radar backscatter agreement (+11 dB contrast ratio).';
    } else if (qLower.includes('sar') || qLower.includes('radar') || qLower.includes('polarization')) {
      followUpAnswer = 'Sentinel-1 C-Band SAR backscatter confirms distinct surface roughness: calm water surfaces display specular drop (< -22 dB), while orthogonal building facades exhibit double-bounce reflections exceeding +12 dB.';
    } else {
      followUpAnswer = `In relation to your follow-up query "${question}", localized spatial evidence indicates consistent alignment across the analyzed spectral bands. The regional boundaries remain highlighted in the evidence viewer.`;
    }

    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      text: followUpAnswer,
      timestamp: new Date().toISOString()
    };
  },

  async getAnalysis(id) {
    await sleep(200);
    const history = this.getHistorySync();
    const foundInHistory = history.find(item => item.id === id);
    if (foundInHistory) {
      const template = MOCK_ANALYSES[foundInHistory.task] || MOCK_ANALYSES['change_detection'];
      return {
        ...template,
        ...foundInHistory
      };
    }
    return MOCK_ANALYSES['change_detection'];
  },

  async getHistory() {
    await sleep(150);
    return this.getHistorySync();
  },

  getHistorySync() {
    try {
      const stored = localStorage.getItem(STORAGE_HISTORY_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Could not read history from localStorage', e);
    }
    return INITIAL_HISTORY;
  },

  recordToHistory(analysis) {
    try {
      const current = this.getHistorySync();
      const newEntry = {
        id: analysis.id,
        date: analysis.createdAt,
        task: analysis.task,
        taskLabel: analysis.taskLabel,
        query: analysis.query,
        inputType: analysis.mode === 'before_after' ? 'Bi-temporal Pair' : analysis.mode === 'optical_sar' ? 'Optical + SAR Pair' : 'Single Image',
        mode: analysis.mode,
        status: 'Completed',
        model: analysis.model,
        duration: analysis.processingTime,
        evidenceFound: `${analysis.regions?.length || 0} regions detected`,
        saved: false
      };
      const updated = [newEntry, ...current.filter(item => item.id !== analysis.id)].slice(0, 50);
      localStorage.setItem(STORAGE_HISTORY_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not save history to localStorage', e);
    }
  },

  toggleSaveAnalysis(id) {
    try {
      const history = this.getHistorySync();
      const updated = history.map(item => {
        if (item.id === id) {
          return { ...item, saved: !item.saved };
        }
        return item;
      });
      localStorage.setItem(STORAGE_HISTORY_KEY, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.warn('Could not toggle save in localStorage', e);
      return [];
    }
  },

  deleteHistoryItem(id) {
    try {
      const history = this.getHistorySync();
      const updated = history.filter(item => item.id !== id);
      localStorage.setItem(STORAGE_HISTORY_KEY, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.warn('Could not delete history item', e);
      return [];
    }
  },

  clearHistory() {
    try {
      localStorage.removeItem(STORAGE_HISTORY_KEY);
    } catch (e) {
      console.warn('Could not clear history', e);
    }
    return [];
  },

  async getDatasets() {
    await sleep(150);
    return MOCK_DATASETS;
  },

  async getModels() {
    await sleep(150);
    return MOCK_MODELS;
  }
};
