import { useGameDetailsContext } from "@/context/game-details-context";
import Word from "./Word";
import styles from "@/styles/Playground.module.css";
import { MutableRefObject, useRef, useState } from "react";

const ParagraphBox: React.FC<{
  caretRef: MutableRefObject<HTMLDivElement | null>;
}> = ({ caretRef }) => {
  const { state } = useGameDetailsContext();
  const { paragraph } = state;
  const [activeWordIndex, setActiveWordIndex] = useState<number>(0);
  const lastCorrectlyTypedWordIndex = useRef<number>(-1);
  const paragraphRef = useRef<HTMLDivElement | null>(null);

  const words = paragraph.split(" ");
  return (
    <>
      <div className={styles.words} ref={paragraphRef}>
        {words.map((word, index) => {
          return (
            <Word
              key={index}
              word={word}
              isActive={index === activeWordIndex}
              setActiveWordIndex={setActiveWordIndex}
              lastCorrectlyTypedWordIndex={lastCorrectlyTypedWordIndex}
              caretRef={caretRef}
              paragraphRef={paragraphRef}
            />
          );
        })}
      </div>
    </>
  );
};

export default ParagraphBox;
