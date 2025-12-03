import React, { useState } from 'react';
import { useCounter } from '../hooks/useCounter';

const MultiCounterDashboard = () => {
  const { state, addMultiCounter, removeMultiCounter, incrementMultiCounter, decrementMultiCounter, resetMultiCounter } = useCounter();
  const [counterName, setCounterName] = useState('');

  const handleAddCounter = () => {
    const name = counterName.trim();
    if (!name) {
      alert('Please enter a counter name');
      return;
    }
    addMultiCounter(name);
    setCounterName('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddCounter();
    }
  };

  const counters = Object.keys(state.multiCounters);

  return (
    <section className="dashboard active">
      <div className="dashboard-header">
        <h2>Multi-Counter</h2>
        <p className="subtitle">Create and manage multiple counters</p>
      </div>
      <div className="multi-counter-controls">
        <input
          type="text"
          value={counterName}
          onChange={(e) => setCounterName(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter counter name"
        />
        <button className="btn btn-primary" onClick={handleAddCounter}>
          Add Counter
        </button>
      </div>
      <div className="multi-counters-container">
        {counters.length === 0 ? (
          <p className="empty-state">No counters yet. Create one to get started!</p>
        ) : (
          counters.map(name => (
            <div key={name} className="multi-counter-item">
              <div className="multi-counter-name">{name}</div>
              <div className="multi-counter-value">{state.multiCounters[name]}</div>
              <div className="multi-counter-buttons">
                <button
                  className="btn btn-decrease"
                  onClick={() => decrementMultiCounter(name)}
                >
                  -
                </button>
                <button
                  className="btn btn-reset"
                  onClick={() => resetMultiCounter(name)}
                >
                  Reset
                </button>
                <button
                  className="btn btn-increase"
                  onClick={() => incrementMultiCounter(name)}
                >
                  +
                </button>
              </div>
              <button
                className="delete-counter-btn"
                onClick={() => removeMultiCounter(name)}
              >
                Delete Counter
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default MultiCounterDashboard;

