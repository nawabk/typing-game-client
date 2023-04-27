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
  paragraphRef: MutableRefObject<HTMLDivElement | null>;
}> = ({
  letter,
  currentKey,
  cursorIndex,
  index,
  totlaIncorrectTypedLetter,
  isActive,
  caretRef,
  isLastLetter,
  paragraphRef,
}) => {
  const letterRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    function checkForScroll(
      letterHeight: number,
      letterBottomPoint: number
    ): number {
      const height: number = paragraphRef.current?.offsetHeight ?? 0;
      const top: number = paragraphRef.current?.offsetTop ?? 0;
      const paragraphBottomPoint: number = height + top;
      let totalScroll = 0;
      if (letterHeight && letterBottomPoint) {
        const differenceBetweenTwoLine = 2 * letterHeight;
        console.log({
          differenceBetweenTwoLine,
          paragraphBottomPoint,
          letterBottomPoint,
        });
        if (
          paragraphBottomPoint - differenceBetweenTwoLine ===
          letterBottomPoint
        ) {
          const scrollTop = paragraphRef.current?.scrollTop ?? 0;
          paragraphRef.current?.scrollTo({
            top: scrollTop + differenceBetweenTwoLine,
            behavior: "smooth",
          });
          totalScroll = differenceBetweenTwoLine;
        }
      }
      return totalScroll;
    }

    if (isActive) {
      const isTypingAnyLetter = cursorIndex + 1 === index;
      const isTypingLastLetter = isLastLetter && index === cursorIndex;
      if (isTypingAnyLetter || isTypingLastLetter) {
        const { left, top, right, bottom, height } =
          letterRef.current?.getBoundingClientRect() || {};
        const paragraphScroll = checkForScroll(height ?? 0, bottom ?? 0);
        if (caretRef.current?.style && left && top && right) {
          caretRef.current.style.left =
            (!isTypingLastLetter ? (left - 3).toString() : right.toString()) +
            "px";
          caretRef.current.style.top =
            (top - paragraphScroll).toString() + "px";
        }
      }
    }
  }, [index, cursorIndex, caretRef, isActive, isLastLetter, paragraphRef]);

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
