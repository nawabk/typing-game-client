import React, { useEffect, useRef, useState } from "react";
import styles from "../../styles/Home.module.css";

import useSocket from "@/hooks/useSocket";
import { useGameDetailsContext } from "@/context/game-details-context";

const Home: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { dispatch } = useGameDetailsContext();
  const [error, setError] = useState<boolean>(false);
  const socket = useSocket();

  const formSubmitHandler = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setError(false);
    const userName = inputRef?.current?.value;
    if (!userName) {
      setError(true);
    } else {
      //   setUserName(userName);
      dispatch({
        type: "SET_USERNAME",
        payload: {
          userName,
        },
      });
      socket.emit("start-play", userName);
    }
  };

  useEffect(() => {
    if (socket) {
      socket.on("challenge_details", (message) => {
        console.log(message);
      });
      socket.on("competitor", (name) => {
        console.log(name);
      });
    }
  }, [socket]);

  return (
    <main className={styles.main}>
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
