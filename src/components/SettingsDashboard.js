import React, { useEffect, useRef } from 'react';
import { useCounter } from '../hooks/useCounter';
import { adjustBrightness } from '../utils/helpers';

const SettingsDashboard = ({ updateSettings }) => {
  const { state, resetSettings, clearAllData } = useCounter();
  const counterDisplayRef = useRef(null);

  useEffect(() => {
    // Update counter display gradient when color changes
    if (counterDisplayRef.current) {
      const gradientColor = adjustBrightness(state.settings.counterColor, -20);
      counterDisplayRef.current.style.background = 
        `linear-gradient(135deg, ${state.settings.counterColor}, ${gradientColor})`;
    }
  }, [state.settings.counterColor]);

  const handleThemeChange = (e) => {
    updateSettings({ theme: e.target.value });
  };

  const handleColorChange = (e) => {
    updateSettings({ counterColor: e.target.value });
  };

  const handleSoundToggle = (e) => {
    updateSettings({ soundEnabled: e.target.checked });
  };

  const handleAutoSaveToggle = (e) => {
    updateSettings({ autoSave: e.target.checked });
  };

  return (
    <section className="dashboard active">
      <div className="dashboard-header">
        <h2>Settings</h2>
        <p className="subtitle">Customize your counter app</p>
      </div>
      <div className="settings-grid">
        <div className="setting-item">
          <label htmlFor="theme-select">Theme</label>
          <select
            id="theme-select"
            className="setting-input"
            value={state.settings.theme}
            onChange={handleThemeChange}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="blue">Blue</option>
            <option value="green">Green</option>
          </select>
        </div>
        <div className="setting-item">
          <label htmlFor="counter-color">Counter Display Color</label>
          <input
            type="color"
            id="counter-color"
            className="setting-input"
            value={state.settings.counterColor}
            onChange={handleColorChange}
          />
          <div
            ref={counterDisplayRef}
            className="counter-display"
            style={{ marginTop: '1rem', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <span style={{ color: 'white', fontSize: '1.5rem' }}>Preview</span>
          </div>
        </div>
        <div className="setting-item">
          <label htmlFor="sound-toggle">
            <input
              type="checkbox"
              id="sound-toggle"
              className="setting-checkbox"
              checked={state.settings.soundEnabled}
              onChange={handleSoundToggle}
            />
            Enable Sound Effects
          </label>
        </div>
        <div className="setting-item">
          <label htmlFor="auto-save-toggle">
            <input
              type="checkbox"
              id="auto-save-toggle"
              className="setting-checkbox"
              checked={state.settings.autoSave}
              onChange={handleAutoSaveToggle}
            />
            Auto-save to Local Storage
          </label>
        </div>
      </div>
      <div className="settings-actions">
        <button className="btn btn-secondary" onClick={resetSettings}>
          Reset to Defaults
        </button>
        <button className="btn btn-danger" onClick={clearAllData}>
          Clear All Data
        </button>
      </div>
    </section>
  );
};

export default SettingsDashboard;

