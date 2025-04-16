export type Region = "ASIA" | "EUROPE" | "AMERICAS" | "EUW";
export type Queue =
  | "RANKED_SOLO_5x5"
  | "RANKED_TFT"
  | "RANKED_FLEX_SR"
  | "RANKED_FLEX_TT";
export type Tier =
  | "IRON"
  | "BRONZE"
  | "SILVER"
  | "GOLD"
  | "PLATINUM"
  | "EMERALD"
  | "DIAMOND"
  | "MASTER"
  | "GRANDMASTER"
  | "CHALLENGER";
export type Division = "I" | "II" | "III" | "IV";

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

export type UserStore = UserDataType &
  Partial<UserSummonerDataType> & {
    rank: Partial<UserLeagueData>;
  };

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

export type Tabs = {
  label: string;
  value: string;
  render: React.ReactNode;
  default?: boolean;
};
