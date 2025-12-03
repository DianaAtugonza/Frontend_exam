import React from 'react';
import { useCounter } from '../hooks/useCounter';

const StatisticsDashboard = () => {
  const { state, clearHistory } = useCounter();

  return (
    <section className="dashboard active">
      <div className="dashboard-header">
        <h2>Statistics</h2>
        <p className="subtitle">View your counter statistics and history</p>
      </div>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Current Value</div>
          <div className="stat-value">{state.counter}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Increments</div>
          <div className="stat-value">{state.totalIncrements}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Decrements</div>
          <div className="stat-value">{state.totalDecrements}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Highest Value</div>
          <div className="stat-value">{state.highestValue}</div>
        </div>
      </div>
      <div className="history-section">
        <h3>Recent Actions</h3>
        <div className="history-list">
          {state.history.length === 0 ? (
            <p className="empty-state">No actions yet. Start counting!</p>
          ) : (
            state.history.map((entry, index) => {
              const sign = entry.value >= 0 ? '+' : '';
              const valueClass = entry.value >= 0 ? 'success' : 'danger';
              return (
                <div key={index} className="history-item">
                  <div>
                    <span className="history-action">{entry.action}</span>
                    <span className={`history-value ${valueClass}`}>
                      {sign}{entry.value}
                    </span>
                  </div>
                  <span className="history-time">{entry.time}</span>
                </div>
              );
            })
          )}
        </div>
        <button className="btn btn-secondary" onClick={clearHistory}>
          Clear History
        </button>
      </div>
    </section>
  );
};

export default StatisticsDashboard;

