"use server";

import config from "../global.config";
import { Match, Region, RequestResponse } from "../types";

/**
 * Fetches the match history for a player
 * @param puuid - The player's unique identifier
 * @param region - The region where the player's account is located
 * @returns An object containing the success status and match data if successful
 */
export const getGamesHistory = async (puuid: string, region: Region) => {
  const response = await fetch(
    config.riotApiMatchUrl.lastMatchUrlByPuuid(puuid, region)
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

export const getMatchDetails = async (
  matchId: string,
  region: Region
): Promise<RequestResponse<Match | null>> => {
  const response = await fetch(
    config.riotApiMatchUrl.matchUrl(matchId, region)
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

export const getMatchesDetails = async (matchIds: string[], region: Region) => {
  const matchesData = await Promise.all(
    matchIds.map((matchId) => getMatchDetails(matchId, region))
  );

  console.log("matchesData", matchesData);

  return matchesData.map((match) => match.data);
};
