import { useGameDetailsContext } from "@/context/game-details-context";
import { useUserContext } from "@/context/user-context";
import styles from "@/styles/ChallengeResult.module.css";
import ScoreCard from "./ScoreCard";
import Image from "next/image";
import SadEmoji from "@/assets/sad-icon.svg";
import SmileyEmoji from "@/assets/smile-icon.svg";
import ConfettiExplosion from "react-confetti-explosion";
import { useRouter } from "next/router";
import { socket } from "@/utils/socket";
import { RematchRequestMessage } from "@/utils/type";

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
  const { state } = useGameDetailsContext();
  const { state: userState, dispatch: userDispatch } = useUserContext();
  const { channel, competitorInfo } = state;
  const { isAskingForRematch: isUserAskingForRematch } = userState;
  const {
    isAskingForRematch: isCompetitorAskingForRematch,
    userName: competitorUserName,
  } = competitorInfo;

  const rematchClickHandler = () => {
    if (isCompetitorAskingForRematch && !isUserAskingForRematch) {
      userDispatch({
        type: "ASK_FOR_REMATCH",
      });
      const message: RematchRequestMessage = {
        channel,
      };
      socket.emit("rematch_request", message);
    }
  };

  const textJSX = isCompetitorAskingForRematch ? (
    <div className={styles["rematch-request"]}>
      🤺 Rematch
      <span className={styles["rematch-request-competitor"]}>
        ({competitorUserName} is requesting)
      </span>
    </div>
  ) : (
    "🤺 Rematch"
  );

  return (
    <ActionLink
      text={textJSX}
      onClick={rematchClickHandler}
      highlight={isCompetitorAskingForRematch}
    />
  );
};

interface Props extends React.DOMAttributes<HTMLParagraphElement> {
  text: string | JSX.Element;
  highlight?: boolean;
}

const ActionLink: React.FC<Props> = ({ text, highlight = false, ...rest }) => {
  return (
    <p
      className={`p-large ${styles["action-link"]} ${
        highlight ? styles.highlight : ""
      }`}
      {...rest}
    >
      {text}
    </p>
  );
};

export default ChallengeResult;
