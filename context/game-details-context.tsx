import { PlayerInfo } from "@/utils/type";
import React, { useContext, useReducer } from "react";

interface State {
  competitorInfo: Partial<PlayerInfo>;
  paragraph: string;
  channel: string;
}

interface Action {
  type: "SET_COMPETITOR" | "SET_GAME_DETAILS";
  payload?: {
    [key: string]: any;
  };
}

type Dispatch = (action: Action) => void;

const GameDetailsContext = React.createContext<
  { state: State; dispatch: Dispatch } | undefined
>(undefined);

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
    default:
      return state;
  }
};

const initialState: State = {
  competitorInfo: {},
  paragraph: "",
  channel: "",
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
