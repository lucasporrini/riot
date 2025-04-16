export type Region = "ASIA" | "EUROPE" | "AMERICAS" | "EUW1";

export interface RequestResponse<T> {
  data: T;
  ok: boolean;
}

export type UserDataType = {
  puuid: string;
  gameName: string;
  tagLine: string;
};

export type UserSummonerDataType = {
  id: string;
  accountId: string;
  puuid: string;
  profileIconId: number;
  revisionDate: number;
  summonerLevel: number;
};

export type UserStore = UserDataType & Partial<UserSummonerDataType>;

export interface UserLeagueData {
  leagueId: string;
  queueType: string;
  tier: string;
  rank: string;
  summonerId: string;
  puuid: string;
  leaguePoints: number;
  wins: number;
  losses: number;
  veteran: boolean;
  inactive: boolean;
  freshBlood: boolean;
  hotStreak: boolean;
}
