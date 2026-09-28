import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { SAMPLE_IMAGES } from '../mock/images.js';
import { MOCK_ANALYSES } from '../mock/analyses.js';
import { analysisService } from '../services/analysisService.js';

const AnalysisContext = createContext(null);

export function AnalysisProvider({ children }) {
  // Input mode: 'single' | 'optical_sar' | 'before_after'
  const [inputMode, setInputMode] = useState('before_after');

  // Selected files state
  // Structure:
  // single: { file, previewUrl, name, size, type, dimensions }
  // optical_sar: { optical: { file, previewUrl, ... }, sar: { file, previewUrl, ... } }
  // before_after: { before: { file, previewUrl, date, ... }, after: { file, previewUrl, date, ... } }
  const [files, setFiles] = useState({
    single: null,
    optical_sar: {
      optical: null,
      sar: null
    },
    before_after: {
      before: null,
      after: null
    }
  });

  // Query composer state
  const [query, setQuery] = useState('');

  // Analysis workflow state
  const [analysisStatus, setAnalysisStatus] = useState('completed'); // 'idle' | 'processing' | 'completed' | 'error'
  const [processingStep, setProcessingStep] = useState(5);
  const [processingLabel, setProcessingLabel] = useState('Preparing response');
  const [currentAnalysis, setCurrentAnalysis] = useState(MOCK_ANALYSES['change_detection']);
  const [error, setError] = useState(null);

  // Viewer state
  const [zoom, setZoom] = useState(1);
  const [imageOpacity, setImageOpacity] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  const [showNorth, setShowNorth] = useState(true);
  const [showEvidence, setShowEvidence] = useState(true);
  const [activeRegionId, setActiveRegionId] = useState(null);
  
  // Specific viewers
  // Optical + SAR tabs: 'optical' | 'sar' | 'fused' | 'evidence'
  const [optSarTab, setOptSarTab] = useState('fused');
  
  // Before + After mode: 'split' | 'side-by-side' | 'difference' | 'change-map'
  const [temporalViewMode, setTemporalViewMode] = useState('split');
  const [splitPosition, setSplitPosition] = useState(50); // percentage 0-100

  // Presentation mode
  const [isPresentationMode, setIsPresentationMode] = useState(false);

  // Follow-up conversation state
  const [conversation, setConversation] = useState([
    {
      id: 'msg-1',
      sender: 'user',
      text: 'What changed between these two dates? Has the built-up area increased?',
      timestamp: '04:12:00'
    },
    {
      id: 'msg-2',
      sender: 'assistant',
      text: MOCK_ANALYSES['change_detection'].answer,
      timestamp: '04:12:02'
    }
  ]);
  const [isAnsweringFollowUp, setIsAnsweringFollowUp] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Update file in state with automatic preview URL generation
  const setDeviceFile = useCallback((slotKey, subKey, file, customMetadata = {}) => {
    if (!file) return;

    // Check size (500MB browser limit guard)
    if (file.size > 500 * 1024 * 1024) {
      addToast('File size exceeds the 500MB frontend limit.', 'error');
      return;
    }

    let previewUrl = null;
    const isDirectlyRenderable = file.type.startsWith('image/jpeg') || 
                                file.type.startsWith('image/png') || 
                                file.type.startsWith('image/webp') || 
                                file.type.startsWith('image/svg+xml');

    if (isDirectlyRenderable) {
      previewUrl = URL.createObjectURL(file);
    }

    const fileMeta = {
      file,
      name: file.name,
      size: file.size,
      type: file.type || 'image/raw-raster',
      isGeoTiff: file.name.endsWith('.tif') || file.name.endsWith('.tiff') || file.name.endsWith('.jp2'),
      previewUrl,
      lastModified: file.lastModified,
      date: customMetadata.date || new Date().toISOString().split('T')[0],
      sensor: customMetadata.sensor || 'Device File',
      ...customMetadata
    };

    setFiles((prev) => {
      if (slotKey === 'single') {
        if (prev.single?.previewUrl) {
          URL.revokeObjectURL(prev.single.previewUrl);
        }
        return { ...prev, single: fileMeta };
      } else {
        const currentSlot = prev[slotKey] || {};
        if (currentSlot[subKey]?.previewUrl) {
          URL.revokeObjectURL(currentSlot[subKey].previewUrl);
        }
        return {
          ...prev,
          [slotKey]: {
            ...currentSlot,
            [subKey]: fileMeta
          }
        };
      }
    });

    addToast(`Selected ${file.name} directly from device.`, 'success');
  }, [addToast]);

  // Remove file
  const removeDeviceFile = useCallback((slotKey, subKey = null) => {
    setFiles((prev) => {
      if (slotKey === 'single') {
        if (prev.single?.previewUrl) URL.revokeObjectURL(prev.single.previewUrl);
        return { ...prev, single: null };
      } else {
        const slot = prev[slotKey];
        if (slot && slot[subKey]?.previewUrl) {
          URL.revokeObjectURL(slot[subKey].previewUrl);
        }
        return {
          ...prev,
          [slotKey]: {
            ...slot,
            [subKey]: null
          }
        };
      }
    });
    addToast('Image removed.', 'info');
  }, [addToast]);

  // Clear all files
  const clearAllFiles = useCallback(() => {
    // Revoke all created URLs
    if (files.single?.previewUrl) URL.revokeObjectURL(files.single.previewUrl);
    if (files.optical_sar.optical?.previewUrl) URL.revokeObjectURL(files.optical_sar.optical.previewUrl);
    if (files.optical_sar.sar?.previewUrl) URL.revokeObjectURL(files.optical_sar.sar.previewUrl);
    if (files.before_after.before?.previewUrl) URL.revokeObjectURL(files.before_after.before.previewUrl);
    if (files.before_after.after?.previewUrl) URL.revokeObjectURL(files.before_after.after.previewUrl);

    setFiles({
      single: null,
      optical_sar: { optical: null, sar: null },
      before_after: { before: null, after: null }
    });
    addToast('Workspace files cleared.', 'info');
  }, [files, addToast]);

  // Execute Analysis
  const handleRunAnalysis = useCallback(async () => {
    if (!query.trim()) {
      addToast('Please enter a question before analyzing.', 'error');
      return;
    }

    setAnalysisStatus('processing');
    setProcessingStep(0);
    setProcessingLabel('Understanding query');
    addToast('SatQuery analysis initiated...', 'info');

    try {
      const activeFiles = files[inputMode];
      const result = await analysisService.runAnalysis({
        mode: inputMode,
        query,
        files: activeFiles,
        onProgress: (stepIdx, stepName) => {
          setProcessingStep(stepIdx);
          setProcessingLabel(stepName);
        }
      });

      setCurrentAnalysis(result);
      setConversation([
        {
          id: 'msg-start-user',
          sender: 'user',
          text: query,
          timestamp: new Date().toLocaleTimeString()
        },
        {
          id: 'msg-start-assistant',
          sender: 'assistant',
          text: result.answer,
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
      setAnalysisStatus('completed');
      setShowEvidence(true);
      addToast('Analysis completed successfully!', 'success');
    } catch (err) {
      console.error(err);
      setAnalysisStatus('error');
      setError('Analysis simulation encountered an error. Please try again.');
      addToast('Analysis failed. Try again.', 'error');
    }
  }, [query, inputMode, files, addToast]);

  // Handle follow-up query submission
  const handleSendFollowUp = useCallback(async (followUpText) => {
    if (!followUpText.trim() || isAnsweringFollowUp) return;

    const userMsg = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: followUpText,
      timestamp: new Date().toLocaleTimeString()
    };

    setConversation((prev) => [...prev, userMsg]);
    setIsAnsweringFollowUp(true);

    try {
      const resp = await analysisService.sendFollowUp(
        currentAnalysis?.id,
        followUpText,
        currentAnalysis
      );
      setConversation((prev) => [...prev, resp]);
    } catch (err) {
      console.error(err);
      addToast('Failed to process follow-up.', 'error');
    } finally {
      setIsAnsweringFollowUp(false);
    }
  }, [isAnsweringFollowUp, currentAnalysis, addToast]);

  // Load a historical analysis into workspace
  const loadHistoricalAnalysis = useCallback(async (analysisId) => {
    const data = await analysisService.getAnalysis(analysisId);
    if (data) {
      setCurrentAnalysis(data);
      setInputMode(data.mode || 'before_after');
      setQuery(data.query || '');
      setAnalysisStatus('completed');
      setConversation([
        {
          id: 'msg-hist-user',
          sender: 'user',
          text: data.query,
          timestamp: 'Previous Session'
        },
        {
          id: 'msg-hist-assistant',
          sender: 'assistant',
          text: data.answer,
          timestamp: 'Previous Session'
        }
      ]);
      setShowEvidence(true);
      addToast(`Loaded analysis ${data.id}`, 'info');
    }
  }, [addToast]);

  // Change input mode with default recommended query
  const changeInputMode = useCallback((mode) => {
    setInputMode(mode);
    if (mode === 'single') {
      setQuery('Describe the land-cover and major objects visible in this image.');
      if (currentAnalysis?.task !== 'vqa' && currentAnalysis?.task !== 'grounding') {
        setCurrentAnalysis(MOCK_ANALYSES['vqa']);
      }
    } else if (mode === 'optical_sar') {
      setQuery('Use the optical and SAR images together to identify built-up and water-covered regions.');
      if (currentAnalysis?.task !== 'optical_sar') {
        setCurrentAnalysis(MOCK_ANALYSES['optical_sar']);
      }
    } else if (mode === 'before_after') {
      setQuery('What changed between these two dates? Has the built-up area increased?');
      if (currentAnalysis?.task !== 'change_detection') {
        setCurrentAnalysis(MOCK_ANALYSES['change_detection']);
      }
    }
  }, [currentAnalysis]);

  // Toggle save current analysis
  const toggleSaveCurrentAnalysis = useCallback(() => {
    if (!currentAnalysis?.id) return;
    analysisService.toggleSaveAnalysis(currentAnalysis.id);
    addToast('Analysis bookmark updated.', 'success');
  }, [currentAnalysis, addToast]);

  const value = useMemo(() => ({
    inputMode,
    changeInputMode,
    files,
    setDeviceFile,
    removeDeviceFile,
    clearAllFiles,
    query,
    setQuery,
    analysisStatus,
    setAnalysisStatus,
    processingStep,
    processingLabel,
    currentAnalysis,
    setCurrentAnalysis,
    handleRunAnalysis,
    error,
    zoom,
    setZoom,
    imageOpacity,
    setImageOpacity,
    showGrid,
    setShowGrid,
    showNorth,
    setShowNorth,
    showEvidence,
    setShowEvidence,
    activeRegionId,
    setActiveRegionId,
    optSarTab,
    setOptSarTab,
    temporalViewMode,
    setTemporalViewMode,
    splitPosition,
    setSplitPosition,
    isPresentationMode,
    setIsPresentationMode,
    conversation,
    isAnsweringFollowUp,
    handleSendFollowUp,
    loadHistoricalAnalysis,
    toggleSaveCurrentAnalysis,
    toasts,
    addToast,
    removeToast
  }), [
    inputMode,
    changeInputMode,
    files,
    setDeviceFile,
    removeDeviceFile,
    clearAllFiles,
    query,
    analysisStatus,
    processingStep,
    processingLabel,
    currentAnalysis,
    handleRunAnalysis,
    error,
    zoom,
    imageOpacity,
    showGrid,
    showNorth,
    showEvidence,
    activeRegionId,
    optSarTab,
    temporalViewMode,
    splitPosition,
    isPresentationMode,
    conversation,
    isAnsweringFollowUp,
    handleSendFollowUp,
    loadHistoricalAnalysis,
    toggleSaveCurrentAnalysis,
    toasts,
    addToast,
    removeToast
  ]);

  return (
    <AnalysisContext.Provider value={value}>
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysis() {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }
  return context;
}
