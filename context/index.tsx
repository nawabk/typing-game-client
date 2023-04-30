import { GameDetailsProvider } from "./game-details-context";
import { UserContextProvider } from "./user-context";

const ContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <GameDetailsProvider>
      <UserContextProvider>{children}</UserContextProvider>
    </GameDetailsProvider>
  );
};

export default ContextProvider;
