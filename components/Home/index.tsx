import React, { useEffect, useRef, useState } from "react";
import styles from "../../styles/Home.module.css";

import { useGameDetailsContext } from "@/context/game-details-context";
import Loader from "../common/Loader";
import { useRouter } from "next/router";
import { socket } from "@/utils/socket";
import useSocketInit from "@/hooks/useSocketInit";
import { useUserContext } from "@/context/user-context";
import { ChallengeDetailsMessage } from "@/utils/type";

const Home: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { dispatch } = useGameDetailsContext();
  const { dispatch: userDispatch } = useUserContext();
  const [error, setError] = useState<boolean>(false);
  const [findingCompetitor, setFindingCompetitor] = useState<boolean>(false);
  const router = useRouter();
  // initialize socket
  useSocketInit();
  const { state: userState } = useUserContext();
  const { socketDetails } = userState;
  const socketId: string = socketDetails?.id;

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
      socket.emit("start-play", userName);
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
        let competitor;
        if (playerTwoInfo.isRobot) {
          competitor = playerTwoInfo.userName;
        } else {
          const { socketId: playerOneSocketId, userName: playerOneUserName } =
            playerOneInfo;
          const { socketId: playerTwoSocketId, userName: playerTwoUserName } =
            playerTwoInfo;
          if (socketId === playerOneSocketId) {
            competitor = playerTwoUserName;
          } else if (socketId === playerTwoSocketId) {
            competitor = playerOneUserName;
          } else {
            throw new Error("Could not find competitor");
          }
        }

        setTimeout(() => {
          navigateToPlayground(channel);
        }, 2 * 1000);
        dispatch({
          type: "SET_GAME_DETAILS",
          payload: {
            channel,
            paragraph,
            competitor,
          },
        });
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
