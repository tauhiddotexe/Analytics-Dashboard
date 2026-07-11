import { useEffect, useRef, useState } from 'react';

export function useAnimatedCounter(end: number, duration = 1200, enabled = true) {
  const [value, setValue] = useState(0);
  const frameRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!enabled) {
      setValue(end);
      return;
    }
    startTimeRef.current = 0;
    frameRef.current = requestAnimationFrame(function tick(now) {
      if (!startTimeRef.current) startTimeRef.current = now;
      const elapsed = now - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - (1 - progress) * (1 - progress);
      setValue(Math.round(eased * end));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      }
    });
    return () => cancelAnimationFrame(frameRef.current);
  }, [end, duration, enabled]);

  return value;
}
