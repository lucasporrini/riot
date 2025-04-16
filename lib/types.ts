export type Region = "ASIA" | "EUROPE" | "AMERICAS" | "EUW1";

export interface RequestResponse<T> {
  data: T;
  ok: boolean;
}

export interface UserData {
  puuid: string;
  gameName: string;
  tagLine: string;
}

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
