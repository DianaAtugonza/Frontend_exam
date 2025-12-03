import React from 'react';

const Navigation = ({ activeDashboard, setActiveDashboard }) => {
  const navItems = [
    { id: 'counter', label: 'Counter' },
    { id: 'stats', label: 'Statistics' },
    { id: 'multi', label: 'Multi-Counter' },
    { id: 'settings', label: 'Settings' }
  ];

  return (
    <nav className="navbar">
      <div className="nav-container">
        <h1 className="nav-logo">📊 Counter App</h1>
        <ul className="nav-menu">
          {navItems.map(item => (
            <li key={item.id}>
              <button
                className={`nav-btn ${activeDashboard === item.id ? 'active' : ''}`}
                onClick={() => setActiveDashboard(item.id)}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;

