import { MutableRefObject, RefObject, useEffect, useRef } from "react";
import styles from "@/styles/Playground.module.css";

const Letter: React.FC<{
  letter: string;
  currentKey: string;
  cursorIndex: number;
  index: number;
  totlaIncorrectTypedLetter: MutableRefObject<number>;
}> = ({
  letter,
  currentKey,
  cursorIndex,
  index,
  totlaIncorrectTypedLetter,
}) => {
  const letterRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (currentKey === "Backspace") {
      if (cursorIndex + 1 === index) {
        if (letterRef.current?.className) {
          if (letterRef.current.classList.contains(styles.incorrect)) {
            totlaIncorrectTypedLetter.current -= 1;
          }
          letterRef.current.className = "";
        }
      }
    } else {
      if (cursorIndex === index) {
        if (currentKey === letter) {
          letterRef.current?.classList?.add(styles.correct);
        } else {
          if (letterRef.current?.classList) {
            if (!letterRef.current.classList.contains(styles.incorrect)) {
              totlaIncorrectTypedLetter.current += 1;
            }
            letterRef.current.classList.add(styles.incorrect);
          }
        }
      }
    }
  }, [currentKey, cursorIndex, index, letter, totlaIncorrectTypedLetter]);

  return <span ref={letterRef}>{letter}</span>;
};

export default Letter;
