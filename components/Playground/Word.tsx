import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Letter from "./Letter";
import styles from "@/styles/Playground.module.css";

const DISALLOWED_KEYS = ["Shift", "CapsLock"];
const Word: React.FC<{
  word: string;
  isActive: boolean;
  setActiveWord: Dispatch<SetStateAction<number>>;
}> = ({ word, isActive, setActiveWord }) => {
  const [cursorIndex, setCursorIndex] = useState<number>(-1);
  const [currentKey, setCurrentKey] = useState<string>("");

  useEffect(() => {
    function keyPressHandler(e: KeyboardEvent) {
      const { key } = e;
      if (!DISALLOWED_KEYS.includes(key)) {
        if (key === " ") {
          setActiveWord((prev) => prev + 1);
        } else {
          setCurrentKey(key);
          setCursorIndex((prev) => prev + 1);
        }
      }
    }
    if (isActive) {
      addEventListener("keydown", keyPressHandler);
    } else {
      removeEventListener("keydown", keyPressHandler);
    }
    return () => {
      removeEventListener("keydown", keyPressHandler);
    };
  }, [isActive, setActiveWord]);

  return (
    <div className={styles.word}>
      {word.split("").map((letter, index) => (
        <Letter
          key={index}
          letter={letter}
          cursorIndex={cursorIndex}
          currentKey={currentKey}
          index={index}
        />
      ))}
    </div>
  );
};

export default Word;
