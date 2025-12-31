
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
    <div className="flex flex-col items-center p-12 bg-white rounded-sm border border-black/[0.04] shadow-lg relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-black/[0.02]">
        <div className="h-full bg-accent transition-all duration-700 shadow-[0_0_10px_rgba(0,86,210,0.3)]" style={{ width: `${progress}%` }}></div>
      </div>

      <div className="relative w-64 h-64 mb-12">
        <svg className="w-full h-full relative z-10">
          <circle cx="50%" cy="50%" r="48%" stroke="currentColor" strokeWidth="0.5" fill="transparent" className="text-black/[0.05]" />
          <circle 
            cx="50%" cy="50%" r="48%" 
            stroke="currentColor" strokeWidth="2.5" fill="transparent" 
            className={`timer-ring ${mode === 'focus' ? 'text-accent' : 'text-emerald-500'}`}
            strokeDasharray="301%"
            strokeDashoffset={`${301 - (301 * progress) / 100}%`}
            strokeLinecap="butt"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
          <span className="text-7xl font-light font-sans text-secondary tracking-[-0.05em] leading-none mb-1">{formatTime(secondsLeft)}</span>
          <div className="flex items-center space-x-2">
             <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'animate-pulse' : ''} ${mode === 'focus' ? 'bg-accent' : 'bg-emerald-500'}`}></div>
             <span className="text-[7px] uppercase tracking-[0.5em] font-black text-slate/50">
                {mode === 'focus' ? 'In Session' : 'Recalibrate'}
             </span>
          </div>
        </div>
      </div>

      <div className="text-center mb-12 px-4 relative z-10">
        <h3 className="text-lg font-serif text-secondary italic mb-2 opacity-90 line-clamp-1">{taskTitle}</h3>
        <p className="text-[8px] font-black text-slate/40 tracking-[0.4em] uppercase">Cognitive Deep-Flow</p>
      </div>

      <div className="flex items-center space-x-8 relative z-10">
        <button 
          onClick={toggle}
          className={`px-14 py-4 rounded-sm font-black text-[8px] uppercase tracking-[0.4em] transition-all duration-700 transform shadow-lg ${
            isActive 
            ? 'bg-black text-white' 
            : 'bg-accent text-white hover:bg-black shadow-accent/20'
          }`}
        >
          {isActive ? 'Suspend' : 'Initiate'}
        </button>
        <button onClick={reset} className="p-4 border border-black/10 text-slate/30 hover:text-black transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default FocusTimer;
