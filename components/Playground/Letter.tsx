import { useEffect, useRef } from "react";
import styles from "@/styles/Playground.module.css";

const Letter: React.FC<{
  letter: string;
  currentKey: string;
  cursorIndex: number;
  index: number;
}> = ({ letter, currentKey, cursorIndex, index }) => {
  const letterRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (cursorIndex === index) {
      if (currentKey === letter) {
        letterRef.current?.classList?.add(styles.correct);
      } else {
        letterRef.current?.classList?.add(styles.incorrect);
      }
    }
  }, [currentKey, cursorIndex, index, letter]);

  return <span ref={letterRef}>{letter}</span>;
};

export default Letter;
