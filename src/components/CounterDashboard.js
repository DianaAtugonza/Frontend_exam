import React, { useState } from 'react';
import { useCounter } from '../hooks/useCounter';
import { playSound, adjustBrightness } from '../utils/helpers';

const CounterDashboard = () => {
  const { state, incrementCounter, decrementCounter, resetCounter, setIncrement } = useCounter();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleIncrement = () => {
    incrementCounter();
    setIsAnimating(true);
    if (state.settings.soundEnabled) {
      playSound();
    }
    setTimeout(() => setIsAnimating(false), 200);
  };

  const handleDecrement = () => {
    decrementCounter();
    setIsAnimating(true);
    if (state.settings.soundEnabled) {
      playSound();
    }
    setTimeout(() => setIsAnimating(false), 200);
  };

  const handleReset = () => {
    resetCounter();
    setIsAnimating(true);
    if (state.settings.soundEnabled) {
      playSound();
    }
    setTimeout(() => setIsAnimating(false), 200);
  };

  const gradientColor = adjustBrightness(state.settings.counterColor, -20);

  return (
    <section className="dashboard active">
      <div className="dashboard-header">
        <h2>Main Counter</h2>
        <p className="subtitle">Use the buttons below to control your counter</p>
      </div>
      <div 
        className="counter-display"
        style={{
          background: `linear-gradient(135deg, ${state.settings.counterColor}, ${gradientColor})`
        }}
      >
        <div 
          className={`counter-value ${isAnimating ? 'updated' : ''}`}
          style={{ color: 'white' }}
        >
          {state.counter}
        </div>
      </div>
      <div className="button-group">
        <button className="btn btn-decrease" onClick={handleDecrement}>
          -
        </button>
        <button className="btn btn-reset" onClick={handleReset}>
          Reset
        </button>
        <button className="btn btn-increase" onClick={handleIncrement}>
          +
        </button>
      </div>
      <div className="increment-options">
        <label>Increment by:</label>
        <input
          type="number"
          value={state.increment}
          min="1"
          onChange={(e) => setIncrement(e.target.value)}
        />
      </div>
    </section>
  );
};

export default CounterDashboard;

