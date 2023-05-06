import { useGameDetailsContext } from "@/context/game-details-context";
import Word from "./Word";
import styles from "@/styles/Playground.module.css";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import WpmTracker from "./WpmTracker";
import { socket } from "@/utils/socket";

const ParagraphBox: React.FC<{
  caretRef: MutableRefObject<HTMLDivElement | null>;
  startGame: boolean;
  stopGame: boolean;
}> = ({ caretRef, startGame, stopGame }) => {
  const { state, dispatch } = useGameDetailsContext();
  const { paragraph } = state;
  const [activeWordIndex, setActiveWordIndex] = useState<number>(0);
  const lastCorrectlyTypedWordIndex = useRef<number>(-1);
  const paragraphRef = useRef<HTMLDivElement | null>(null);

  const words = paragraph.split(" ");

  useEffect(() => {
    WpmTracker.resetData();
  }, []);

  useEffect(() => {
    function onChallengeResult(message: any) {
      console.log(message);
      dispatch({
        type: "SET_CHALLENGE_RESULT",
        payload: {
          isResultOut: true,
          ...message,
        },
      });
    }
    socket.on("challenge_result", onChallengeResult);

    return () => {
      socket.off("challenge_result", onChallengeResult);
    };
  }, [dispatch]);

  return (
    <div className={styles.words} ref={paragraphRef}>
      {words.map((word, index) => {
        return (
          <Word
            key={index}
            word={word}
            isActive={index === activeWordIndex}
            activeWordIndex={activeWordIndex}
            setActiveWordIndex={setActiveWordIndex}
            lastCorrectlyTypedWordIndex={lastCorrectlyTypedWordIndex}
            caretRef={caretRef}
            paragraphRef={paragraphRef}
            startGame={startGame}
            stopGame={stopGame}
          />
        );
      })}
    </div>
  );
};

export default ParagraphBox;
