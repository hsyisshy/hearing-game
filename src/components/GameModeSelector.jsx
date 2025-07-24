// src/components/GameModeSelector.jsx
const GameModeSelector = ({ currentMode, onModeChange }) => {
  const modes = [
    { key: 'recognition', label: '🔊 聲音分辨', className: 'sound-recognition' },
    { key: 'memory', label: '🧠 聲音記憶', className: 'sound-memory' },
    { key: 'sequence', label: '📝 順序排序', className: 'sound-sequence' },
  ];

  return (
    <div className="game-modes">
      {modes.map(({ key, label, className }) => (
        <button
          key={key}
          className={`mode-btn ${className} ${currentMode === key ? 'active' : ''}`}
          onClick={() => onModeChange(key)}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default GameModeSelector;
