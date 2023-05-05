import { PlayerInfo } from "@/utils/type";
import React, { useContext, useReducer } from "react";

interface Score {
  wpm: number;
  netWpm: number;
  accuracyInPerc: number;
}

interface PlayerResultInfo {
  socketId: string;
  userName: string;
  isScoreRecieved?: boolean;
  score: Score;
  isRobot: boolean;
}

interface ChallengeResult {
  isResultOut: boolean;
  playerOneResult: Partial<PlayerResultInfo>;
  playerTwoResult: Partial<PlayerResultInfo>;
  winner: string;
  draw?: boolean;
}
interface State {
  competitorInfo: Partial<PlayerInfo>;
  paragraph: string;
  channel: string;
  result: Partial<ChallengeResult>;
  rematchError?: string;
}

interface Action {
  type:
    | "SET_COMPETITOR"
    | "SET_GAME_DETAILS"
    | "SET_CHALLENGE_RESULT"
    | "COMPETITOR_ASKING_REMATCH"
    | "SET_FOR_REMATCH"
    | "SET_REMATCH_ERROR"
    | "RESET";
  payload?: {
    [key: string]: any;
  };
}

type Dispatch = (action: Action) => void;

const GameDetailsContext = React.createContext<
  { state: State; dispatch: Dispatch } | undefined
>(undefined);

const initialState: State = {
  competitorInfo: {},
  paragraph: "",
  channel: "",
  result: {},
  rematchError: "",
};

const reducer = (state: State, action: Action): State => {
  const { type, payload } = action;
  switch (type) {
    case "SET_GAME_DETAILS": {
      return {
        ...state,
        ...payload,
      };
    }
    case "SET_COMPETITOR": {
      return {
        ...state,
        competitorInfo: {
          ...state.competitorInfo,
          ...payload,
        },
      };
    }
    case "SET_CHALLENGE_RESULT": {
      return {
        ...state,
        result: {
          ...state.result,
          ...payload,
        },
      };
    }
    case "COMPETITOR_ASKING_REMATCH": {
      return {
        ...state,
        competitorInfo: {
          ...state.competitorInfo,
          isAskingForRematch: true,
        },
      };
    }
    case "SET_FOR_REMATCH": {
      return {
        ...state,
        competitorInfo: {
          ...state.competitorInfo,
          isAskingForRematch: false,
        },
        paragraph: payload?.paragraph ?? "",
        result: {},
        rematchError: "",
      };
    }
    case "SET_REMATCH_ERROR": {
      return {
        ...state,
        rematchError: payload?.errMsg ?? "",
      };
    }
    case "RESET": {
      return {
        ...state,
        ...initialState,
      };
    }
    default:
      return state;
  }
};

export const GameDetailsProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <GameDetailsContext.Provider value={{ state, dispatch }}>
      {children}
    </GameDetailsContext.Provider>
  );
};

export const useGameDetailsContext = () => {
  const context = useContext(GameDetailsContext);
  if (context === undefined) {
    throw new Error(
      "useGameDetailsContext must be used inside the UserNameProvider"
    );
  }
  return context;
};
