// Lightweight frontend state management for analysis sessions
import { create } from 'zustand';
import { runMockAnalysis } from '../services/analysisService';

const useAnalysisStore = create((set, get) => ({
  currentAnalysis: null,
  history: [],
  loading: false,
  error: null,

  runAnalysis: async ({ query, inputs }) => {
    set({ loading: true, error: null });
    try {
      const result = await runMockAnalysis({ query, inputs });
      set({ currentAnalysis: result, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  clearAnalysis: () => set({ currentAnalysis: null, error: null }),

  addToHistory: (analysis) => set(state => ({
    history: [analysis, ...state.history]
  })),
}));

export default useAnalysisStore;