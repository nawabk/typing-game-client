export type PlayerInfo = {
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

export interface ChallengeScoreMessage {
  socketId: string;
  channel: string;
  wpm: number;
  netWpm: number;
  accuracyInPerc: number;
}
