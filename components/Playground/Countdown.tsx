import styles from "@/styles/Countdown.module.css";
import { useEffect, useRef, useState } from "react";
import Backdrop from "../common/Backdrop";
import { useGameDetailsContext } from "@/context/game-details-context";
import { JsxElement } from "typescript";

const Countdown: React.FC<{ setStartGame: (val: boolean) => void }> = ({
  setStartGame,
}) => {
  const [countdown, setCountDown] = useState<number>(4);
  const ref = useRef<HTMLHeadingElement | null>(null);
  const { state } = useGameDetailsContext();
  const { userName, competitor } = state;

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

  function getH2Text() {
    if (countdown === 4) {
      return (
        <span>
          {userName} vs {competitor}
        </span>
      );
    } else if (countdown === 0) {
      return "GO!";
    }
    return countdown.toString();
  }

  return (
    <>
      <div className={styles.backdrop}></div>
      <div className={styles.countdown}>
        <h2 className={`h2-primary ${styles.countanime}`} ref={ref}>
          {getH2Text()}
        </h2>
      </div>
    </>
  );
};

export default Countdown;
