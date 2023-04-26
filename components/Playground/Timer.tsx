import { Dispatch, useEffect, useRef, useState } from "react";
import styles from "@/styles/Timer.module.css";

const Timer: React.FC<{
  startGame: boolean;
  setStopGame: Dispatch<boolean>;
}> = ({ startGame, setStopGame }) => {
  const interval = useRef<ReturnType<typeof setInterval> | null>(null);
  const [count, setCount] = useState<number>(60);
  useEffect(() => {
    if (startGame) {
      interval.current = setInterval(() => {
        setCount((prev) => {
          if (prev === 0 && !!interval.current) {
            clearInterval(interval.current);
            setStopGame(true);
            return prev;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (startGame) {
        if (!!interval.current) {
          clearInterval(interval.current);
        }
      }
    };
  }, [startGame, setStopGame]);

  return (
    <div className={styles.timer}>
      <p className={styles.count}>{count}</p>
    </div>
  );
};

export default Timer;
