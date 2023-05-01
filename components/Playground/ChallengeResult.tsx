import { useGameDetailsContext } from "@/context/game-details-context";
import { useUserContext } from "@/context/user-context";
import styles from "@/styles/ChallengeResult.module.css";
import ScoreCard from "./ScoreCard";
import Image from "next/image";
import SadEmoji from "@/assets/sad-icon.svg";
import SmileyEmoji from "@/assets/smile-icon.svg";
import ConfettiExplosion from "react-confetti-explosion";

const ChallengeResult: React.FC = () => {
  const { state } = useGameDetailsContext();
  const { state: userState } = useUserContext();
  const { competitorInfo, result } = state;
  const { socketId: competitorSocketId } = competitorInfo;
  const { socketId, isPlayerOne: isUserPlayerOne } = userState;
  const { playerOneResult, playerTwoResult } = result;
  let userResult, competitorResult;
  let isWinner: boolean = result.winner === socketId;

  console.log({
    playerOneResult,
    playerTwoResult,
    socketId,
    competitorSocketId,
  });

  if (isUserPlayerOne && playerOneResult?.socketId === socketId) {
    userResult = playerOneResult;
    competitorResult = playerTwoResult;
  } else if (!isUserPlayerOne && playerTwoResult?.socketId === socketId) {
    userResult = playerTwoResult;
    competitorResult = playerOneResult;
  } else {
    console.error("Socket id is not matched with the result");
  }

  return (
    <div className={styles["challenge-result"]}>
      {isWinner && (
        <div className={styles.confetti}>
          <ConfettiExplosion particleCount={250} duration={3000} width={1600} />
        </div>
      )}
      <h1 className={styles["result-text"]}>
        {isWinner ? (
          <span className={styles["result-text-won"]}>
            You Won
            <Image src={SmileyEmoji} alt="Sad Emoji" height={50} width={50} />
          </span>
        ) : (
          <span className={styles["result-text-lost"]}>
            You Lost{" "}
            <Image src={SadEmoji} alt="Sad Emoji" height={50} width={50} />
          </span>
        )}
      </h1>
      <div className={styles["score-cards"]}>
        <ScoreCard
          userName={userResult?.userName ?? ""}
          wpm={userResult?.score?.wpm ?? 0}
          netWpm={userResult?.score?.netWpm ?? 0}
          accuracyInPerc={userResult?.score?.accuracyInPerc ?? 0}
        />
        <ScoreCard
          userName={competitorResult?.userName ?? ""}
          wpm={competitorResult?.score?.wpm ?? 0}
          netWpm={competitorResult?.score?.netWpm ?? 0}
          accuracyInPerc={competitorResult?.score?.accuracyInPerc ?? 0}
        />
      </div>
    </div>
  );
};

export default ChallengeResult;
