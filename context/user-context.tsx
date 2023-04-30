import { createContext, useContext, useReducer } from "react";

interface State {
  userName: string;
  socketDetails: {
    [key: string]: string;
  };
}

interface Action {
  type: "SET_USERNAME" | "SET_SOCKET_DETAILS";
  payload: {
    [key: string]: string;
  };
}

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

    case "SET_SOCKET_DETAILS":
      return {
        ...state,
        socketDetails: {
          ...state.socketDetails,
          ...payload,
        },
      };
    default:
      return state;
  }
};

const initialState: State = {
  userName: "",
  socketDetails: {},
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
