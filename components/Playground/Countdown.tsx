import styles from "@/styles/Countdown.module.css";
import { useEffect, useRef, useState } from "react";
import { useGameDetailsContext } from "@/context/game-details-context";
import { useUserContext } from "@/context/user-context";
import { isMobile } from "react-device-detect";

const Countdown: React.FC<{ setStartGame: (val: boolean) => void }> = ({
  setStartGame,
}) => {
  const [countdown, setCountDown] = useState<number>(4);
  const ref = useRef<HTMLHeadingElement | null>(null);
  const { state } = useGameDetailsContext();
  const {
    state: { userName },
  } = useUserContext();
  const { competitorInfo } = state;
  const competitor = competitorInfo?.userName;

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    interval = setInterval(() => {
      setCountDown((prev) => {
        if (prev === 1 && interval) {
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
    if (countdown === 0) {
      setStartGame(true);
    }
  }, [countdown, setStartGame]);

  function getH2Text() {
    if (countdown === 4) {
      return (
        <span className={styles.fighters}>
          <span>{userName}</span>
          <span>vs</span>
          <span>{competitor}</span>
        </span>
      );
    } else if (countdown === 0) {
      return <span>GO!</span>;
    }
    return <span>{countdown.toString()}</span>;
  }

  return (
    <>
      <div className={styles.backdrop}></div>
      <div className={styles.countdown}>
        <h2 className={`h2-primary ${styles.countanime}`} ref={ref}>
          {getH2Text()}
        </h2>
      </div>
      {isMobile && (
        <span className={styles["open-keypad-text"]}>
          To open the keypad, simply click on any word after the game starts.
        </span>
      )}
    </>
  );
};

export default Countdown;
