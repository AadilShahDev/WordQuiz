
import React, { useState, useEffect, useCallback } from 'react';

const useTimer = (duration: number, onTimeout: () => void) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  const stableOnTimeout = useCallback(onTimeout, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      stableOnTimeout();
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft, stableOnTimeout]);

  return timeLeft;
};

interface TimerProps {
  duration: number; // in seconds
  onTimeout: () => void;
  resetKey: any;
}

export const Timer: React.FC<TimerProps> = ({ duration, onTimeout, resetKey }) => {
  const [internalDuration, setInternalDuration] = useState(duration);

  useEffect(() => {
    setInternalDuration(duration);
  }, [resetKey, duration]);

  const timeLeft = useTimer(internalDuration, onTimeout);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  
  const timeColor = timeLeft < 30 ? 'text-red-500' : timeLeft < 60 ? 'text-yellow-500' : 'text-slate-700';

  return (
    <div className={`text-4xl font-bold font-mono transition-colors duration-300 ${timeColor}`}>
      {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
    </div>
  );
};
