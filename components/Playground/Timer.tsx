import { Dispatch, useEffect, useRef, useState } from "react";
import styles from "@/styles/Timer.module.css";
import { GAME_LENGTH } from "./Constansts";

const Timer: React.FC<{
  startGame: boolean;
  setStopGame: Dispatch<boolean>;
}> = ({ startGame, setStopGame }) => {
  const interval = useRef<ReturnType<typeof setInterval> | null>(null);
  const [count, setCount] = useState<number>(GAME_LENGTH);

  useEffect(() => {
    if (startGame) {
      interval.current = setInterval(() => {
        setCount((prev) => {
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
  }, [startGame]);

  useEffect(() => {
    if (count === 0 && !!interval.current) {
      clearInterval(interval.current);
      setStopGame(true);
    }
  }, [count, setStopGame]);

  return (
    <div className={styles.timer}>
      <p className={styles.count}>{count}</p>
    </div>
  );
};

export default Timer;
