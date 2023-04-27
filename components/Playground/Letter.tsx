import { MutableRefObject, RefObject, useEffect, useRef } from "react";
import styles from "@/styles/Playground.module.css";

const Letter: React.FC<{
  letter: string;
  currentKey: string;
  cursorIndex: number;
  index: number;
  totlaIncorrectTypedLetter: MutableRefObject<number>;
  isActive: boolean;
  caretRef: MutableRefObject<HTMLDivElement | null>;
  isLastLetter: boolean;
}> = ({
  letter,
  currentKey,
  cursorIndex,
  index,
  totlaIncorrectTypedLetter,
  isActive,
  caretRef,
  isLastLetter,
}) => {
  const letterRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (isActive) {
      const isTypingAnyLetter = cursorIndex + 1 === index;
      const isTypingLastLetter = isLastLetter && index === cursorIndex;
      if (isTypingAnyLetter || isTypingLastLetter) {
        const { left, top, right } =
          letterRef.current?.getBoundingClientRect() || {};
        if (caretRef.current?.style && left && top && right) {
          caretRef.current.style.left =
            (!isTypingLastLetter ? (left - 3).toString() : right.toString()) +
            "px";
          caretRef.current.style.top = top.toString() + "px";
        }
      }
    }
  }, [index, cursorIndex, caretRef, isActive, isLastLetter]);

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
