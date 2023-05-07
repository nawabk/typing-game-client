export type PlayerInfo = {
  socketId?: string;
  userName: string;
  isRobot?: boolean;
  channel?: string;
  isPlayerOne?: boolean;
  isAskingForRematch?: boolean;
};

export interface ChallengeDetailsMessage {
  channel: string;
  paragraph: string;
  playerOne: PlayerInfo;
  playerTwo: PlayerInfo;
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

export interface RematchErrorMessage {
  errMsg: string;
}
