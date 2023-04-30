type PlayerInfo = {
  socketId?: string;
  userName: string;
  isRobot?: boolean;
};

export interface ChallengeDetailsMessage {
  channel: string;
  paragraph: string;
  playerOneInfo: PlayerInfo;
  playerTwoInfo: PlayerInfo;
}
