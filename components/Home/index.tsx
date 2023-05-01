import React, { useEffect, useRef, useState } from "react";
import styles from "../../styles/Home.module.css";

import { useGameDetailsContext } from "@/context/game-details-context";
import Loader from "../common/Loader";
import { useRouter } from "next/router";
import { socket } from "@/utils/socket";
import { useUserContext } from "@/context/user-context";
import { ChallengeDetailsMessage, PlayerInfo } from "@/utils/type";

const Home: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { dispatch } = useGameDetailsContext();
  const { dispatch: userDispatch } = useUserContext();
  const [error, setError] = useState<boolean>(false);
  const [findingCompetitor, setFindingCompetitor] = useState<boolean>(false);
  const router = useRouter();

  const { state: userState } = useUserContext();
  const { socketId } = userState;

  const formSubmitHandler = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setError(false);
    const userName = inputRef?.current?.value;
    if (!userName) {
      setError(true);
    } else {
      userDispatch({
        type: "SET_USERNAME",
        payload: {
          userName,
        },
      });
      socket.emit("start_play", userName);
      setFindingCompetitor(true);
    }
  };

  useEffect(() => {
    function navigateToPlayground(channel: string) {
      router.push(`/play/${channel}`);
    }

    function onChallengeDetails(message: ChallengeDetailsMessage) {
      try {
        const { channel, paragraph, playerOneInfo, playerTwoInfo } = message;
        let competitorInfo: PlayerInfo;
        let isUserPlayerOne: boolean = true;
        if (playerTwoInfo.isRobot) {
          competitorInfo = playerTwoInfo;
        } else {
          const { socketId: playerOneSocketId } = playerOneInfo;
          const { socketId: playerTwoSocketId } = playerTwoInfo;
          if (socketId === playerOneSocketId) {
            competitorInfo = playerTwoInfo;
          } else if (socketId === playerTwoSocketId) {
            competitorInfo = playerOneInfo;
            isUserPlayerOne = false;
          } else {
            throw new Error("Could not find competitor");
          }
        }
        console.log({ isUserPlayerOne });
        userDispatch({
          type: "SET_IS_PLAYER_ONE",
          payload: {
            isPlayerOne: isUserPlayerOne,
          },
        });
        dispatch({
          type: "SET_GAME_DETAILS",
          payload: {
            channel,
            paragraph,
          },
        });
        dispatch({
          type: "SET_COMPETITOR",
          payload: competitorInfo,
        });

        setTimeout(() => {
          navigateToPlayground(channel);
        }, 2 * 1000);
      } catch (err) {
        console.log(err);
      }
    }

    socket.on("challenge_details", onChallengeDetails);

    return () => {
      socket.off("challenge_details", onChallengeDetails);
    };
  }, [dispatch, userDispatch, router, socketId]);

  return (
    <main className={styles.main}>
      {findingCompetitor && (
        <div className={styles.loader}>
          <Loader text="Finding Competitor" />
        </div>
      )}
      <div className={styles.heading}>
        <h1 className="h1-primary">Typing Game</h1>
        <p className="p-large">
          Welcome to our exciting typing game, where two opponents will battle
          it out to see who is <br />
          the fastest and most accurate typist!
        </p>
      </div>
      <form className={styles.form} onSubmit={formSubmitHandler}>
        <input
          type="text"
          required
          className={styles.input}
          placeholder="Enter username"
          ref={inputRef}
        />
        <span className="text-large">&</span>
        <button type="submit" className={styles.button}>
          <p className="p-large">Start Playing</p>
        </button>
      </form>
    </main>
  );
};

export default Home;
