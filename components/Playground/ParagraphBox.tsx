import React, { useEffect, useRef, useState } from "react";
import styles from "../../styles/Playground.module.css";

const DISALLOWED_KEYS = ["Shift", "CapsLock"];
const ParagraphBox: React.FC<{ paragraph: string }> = ({ paragraph }) => {
  const [cursorIndex, setCursorIndex] = useState<number>(-1);
  const [currentKey, setCurrentKey] = useState<string>("");

  useEffect(() => {
    function keyPressHandler(e: KeyboardEvent) {
      const { key } = e;
      if (!DISALLOWED_KEYS.includes(key)) {
        if (key === "Backspace") {
          setCursorIndex((prev) => {
            if (prev !== -1) {
              return prev - 1;
            }
            return prev;
          });
          setCurrentKey(key);
        } else {
          setCurrentKey(key);
          setCursorIndex((prev) => prev + 1);
        }
      }
    }
    addEventListener("keydown", keyPressHandler);
    return () => {
      removeEventListener("keydown", keyPressHandler);
    };
  }, []);
  return (
    <div className={styles["paragraph-box"]}>
      {paragraph.split("").map((ch, index) => (
        <Character
          key={index}
          index={index}
          ch={ch}
          currentKey={currentKey}
          cursorIndex={cursorIndex}
        />
      ))}
    </div>
  );
};

const Character: React.FC<{
  index: number;
  cursorIndex: number;
  currentKey: string;
  ch: string;
}> = ({ index, cursorIndex, currentKey, ch }) => {
  const charRef = useRef<HTMLSpanElement | null>(null);

  if (currentKey === "Backspace") {
    if (cursorIndex !== -1 && cursorIndex + 1 === index) {
      if (charRef.current?.className) {
        charRef.current.className = "";
      }
    }
  }
  if (index === cursorIndex) {
    if (ch === currentKey) {
      charRef.current?.classList?.add(styles.green);
    } else {
      charRef.current?.classList?.add(styles.red);
    }
  }
  return <span ref={charRef}>{ch}</span>;
};

export default ParagraphBox;
