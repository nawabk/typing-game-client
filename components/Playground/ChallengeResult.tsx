import { useGameDetailsContext } from "@/context/game-details-context";
import { useUserContext } from "@/context/user-context";
import styles from "@/styles/ChallengeResult.module.css";
import ScoreCard from "./ScoreCard";
import Image from "next/image";
import SadEmoji from "@/assets/sad-icon.svg";
import SmileyEmoji from "@/assets/smile-icon.svg";
import ConfettiExplosion from "react-confetti-explosion";
import { useRouter } from "next/router";

const ChallengeResult: React.FC = () => {
  const { state } = useGameDetailsContext();
  const { state: userState } = useUserContext();
  const { competitorInfo, result } = state;
  const { isRobot } = competitorInfo;
  const { socketId, isPlayerOne: isUserPlayerOne } = userState;
  const { playerOneResult, playerTwoResult } = result;
  let userResult, competitorResult;
  let isWinner: boolean = result.winner === socketId;

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
          <ConfettiExplosion particleCount={250} duration={4000} width={1600} />
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
      <div className={styles.actions}>
        <HomeLink />
        {!isRobot && <RematchLink />}
      </div>
    </div>
  );
};

const HomeLink: React.FC = () => {
  const route = useRouter();
  const homeLinkClickHandler = () => {
    route.push("/");
  };
  return <ActionLink text="🏠 Home" onClick={homeLinkClickHandler} />;
};
const RematchLink: React.FC = () => {
  return <ActionLink text="🤺 Rematch" />;
};
interface Props extends React.DOMAttributes<HTMLParagraphElement> {
  text: string;
}

const ActionLink: React.FC<Props> = ({ text, ...rest }) => {
  return (
    <p className={`p-large ${styles["action-link"]}`} {...rest}>
      {text}
    </p>
  );
};

export default ChallengeResult;
