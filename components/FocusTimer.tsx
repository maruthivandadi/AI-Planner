
import React, { useState, useEffect, useRef } from 'react';

interface FocusTimerProps {
  initialMinutes: number;
  onComplete: () => void;
  taskTitle: string;
}

const FocusTimer: React.FC<FocusTimerProps> = ({ initialMinutes, onComplete, taskTitle }) => {
  const [secondsLeft, setSecondsLeft] = useState(initialMinutes * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  
  const totalSeconds = (mode === 'focus' ? initialMinutes : 5) * 60;
  const progress = ((totalSeconds - secondsLeft) / totalSeconds) * 100;
  
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isActive && secondsLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setSecondsLeft(s => s - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      handleComplete();
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isActive, secondsLeft]);

  const handleComplete = () => {
    setIsActive(false);
    if (mode === 'focus') {
      onComplete();
      setMode('break');
      setSecondsLeft(5 * 60);
    } else {
      setMode('focus');
      setSecondsLeft(initialMinutes * 60);
    }
  };

  const toggle = () => setIsActive(!isActive);
  const reset = () => {
    setIsActive(false);
    setSecondsLeft(initialMinutes * 60);
    setMode('focus');
  };

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center p-8 bg-white rounded-3xl shadow-xl border border-slate-100">
      <div className="relative w-64 h-64 mb-8">
        <svg className="w-full h-full">
          <circle cx="50%" cy="50%" r="45%" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100" />
          <circle 
            cx="50%" cy="50%" r="45%" 
            stroke="currentColor" strokeWidth="8" fill="transparent" 
            className={`timer-ring ${mode === 'focus' ? 'text-accent' : 'text-emerald'}`}
            strokeDasharray="283%"
            strokeDashoffset={`${283 - (283 * progress) / 100}%`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold font-sans text-secondary">{formatTime(secondsLeft)}</span>
          <span className="text-xs uppercase tracking-widest font-bold text-slate-400 mt-1">
            {mode === 'focus' ? 'Focus Session' : 'Short Break'}
          </span>
        </div>
      </div>

      <div className="text-center mb-8">
        <h3 className="text-lg font-semibold text-secondary truncate max-w-[200px]">{taskTitle || 'Ready to Focus?'}</h3>
        <p className="text-sm text-slate-400">Pomodoro Protocol Active</p>
      </div>

      <div className="flex space-x-4">
        <button 
          onClick={toggle}
          className={`px-8 py-3 rounded-2xl font-bold transition-all transform active:scale-95 ${
            isActive ? 'bg-slate-100 text-secondary' : 'bg-secondary text-white shadow-lg shadow-indigo-200'
          }`}
        >
          {isActive ? 'Pause' : 'Start Focus'}
        </button>
        <button onClick={reset} className="p-3 text-slate-400 hover:text-secondary transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default FocusTimer;
