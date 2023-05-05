import { PlayerInfo } from "@/utils/type";
import { createContext, useContext, useReducer } from "react";

type State = PlayerInfo;

type Action =
  | { type: "SET_USERNAME"; payload: { userName: string } }
  | { type: "SET_SOCKET_ID"; payload: { socketId: string } }
  | {
      type: "SET_IS_PLAYER_ONE";
      payload: {
        isPlayerOne: boolean;
      };
    }
  | { type: "ASK_FOR_REMATCH"; payload?: never }
  | { type: "SET_FOR_REMATCH"; payload?: never };

type Dispatch = (action: Action) => void;

const UserContext = createContext<
  { state: State; dispatch: Dispatch } | undefined
>(undefined);

const reducer = (state: State, action: Action): State => {
  const { type, payload } = action;
  switch (type) {
    case "SET_USERNAME":
      return {
        ...state,
        userName: payload.userName,
      };
    case "SET_SOCKET_ID":
      return {
        ...state,
        socketId: payload.socketId,
      };
    case "SET_IS_PLAYER_ONE":
      return {
        ...state,
        isPlayerOne: payload.isPlayerOne,
      };
    case "ASK_FOR_REMATCH":
      return {
        ...state,
        isAskingForRematch: true,
      };
    case "SET_FOR_REMATCH":
      return {
        ...state,
        isAskingForRematch: false,
      };
    default:
      return state;
  }
};

const initialState: State = {
  userName: "",
  socketId: "",
  isPlayerOne: false,
};

export const UserContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error("useUserContext must be used inside UserContextProvider");
  }

  return context;
};
