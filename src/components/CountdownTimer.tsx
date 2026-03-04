import { useEffect, useRef, useState } from "react";
import { formatTime } from "../utils/format-time";
import styles from "./CountdownTimer.module.css";

interface CountdownTimerProps {
  readonly endTime: number;
  readonly onTimeUp: () => void;
}

export function CountdownTimer({ endTime, onTimeUp }: CountdownTimerProps) {
  const [remaining, setRemaining] = useState(() => endTime - Date.now());
  const firedRef = useRef(false);

  useEffect(() => {
    firedRef.current = false;
    const interval = setInterval(() => {
      const left = endTime - Date.now();
      setRemaining(left);

      if (left <= 0 && !firedRef.current) {
        firedRef.current = true;
        clearInterval(interval);
        onTimeUp();
      }
    }, 200);

    return () => clearInterval(interval);
  }, [endTime, onTimeUp]);

  return <div className={styles.timer}>{formatTime(remaining)}</div>;
}
