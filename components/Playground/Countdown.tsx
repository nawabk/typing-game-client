import styles from "@/styles/Countdown.module.css";
import { useEffect, useRef, useState } from "react";
import Backdrop from "../common/Backdrop";

const Countdown: React.FC<{ setStartGame: (val: boolean) => void }> = ({
  setStartGame,
}) => {
  const [countdown, setCountDown] = useState<number>(3);
  const ref = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    interval = setInterval(() => {
      setCountDown((prev) => {
        if (prev === 0 && interval) {
          clearInterval(interval);
        }
        return prev - 1;
      });
      ref.current?.classList?.remove(styles.countanime);
      setTimeout(() => {
        ref.current?.classList?.add(styles.countanime);
      });
    }, 1400);

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, []);

  useEffect(() => {
    if (countdown === -1) {
      setStartGame(true);
    }
  }, [countdown, setStartGame]);

  return (
    <>
      <div className={styles.backdrop}></div>
      <div className={styles.countdown}>
        <h2 className={`h2-primary ${styles.countanime}`} ref={ref}>
          {countdown === 0 ? "GO!" : countdown}
        </h2>
      </div>
    </>
  );
};

export default Countdown;
