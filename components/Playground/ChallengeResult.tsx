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
import Loader from "../common/Loader";
import { isMobile } from "react-device-detect";

const ChallengeResult: React.FC = () => {
  const { state } = useGameDetailsContext();
  const { state: userState } = useUserContext();
  const { competitorInfo, result } = state;
  const { isRobot } = competitorInfo;
  const { socketId, isPlayerOne: isUserPlayerOne } = userState;
  const { playerOneResult, playerTwoResult } = result;
  let userResult, competitorResult;
  let isWinner: boolean = result.winner === socketId;
  const draw: boolean = result.draw ?? false;

  if (isUserPlayerOne && playerOneResult?.socketId === socketId) {
    userResult = playerOneResult;
    competitorResult = playerTwoResult;
  } else if (!isUserPlayerOne && playerTwoResult?.socketId === socketId) {
    userResult = playerTwoResult;
    competitorResult = playerOneResult;
  } else {
    console.error("Socket id is not matched with the result");
  }

  const showConfetti = isWinner || draw;

  return (
    <div className={styles["challenge-result"]}>
      {showConfetti && (
        <div className={styles.confetti}>
          <ConfettiExplosion particleCount={250} duration={6000} width={1600} />
        </div>
      )}
      <h1 className={styles["result-text"]}>
        {isWinner || draw ? (
          <div className={styles["result-text-won"]}>
            {draw ? "Draw" : "You Won"}
            <div className={styles["result-img"]}>
              <Image src={SmileyEmoji} alt="Smiley Emoji" fill />
            </div>
          </div>
        ) : (
          <div className={styles["result-text-lost"]}>
            You Lost{" "}
            <div className={styles["result-img"]}>
              <Image src={SadEmoji} alt="Sad Emoji" fill />
            </div>
          </div>
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
      <div className={`${styles.actions}${isRobot ? " " + styles.center : ""}`}>
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
  const { channel, competitorInfo, rematchError } = state;
  const { isAskingForRematch: isUserAskingForRematch } = userState;
  const {
    isAskingForRematch: isCompetitorAskingForRematch,
    userName: competitorUserName,
  } = competitorInfo;

  const rematchClickHandler = () => {
    if (isCompetitorAskingForRematch || !isUserAskingForRematch) {
      if (!isUserAskingForRematch) {
        userDispatch({
          type: "ASK_FOR_REMATCH",
        });
      }
      const message: RematchRequestMessage = {
        channel,
      };
      socket.emit("rematch_request", message);
    }
  };

  let textJSX;

  if (isUserAskingForRematch) {
    textJSX = (
      <Loader
        text="Waiting"
        wrapperClass={styles["waiting-loader-wrapper"]}
        loaderClass={styles["waiting-loader"]}
      />
    );
  } else if (isCompetitorAskingForRematch) {
    textJSX = (
      <div className={styles["rematch-request"]}>
        🤺 Rematch
        <span className={styles["rematch-request-competitor"]}>
          <span>(</span>
          {competitorUserName} is requesting<span>)</span>
        </span>
      </div>
    );
  } else {
    textJSX = "🤺 Rematch";
  }

  if (rematchError) {
    return (
      <p className={`p-large ${styles["rematch-error"]}`}>{rematchError}</p>
    );
  } else {
    return (
      <ActionLink
        text={textJSX}
        onClick={rematchClickHandler}
        highlight={isCompetitorAskingForRematch}
      />
    );
  }
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
