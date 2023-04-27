import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import Letter from "./Letter";
import styles from "@/styles/Playground.module.css";

const DISALLOWED_KEYS = ["Shift", "CapsLock"];
const Word: React.FC<{
  word: string;
  isActive: boolean;
  setActiveWordIndex: Dispatch<SetStateAction<number>>;
  lastCorrectlyTypedWordIndex: MutableRefObject<number>;
}> = ({ word, isActive, setActiveWordIndex, lastCorrectlyTypedWordIndex }) => {
  const [cursorIndex, setCursorIndex] = useState<number>(-1);
  const [currentKey, setCurrentKey] = useState<string>("");
  const length = word.length;
  const totalIncorrectTypedLetter = useRef<number>(0);
  const cursorIndexRef = useRef<number>(-1);

  useEffect(() => {
    cursorIndexRef.current = cursorIndex;
  }, [cursorIndex]);

  useEffect(() => {
    function keyPressHandler(e: KeyboardEvent) {
      const { key } = e;
      if (!DISALLOWED_KEYS.includes(key)) {
        if (key === " ") {
          // if typed space then check if the typed correctly then store index
          // and move the active word to next word
          setActiveWordIndex((prev) => {
            if (
              cursorIndexRef.current >= length - 1 &&
              totalIncorrectTypedLetter.current === 0
            ) {
              lastCorrectlyTypedWordIndex.current = prev;
            }
            return prev + 1;
          });
        } else if (key === "Backspace") {
          setCursorIndex((prev) => {
            if (prev !== -1) {
              setCurrentKey(key);
              return prev - 1;
            }
            return prev;
          });
          // check if last word is typed correctly if no
          // then move the active word to previous word
          // otherwise don't move the active word
          if (cursorIndexRef.current === -1) {
            setActiveWordIndex((prev) => {
              if (prev - 1 === lastCorrectlyTypedWordIndex.current) {
                return prev;
              }
              return prev - 1;
            });
          }
        } else {
          setCursorIndex((prev) => {
            if (prev !== length) {
              setCurrentKey(key);
              return prev + 1;
            }
            return prev;
          });
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
  }, [isActive, setActiveWordIndex, length, lastCorrectlyTypedWordIndex]);

  return (
    <div className={styles.word}>
      {word.split("").map((letter, index) => (
        <Letter
          key={index}
          letter={letter}
          cursorIndex={cursorIndex}
          currentKey={currentKey}
          index={index}
          totlaIncorrectTypedLetter={totalIncorrectTypedLetter}
        />
      ))}
    </div>
  );
};

export default Word;
