// src/components/SoundButton.jsx
const SoundButton = ({ name, emoji, color, onClick }) => {
  return (
    <button
      className="sound-btn"
      onClick={onClick}
      style={{ background: `linear-gradient(45deg, ${color}, #00000022)` }}
    >
      <span style={{ fontSize: '1.5em' }}>{emoji}</span><br />
      {name}
    </button>
  );
};

export default SoundButton;
