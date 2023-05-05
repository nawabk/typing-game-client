export type PlayerInfo = {
  socketId?: string;
  userName: string;
  isRobot?: boolean;
  isPlayerOne?: boolean;
  isAskingForRematch?: boolean;
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

export interface LeaveChannelMessage {
  channel: string;
}

export interface RematchRequestMessage {
  channel: string;
}

export interface RematchMessage {
  paragraph: string;
}
