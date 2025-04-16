"use server";

import config from "../global.config";
import {
  Region,
  RequestResponse,
  UserDataType,
  UserLeagueData,
} from "../types";

/**
 * Get user data from Riot API
 * @param gameName - The game name of the user
 * @param tagLine - The tag line of the user
 * @param region - The region of the user
 * @returns The user data
 */
export const getUserDataByGameName = async (
  gameName: string,
  tagLine: string,
  region: Region
): Promise<RequestResponse<UserDataType | null>> => {
  const response = await fetch(
    config.riotApiAccountUrl.userDataUrlByGameName(gameName, tagLine, region)
  );
  console.log("response from server", response);
  if (!response.ok) {
    return {
      ok: false,
      data: null,
    };
  }

  const data = await response.json();

  return {
    ok: true,
    data: data as UserDataType,
  };
};

export const getUserDataByPuuid = async (
  puuid: string,
  region: Region
): Promise<RequestResponse<UserDataType | null>> => {
  const response = await fetch(
    config.riotApiAccountUrl.userDataUrlByPuuid(puuid, region)
  );

  if (!response.ok) {
    return {
      ok: false,
      data: null,
    };
  }

  const data = await response.json();

  return {
    ok: true,
    data: data as UserDataType,
  };
};

export const getUserSummonerData = async (puuid: string, region: Region) => {
  const response = await fetch(
    config.riotApiSummonerProfileUrl.summonerProfileUrlByPuuid(puuid, region)
  );

  if (!response.ok) {
    return {
      ok: false,
      data: null,
    };
  }

  const data = await response.json();

  return {
    ok: true,
    data: data,
  };
};

export const getUserProfileIcon = async (
  iconId: number
): Promise<RequestResponse<string | null>> => {
  const response = await fetch(
    config.riotApiProfileIconsUrl.profileIconUrlById(iconId)
  );

  if (!response.ok) {
    return {
      ok: false,
      data: null,
    };
  }

  const data = await response.json();

  return {
    ok: true,
    data: data as string,
  };
};

/**
 * Get user league data from Riot API
 * @param puuid - The puuid of the user
 * @param region - The region of the user
 * @returns The user league data
 */
export const getUserLeagueData = async (
  puuid: string,
  region: Region
): Promise<RequestResponse<UserLeagueData[] | null>> => {
  const response = await fetch(
    config.riotApiLeagueUrl.userLeagueUrl(puuid, region)
  );

  if (!response.ok) {
    return {
      ok: false,
      data: null,
    };
  }

  const data = await response.json();

  return {
    ok: true,
    data: data as UserLeagueData[],
  };
};
