import { useState, useEffect, useCallback } from 'react';
import { saveToLocalStorage, loadFromLocalStorage } from '../utils/localStorage';

const STORAGE_KEY = 'counterAppData';

const defaultState = {
  counter: 0,
  increment: 1,
  totalIncrements: 0,
  totalDecrements: 0,
  highestValue: 0,
  history: [],
  multiCounters: {},
  settings: {
    theme: 'light',
    counterColor: '#6366f1',
    soundEnabled: false,
    autoSave: true
  }
};

export const useCounter = () => {
  const [state, setState] = useState(() => {
    const saved = loadFromLocalStorage(STORAGE_KEY);
    return saved || defaultState;
  });

  // Load initial state from localStorage
  useEffect(() => {
    const saved = loadFromLocalStorage(STORAGE_KEY);
    if (saved) {
      setState(saved);
    }
  }, []);

  // Auto-save when state changes
  useEffect(() => {
    if (state.settings.autoSave) {
      saveToLocalStorage(STORAGE_KEY, state);
    }
  }, [state]);

  const updateState = useCallback((updates) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const incrementCounter = useCallback(() => {
    setState(prev => {
      const newCounter = prev.counter + prev.increment;
      const newHistory = [
        {
          action: 'Increment',
          value: prev.increment,
          time: new Date().toLocaleTimeString()
        },
        ...prev.history.slice(0, 49)
      ];
      
      return {
        ...prev,
        counter: newCounter,
        totalIncrements: prev.totalIncrements + 1,
        highestValue: newCounter > prev.highestValue ? newCounter : prev.highestValue,
        history: newHistory
      };
    });
  }, []);

  const decrementCounter = useCallback(() => {
    setState(prev => {
      const newCounter = prev.counter - prev.increment;
      const newHistory = [
        {
          action: 'Decrement',
          value: -prev.increment,
          time: new Date().toLocaleTimeString()
        },
        ...prev.history.slice(0, 49)
      ];
      
      return {
        ...prev,
        counter: newCounter,
        totalDecrements: prev.totalDecrements + 1,
        history: newHistory
      };
    });
  }, []);

  const resetCounter = useCallback(() => {
    setState(prev => {
      const newHistory = prev.counter !== 0 ? [
        {
          action: 'Reset',
          value: -prev.counter,
          time: new Date().toLocaleTimeString()
        },
        ...prev.history.slice(0, 49)
      ] : prev.history;
      
      return {
        ...prev,
        counter: 0,
        history: newHistory
      };
    });
  }, []);

  const setIncrement = useCallback((value) => {
    setState(prev => ({ ...prev, increment: Math.max(1, parseInt(value) || 1) }));
  }, []);

  const clearHistory = useCallback(() => {
    if (window.confirm('Are you sure you want to clear the history?')) {
      setState(prev => ({ ...prev, history: [] }));
    }
  }, []);

  const addMultiCounter = useCallback((name) => {
    setState(prev => {
      if (prev.multiCounters[name]) {
        alert('A counter with this name already exists');
        return prev;
      }
      return {
        ...prev,
        multiCounters: { ...prev.multiCounters, [name]: 0 }
      };
    });
  }, []);

  const removeMultiCounter = useCallback((name) => {
    setState(prev => {
      const { [name]: removed, ...rest } = prev.multiCounters;
      return { ...prev, multiCounters: rest };
    });
  }, []);

  const incrementMultiCounter = useCallback((name) => {
    setState(prev => ({
      ...prev,
      multiCounters: {
        ...prev.multiCounters,
        [name]: (prev.multiCounters[name] || 0) + 1
      }
    }));
  }, []);

  const decrementMultiCounter = useCallback((name) => {
    setState(prev => ({
      ...prev,
      multiCounters: {
        ...prev.multiCounters,
        [name]: (prev.multiCounters[name] || 0) - 1
      }
    }));
  }, []);

  const resetMultiCounter = useCallback((name) => {
    setState(prev => ({
      ...prev,
      multiCounters: {
        ...prev.multiCounters,
        [name]: 0
      }
    }));
  }, []);

  const updateSettings = useCallback((settings) => {
    setState(prev => ({
      ...prev,
      settings: { ...prev.settings, ...settings }
    }));
  }, []);

  const resetSettings = useCallback(() => {
    if (window.confirm('Are you sure you want to reset all settings to defaults?')) {
      setState(prev => ({
        ...prev,
        settings: defaultState.settings
      }));
    }
  }, []);

  const clearAllData = useCallback(() => {
    if (window.confirm('Are you sure you want to clear ALL data? This cannot be undone!')) {
      setState(defaultState);
      saveToLocalStorage(STORAGE_KEY, defaultState);
      window.alert('All data has been cleared!');
    }
  }, []);

  return {
    state,
    updateState,
    incrementCounter,
    decrementCounter,
    resetCounter,
    setIncrement,
    clearHistory,
    addMultiCounter,
    removeMultiCounter,
    incrementMultiCounter,
    decrementMultiCounter,
    resetMultiCounter,
    updateSettings,
    resetSettings,
    clearAllData
  };
};

