import React, {
  type Ref,
  useEffect,
  useRef,
  useState,
  MutableRefObject,
  useLayoutEffect,
  RefObject,
} from "react";
import styles from "@/styles/Playground.module.css";

const DISALLOWED_KEYS = ["Shift", "CapsLock"];
const ParagraphBox: React.FC<{ paragraph: string }> = ({ paragraph }) => {
  const [cursorIndex, setCursorIndex] = useState<number>(-1);
  const [currentKey, setCurrentKey] = useState<string>("");
  const paragraphRef = useRef<HTMLDivElement | null>(null);
  const totalWrongChars = useRef<number>(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    timer.current = setTimeout(() => {
      removeEventListener("keydown", keyPressHandler);
      console.log(totalWrongChars.current);
    }, 20 * 1000);
    return () => {
      removeEventListener("keydown", keyPressHandler);
      if (!!timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, []);
  return (
    <div className={styles["paragraph-box"]} ref={paragraphRef}>
      {paragraph.split("").map((ch, index) => {
        let paragraphHeight: number | undefined,
          paragraphBottom: number | undefined;
        if (!paragraphHeight || !paragraphBottom) {
          const paragraphClientRect =
            paragraphRef.current?.getBoundingClientRect();
          paragraphHeight = paragraphClientRect?.height;
          paragraphBottom = paragraphClientRect?.bottom;
        }
        return (
          <Character
            key={index}
            index={index}
            ch={ch}
            currentKey={currentKey}
            cursorIndex={cursorIndex}
            paragraphRef={paragraphRef as MutableRefObject<HTMLDivElement>}
            paragraphHeight={paragraphHeight ?? 0}
            paragraphBottom={paragraphBottom ?? 0}
            totalWrongChars={totalWrongChars}
          />
        );
      })}
    </div>
  );
};

const Character: React.FC<{
  index: number;
  cursorIndex: number;
  currentKey: string;
  ch: string;
  paragraphRef: MutableRefObject<HTMLDivElement>;
  paragraphHeight: number;
  paragraphBottom: number;
  totalWrongChars: MutableRefObject<number>;
}> = ({
  index,
  cursorIndex,
  currentKey,
  ch,
  paragraphRef,
  paragraphBottom,
  paragraphHeight,
  totalWrongChars,
}) => {
  const charRef = useRef<HTMLSpanElement | null>(null);
  const charClientRect = charRef.current?.getBoundingClientRect();

  function checkIfScroll() {
    if (paragraphBottom && paragraphHeight) {
      const charBottom = charClientRect?.bottom ?? 0;

      if (paragraphBottom && charBottom && paragraphBottom - charBottom <= 20) {
        const scrollTop = paragraphRef.current?.scrollTop;
        paragraphRef.current?.scrollTo({
          top: scrollTop + 100,
          behavior: "smooth",
        });
      }
    }
  }

  if (!!currentKey) {
    if (currentKey === "Backspace") {
      if (cursorIndex !== -1 && cursorIndex + 1 === index) {
        if (charRef.current?.className) {
          if (charRef.current.classList.contains(styles.incorrect)) {
            totalWrongChars.current = totalWrongChars.current - 1;
          }

          charRef.current.className = "";
        }
      }
    } else {
      if (index === cursorIndex) {
        checkIfScroll();
        if (ch === currentKey) {
          if (charRef.current?.classList) {
            charRef.current?.classList?.add(styles.correct);
          }
        } else {
          if (charRef.current?.classList) {
            if (!charRef.current.classList.contains(styles.incorrect)) {
              totalWrongChars.current = totalWrongChars.current + 1;
            }
            charRef.current.classList.add(styles.incorrect);
          }
        }
      }
    }
  }
  return <span ref={charRef}>{ch}</span>;
};
export default ParagraphBox;
