import React, { useEffect, useRef, useState } from "react";
import styles from "../../styles/Home.module.css";

import { useGameDetailsContext } from "@/context/game-details-context";
import Loader from "../common/Loader";
import { useRouter } from "next/router";
import { socket } from "@/utils/socket";
import { useUserContext } from "@/context/user-context";
import {
  ChallengeDetailsMessage,
  PlayerInfo,
  StartPlayMessage,
} from "@/utils/type";
import Backdrop from "../common/Backdrop";
import { isMobile } from "react-device-detect";

const Home: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { dispatch } = useGameDetailsContext();
  const { dispatch: userDispatch } = useUserContext();
  const [error, setError] = useState<boolean>(false);
  const [findingCompetitor, setFindingCompetitor] = useState<boolean>(false);
  const router = useRouter();

  const { state: userState } = useUserContext();
  const { socketId, userName } = userState;

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

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
      const message: StartPlayMessage = {
        userName,
        isMobileUser: isMobile,
      };
      socket.emit("start_play", message);
      setFindingCompetitor(true);
    }
  };

  useEffect(() => {
    function navigateToPlayground(channel: string) {
      router.push(`/play/${channel}`);
    }

    function onChallengeDetails(message: ChallengeDetailsMessage) {
      try {
        const { channel, paragraph, playerOne, playerTwo } = message;
        let competitorInfo: PlayerInfo;
        let isUserPlayerOne: boolean = true;
        if (playerTwo.isRobot) {
          competitorInfo = playerTwo;
        } else {
          const { socketId: playerOneSocketId } = playerOne;
          const { socketId: playerTwoSocketId } = playerTwo;
          if (socketId === playerOneSocketId) {
            competitorInfo = playerTwo;
          } else if (socketId === playerTwoSocketId) {
            competitorInfo = playerOne;
            isUserPlayerOne = false;
          } else {
            throw new Error("Could not find competitor");
          }
        }
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

        navigateToPlayground(channel);
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
        <>
          <Backdrop />
          <div className={styles.loader}>
            <Loader text="Finding Competitor" />
          </div>
        </>
      )}
      <div className={styles.heading}>
        <h1 className="h1-primary">Typing Game</h1>
        <p className={`p-large ${styles.subtext}`}>
          Welcome to our exciting typing game, where two opponents will battle
          it out to see who is the fastest and most accurate typist!
        </p>
      </div>
      <form className={styles.form} onSubmit={formSubmitHandler}>
        <input
          type="text"
          maxLength={15}
          required
          className={styles.input}
          placeholder="Enter username"
          ref={inputRef}
          defaultValue={userName}
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
