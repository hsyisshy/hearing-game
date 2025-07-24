import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import GameTitle from './components/GameTitle';
import GameModeSelector from './components/GameModeSelector';
import SoundButton from './components/SoundButton';

const soundDefs = {
  '小鳥': { freq: 800, type: 'sine', duration: 0.3, color: '#ff6b6b', emoji: '🐦' },
  '小貓': { freq: 400, type: 'triangle', duration: 0.5, color: '#4ecdc4', emoji: '🐱' },
  '小狗': { freq: 200, type: 'sawtooth', duration: 0.4, color: '#45b7d1', emoji: '🐶' },
  '鈴鐺': { freq: 1000, type: 'sine', duration: 0.6, color: '#96ceb4', emoji: '🔔' },
  '鼓聲': { freq: 100, type: 'triangle', duration: 0.3, color: '#ffeaa7', emoji: '🥁' },
  '笛子': { freq: 600, type: 'sine', duration: 0.8, color: '#fd79a8', emoji: '🎵' },
};

const encouragingMessages = [
  "太棒了！繼續加油！ 🌟",
  "你做得很好！ 👏",
  "很棒的嘗試！ 💖",
  "繼續努力，你一定可以的！ ✨",
  "做得很棒！ 🎉"
];

function App() {
  const [mode, setMode] = useState('recognition');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameActive, setGameActive] = useState(false);
  const [targetSound, setTargetSound] = useState(null);
  const [sequence, setSequence] = useState([]);
  const [playerSequence, setPlayerSequence] = useState([]);
  const [feedback, setFeedback] = useState('');
  const audioCtxRef = useRef(null);

  useEffect(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
  }, []);

  const playSound = (name) => {
    const sound = soundDefs[name];
    if (!sound) return;
    const ctx = audioCtxRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = sound.type;
    osc.frequency.setValueAtTime(sound.freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + sound.duration);
    osc.start();
    osc.stop(ctx.currentTime + sound.duration);
  };

  const startGame = () => {
    setGameActive(true);
    if (mode === 'recognition') startRecognition();
    if (mode === 'memory') startMemory();
  };

  const startRecognition = () => {
    const keys = Object.keys(soundDefs);
    const pool = keys.slice(0, Math.min(4, 2 + level));
    const target = pool[Math.floor(Math.random() * pool.length)];
    setTargetSound(target);
    setTimeout(() => playSound(target), 1000);
  };

  const startMemory = () => {
    const keys = Object.keys(soundDefs);
    const pool = keys.slice(0, Math.min(6, 3 + level));
    const len = Math.min(2 + Math.floor(level / 2), 5);
    const newSeq = Array.from({ length: len }, () => pool[Math.floor(Math.random() * pool.length)]);
    setSequence(newSeq);
    setPlayerSequence([]);
    let delay = 0;
    newSeq.forEach((sound, idx) => {
      setTimeout(() => playSound(sound), delay);
      delay += 800;
    });
  };

  const handleClick = (name) => {
    playSound(name);
    if (!gameActive) return;
    if (mode === 'recognition') {
      if (name === targetSound) {
        setFeedback('太棒了！答對了！ 🎉');
        setScore(score + 10);
        setTimeout(() => nextLevel(), 1000);
      } else {
        setFeedback('再試試看！ 💪');
        setTimeout(() => playSound(targetSound), 1000);
      }
    } else if (mode === 'memory') {
      const newPlayerSeq = [...playerSequence, name];
      setPlayerSequence(newPlayerSeq);
      const idx = newPlayerSeq.length - 1;
      if (newPlayerSeq[idx] !== sequence[idx]) {
        setFeedback('順序錯誤！再試一次！');
        setPlayerSequence([]);
        setTimeout(() => startMemory(), 1000);
      } else if (newPlayerSeq.length === sequence.length) {
        setFeedback(encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)]);
        setScore(score + 20);
        setTimeout(() => nextLevel(), 1500);
      }
    }
  };

  const nextLevel = () => {
    setLevel(level + 1);
    setFeedback('');
    startGame();
  };

  const reset = () => {
    setScore(0);
    setLevel(1);
    setGameActive(false);
    setSequence([]);
    setPlayerSequence([]);
    setFeedback('');
    setTargetSound(null);
  };

  return (
    <div className="game-container">
      <GameTitle />

      <GameModeSelector
        currentMode={mode}
        onModeChange={(newMode) => {
          setMode(newMode);
          reset();
        }}
      />

      <div className="score-board">
        <div className="score-item">分數: {score}</div>
        <div className="score-item">關卡: {level}</div>
      </div>

      <div className="instruction">
        {mode === 'recognition' ? '聽聲音，點出正確的按鈕' : '記住聲音順序並點擊'}
      </div>

      {gameActive && (
        <div className="sound-buttons">
          {Object.entries(soundDefs).map(([name, info]) => (
            <SoundButton
              key={name}
              name={name}
              emoji={info.emoji}
              color={info.color}
              onClick={() => handleClick(name)}
            />
          ))}
        </div>
      )}

      <div className="control-buttons">
        <button className="control-btn start-btn" onClick={startGame}>開始遊戲</button>
        <button className="control-btn reset-btn" onClick={reset}>重新開始</button>
      </div>

      {feedback && <div className="feedback correct">{feedback}</div>}
    </div>
  );
}

export default App;