import React, { useEffect, useRef, useState } from "react";
import styles from "../../styles/Home.module.css";

import useSocket from "@/hooks/useSocket";
import { useGameDetailsContext } from "@/context/game-details-context";
import Loader from "../common/Loader";
import { useRouter } from "next/router";

const Home: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { dispatch } = useGameDetailsContext();
  const [error, setError] = useState<boolean>(false);
  const socket = useSocket();
  const [findingCompetitor, setFindingCompetitor] = useState<boolean>(false);
  const router = useRouter();

  const formSubmitHandler = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setError(false);
    const userName = inputRef?.current?.value;
    if (!userName) {
      setError(true);
    } else {
      dispatch({
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
    if (socket) {
      socket.on(
        "challenge_details",
        (message: { channel: string; paragraph: string }) => {
          const { channel, paragraph } = message;
          setTimeout(() => {
            navigateToPlayground(channel);
          }, 2 * 1000);
          dispatch({
            type: "SET_GAME_DETAILS",
            payload: {
              channel,
              paragraph,
            },
          });
        }
      );
      socket.on("competitor", (name: string) => {
        dispatch({
          type: "SET_COMPETITOR",
          payload: {
            competitor: name,
          },
        });
      });
    }
  }, [socket, dispatch, router]);

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
