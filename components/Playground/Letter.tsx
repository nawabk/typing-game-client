import { MutableRefObject, useEffect, useRef } from "react";
import styles from "@/styles/Playground.module.css";
import WpmTracker from "./WpmTracker";

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
  wordRef: MutableRefObject<HTMLDivElement | null>;
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
  wordRef,
}) => {
  const letterRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    function checkForScroll(): number {
      const height: number = paragraphRef.current?.offsetHeight ?? 0;
      const top: number = paragraphRef.current?.offsetTop ?? 0;
      const scrollTop = paragraphRef.current?.scrollTop ?? 0;
      const paragraphBottomPoint: number = height + top + scrollTop;
      const wordHeight: number = wordRef.current?.offsetHeight ?? 0;
      const wordTop: number = wordRef.current?.offsetTop ?? 0;
      const wordBottomPoint: number = wordHeight + wordTop;
      let totalScrolled: number = 0;
      if (wordHeight && wordBottomPoint) {
        if (paragraphBottomPoint - wordHeight === wordBottomPoint) {
          const scrollTop = paragraphRef.current?.scrollTop ?? 0;
          paragraphRef.current?.scrollTo({
            top: scrollTop + wordHeight,
            behavior: "smooth",
          });
          totalScrolled = wordHeight;
        }
      }
      return totalScrolled;
    }

    if (isActive) {
      const isTypingAnyLetter = cursorIndex + 1 === index;
      const isTypingLastLetter = isLastLetter && index === cursorIndex;
      if (isTypingAnyLetter || isTypingLastLetter) {
        const { left, top, right } =
          letterRef.current?.getBoundingClientRect() || {};
        const totalScrolled = checkForScroll();
        if (caretRef.current?.style && left && top && right) {
          caretRef.current.style.left =
            (!isTypingLastLetter ? (left - 3).toString() : right.toString()) +
            "px";
          caretRef.current.style.top = (top - totalScrolled).toString() + "px";
        }
      }
    }
  }, [
    index,
    cursorIndex,
    caretRef,
    isActive,
    isLastLetter,
    paragraphRef,
    wordRef,
  ]);

  useEffect(() => {
    if (currentKey === "Backspace") {
      if (cursorIndex + 1 === index) {
        if (letterRef.current?.className) {
          const isIncorrectClassPresent = letterRef.current.classList.contains(
            styles.incorrect
          );
          const isCorrectClassPresent = letterRef.current.classList.contains(
            styles.correct
          );
          if (isIncorrectClassPresent || isCorrectClassPresent) {
            WpmTracker.totalLetterTyped -= 1;
            if (isIncorrectClassPresent) {
              totlaIncorrectTypedLetter.current -= 1;
              WpmTracker.totalIncorrectLetterTyped -= 1;
            }
          }
          letterRef.current.className = "";
        }
      }
    } else {
      if (cursorIndex === index) {
        // check if no correct or incorrect class added, then increment totalLetterTyped counter
        const isIncorrectClassPresent = letterRef.current?.classList?.contains(
          styles.incorrect
        );
        const isCorrectClassPresent = letterRef.current?.classList?.contains(
          styles.correct
        );
        if (!isIncorrectClassPresent && !isCorrectClassPresent) {
          WpmTracker.totalLetterTyped += 1;
        }
        if (currentKey === letter) {
          letterRef.current?.classList?.add(styles.correct);
        } else {
          if (letterRef.current?.classList) {
            if (!letterRef.current.classList.contains(styles.incorrect)) {
              totlaIncorrectTypedLetter.current += 1;
              WpmTracker.totalIncorrectLetterTyped += 1;
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
