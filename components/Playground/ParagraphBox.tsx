import React, {
  type Ref,
  useEffect,
  useRef,
  useState,
  MutableRefObject,
  useLayoutEffect,
} from "react";
import styles from "@/styles/Playground.module.css";

const DISALLOWED_KEYS = ["Shift", "CapsLock"];
const ParagraphBox: React.FC<{ paragraph: string }> = ({ paragraph }) => {
  const [cursorIndex, setCursorIndex] = useState<number>(-1);
  const [currentKey, setCurrentKey] = useState<string>("");
  const paragraphRef = useRef<HTMLDivElement | null>(null);

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
}> = ({
  index,
  cursorIndex,
  currentKey,
  ch,
  paragraphRef,
  paragraphBottom,
  paragraphHeight,
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

  if (currentKey === "Backspace") {
    if (cursorIndex !== -1 && cursorIndex + 1 === index) {
      if (charRef.current?.className) {
        charRef.current.className = "";
      }
    }
  } else {
    if (index === cursorIndex) {
      checkIfScroll();
      if (ch === currentKey) {
        charRef.current?.classList?.add(styles.green);
      } else {
        charRef.current?.classList?.add(styles.red);
      }
    }
  }
  return <span ref={charRef}>{ch}</span>;
};

export default ParagraphBox;
