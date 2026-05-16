import { useRef } from "react";

export function useLongPress(callback: () => void, delay = 500) {
  const timer = useRef<NodeJS.Timeout | null>(null);

  function start() {
    timer.current = setTimeout(callback, delay);
  }
  function cancel() {
    if (timer.current) clearTimeout(timer.current);
  }
  return {
    onTouchStart: start,
    onTouchEnd: cancel,
    onTouchMove: cancel,
  };
}
