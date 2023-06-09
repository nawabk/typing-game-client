import {
  Dispatch,
  MutableRefObject,
  RefObject,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { isMobile, isDesktop } from "react-device-detect";
import Letter from "./Letter";
import styles from "@/styles/Playground.module.css";
import WpmTracker from "./WpmTracker";
import { GAME_LENGTH } from "./Constansts";
import { useUserContext } from "@/context/user-context";
import { ChallengeScoreMessage } from "@/utils/type";
import { socket } from "@/utils/socket";
import { useGameDetailsContext } from "@/context/game-details-context";
import MobileInput from "./MobileInput";

const DISALLOWED_KEYS = ["Shift", "CapsLock"];
const Word: React.FC<{
  word: string;
  isActive: boolean;
  activeWordIndex: number;
  setActiveWordIndex: Dispatch<SetStateAction<number>>;
  lastCorrectlyTypedWordIndex: MutableRefObject<number>;
  caretRef: MutableRefObject<HTMLDivElement | null>;
  paragraphRef: MutableRefObject<HTMLDivElement | null>;
  startGame: boolean;
  stopGame: boolean;
  inputRef: RefObject<HTMLInputElement | null>;
}> = ({
  word,
  isActive,
  activeWordIndex,
  setActiveWordIndex,
  lastCorrectlyTypedWordIndex,
  caretRef,
  paragraphRef,
  startGame,
  stopGame,
  inputRef,
}) => {
  const [cursorIndex, setCursorIndex] = useState<number>(-1);
  const [currentKey, setCurrentKey] = useState<string>("");
  const length = word.length;
  const totalIncorrectTypedLetter = useRef<number>(0);
  const cursorIndexRef = useRef<number>(-1);
  const wordRef = useRef<HTMLDivElement | null>(null);
  const lastInputLength = useRef<number>(0);
  const { state } = useGameDetailsContext();
  const { channel } = state;
  const { state: userState } = useUserContext();
  const { socketId } = userState;

  useEffect(() => {
    cursorIndexRef.current = cursorIndex;
  }, [cursorIndex]);

  const keyPressOrInputChangeHandler = useCallback(
    function (key: string) {
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
            if (prev !== length - 1) {
              setCurrentKey(key);
              return prev + 1;
            }
            return prev;
          });
        }
      }
    },
    [setActiveWordIndex, length, lastCorrectlyTypedWordIndex]
  );

  const keyPressHandler = useCallback(
    function (e: KeyboardEvent) {
      e.preventDefault();
      const { key } = e;
      keyPressOrInputChangeHandler(key);
    },
    [keyPressOrInputChangeHandler]
  );

  useEffect(() => {
    if (isDesktop && isActive && startGame) {
      addEventListener("keydown", keyPressHandler);
    } else {
      removeEventListener("keydown", keyPressHandler);
    }
    return () => {
      removeEventListener("keydown", keyPressHandler);
    };
  }, [isActive, startGame, keyPressHandler]);

  const inputChangeHandler = useCallback(
    function (e: Event) {
      const inputValue = (e.target as HTMLInputElement).value;
      let key = "";
      if (inputValue.length > lastInputLength.current) {
        // New character(s) added
        const newCharacter = inputValue.charAt(inputValue.length - 1);
        key = newCharacter;
        // Do something with the new characters
      } else if (inputValue.length < lastInputLength.current) {
        // Character(s) deleted
        key = "Backspace";
      }
      lastInputLength.current = inputValue.length;
      keyPressOrInputChangeHandler(key);
    },
    [keyPressOrInputChangeHandler]
  );

  useEffect(() => {
    const input = inputRef.current;
    if (isMobile && isActive && startGame) {
      input?.addEventListener("input", inputChangeHandler);
    } else {
      input?.removeEventListener("input", inputChangeHandler);
    }
    return () => {
      input?.removeEventListener("input", inputChangeHandler);
    };
  }, [inputChangeHandler, isActive, startGame, inputRef]);

  useEffect(() => {
    if (stopGame && isActive) {
      removeEventListener("keydown", keyPressHandler);
      inputRef?.current?.removeEventListener("input", inputChangeHandler);
      const wpmResult = WpmTracker.getResult(GAME_LENGTH, activeWordIndex);
      const { wpm, netWpm, accuracyInPerc } = wpmResult;
      if (socketId) {
        const scoreMessage: ChallengeScoreMessage = {
          socketId,
          channel,
          wpm,
          netWpm,
          accuracyInPerc,
        };
        socket.emit("challenge_score", scoreMessage);
      }
    }
  }, [
    stopGame,
    keyPressHandler,
    inputChangeHandler,
    inputRef,
    isActive,
    activeWordIndex,
    socketId,
    channel,
  ]);

  return (
    <>
      <div className={styles.word} ref={wordRef}>
        {word.split("").map((letter, index) => (
          <Letter
            key={index}
            letter={letter}
            cursorIndex={cursorIndex}
            currentKey={currentKey}
            index={index}
            totlaIncorrectTypedLetter={totalIncorrectTypedLetter}
            caretRef={caretRef}
            isActive={isActive}
            isLastLetter={index === length - 1}
            paragraphRef={paragraphRef}
            wordRef={wordRef}
          />
        ))}
      </div>
    </>
  );
};

export default Word;
