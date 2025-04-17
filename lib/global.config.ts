import { API_VERSION } from "./constantes";
import { Division, Queue, Region, Tier } from "./types";

const config = {
  riotApiKey: process.env.RIOT_API_KEY,
  riotApiUrl: {
    ASIA: "https://asia.api.riotgames.com",
    EUROPE: "https://europe.api.riotgames.com",
    AMERICAS: "https://americas.api.riotgames.com",
    EUW: "https://euw1.api.riotgames.com",
  },
  riotApiAccountUrl: {
    userDataUrlByGameName: (
      gameName: string,
      tagLine: string,
      region: Region
    ) =>
      `${config.riotApiUrl[region]}/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}?api_key=${config.riotApiKey}`,
    userDataUrlByPuuid: (puuid: string, region: Region) =>
      `${config.riotApiUrl[region]}/riot/account/v1/accounts/by-puuid/${puuid}?api_key=${config.riotApiKey}`,
  },
  riotApiLeagueUrl: {
    userLeagueUrl: (puuid: string, region: Region) =>
      `${config.riotApiUrl[region]}/lol/league/v4/entries/by-puuid/${puuid}?api_key=${config.riotApiKey}`,
  },
  riotApiChampionUrl: {
    allChampionsUrl: () =>
      `https://ddragon.leagueoflegends.com/cdn/${API_VERSION}/data/en_US/champion.json`,
    championUrl: (champion: string) =>
      `https://ddragon.leagueoflegends.com/cdn/${API_VERSION}/data/en_US/champion/${champion}.json`,
    championSplashArtUrl: (champion: string, splashArtNumber: number) =>
      `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champion}_${splashArtNumber}.jpg`,
    championSquareIconUrl: (champion: string) =>
      `https://ddragon.leagueoflegends.com/cdn/${API_VERSION}/img/champion/${champion}.png`,
    championLoadingScreenUrl: (champion: string) =>
      `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${champion}.jpg`,
    championPassiveIconUrl: (champion: string) =>
      `https://ddragon.leagueoflegends.com/cdn/${API_VERSION}/img/passive/${champion}.png`,
    championAbilityIconUrl: (spell: string) =>
      `https://ddragon.leagueoflegends.com/cdn/${API_VERSION}/img/spell/${spell}.png`,
  },
  riotApiItemsUrl: {
    allItemsUrl: () =>
      `https://ddragon.leagueoflegends.com/cdn/${API_VERSION}/data/en_US/item.json`,
    itemIconUrl: (item: string) =>
      `https://ddragon.leagueoflegends.com/cdn/${API_VERSION}/img/item/${item}.png`,
  },
  riotApiSummonersUrl: {
    summonerUrl: () =>
      `https://ddragon.leagueoflegends.com/cdn/${API_VERSION}/data/en_US/summoner.json`,
    summonerIconUrl: (summonerIconId: number) =>
      `https://ddragon.leagueoflegends.com/cdn/${API_VERSION}/img/spell/${summonerIconId}.png`,
  },
  riotApiProfileIconsUrl: {
    profileIconUrl: () =>
      `https://ddragon.leagueoflegends.com/cdn/${API_VERSION}/data/en_US/profileicon.json`,
    profileIconUrlById: (profileIconId: number) =>
      `https://ddragon.leagueoflegends.com/cdn/${API_VERSION}/img/profileicon/${profileIconId}.png`,
  },
  riotApiSummonerProfileUrl: {
    summonerProfileUrlByPuuid: (puuid: string, region: Region) =>
      `${config.riotApiUrl[region]}/lol/summoner/v4/summoners/by-puuid/${puuid}?api_key=${config.riotApiKey}`,
    summonerProfileUrlByAccountId: (accountId: string, region: Region) =>
      `${config.riotApiUrl[region]}/lol/summoner/v4/summoners/by-account/${accountId}?api_key=${config.riotApiKey}`,
    summonerProfileUrlBySummonerId: (summonerId: string, region: Region) =>
      `${config.riotApiUrl[region]}/lol/summoner/v4/summoners/${summonerId}?api_key=${config.riotApiKey}`,
  },
  riotApiMatchUrl: {
    lastMatchUrlByPuuid: (
      puuid: string,
      region: Region,
      startTime?: number,
      endTime?: number,
      queue?: number,
      type?: string,
      start?: number,
      count?: number
    ) => {
      const queryParams = [];

      if (startTime) queryParams.push(`startTime=${startTime}`);
      if (endTime) queryParams.push(`endTime=${endTime}`);
      if (queue) queryParams.push(`queue=${queue}`);
      if (type) queryParams.push(`type=${type}`);
      if (start !== undefined) queryParams.push(`start=${start}`);
      if (count !== undefined) queryParams.push(`count=${count}`);

      const queryString =
        queryParams.length > 0 ? `&${queryParams.join("&")}` : "";

      return `${
        config.riotApiUrl[region]
      }/lol/match/v5/matches/by-puuid/${puuid}/ids?api_key=${
        config.riotApiKey
      }${queryString && "&" + queryString}`;
    },
    matchUrl: (matchId: string, region: Region) =>
      `${config.riotApiUrl[region]}/lol/match/v5/matches/${matchId}?api_key=${config.riotApiKey}`,
    matchTimelineUrl: (matchId: string, region: Region) =>
      `${config.riotApiUrl[region]}/lol/match/v5/matches/${matchId}/timeline?api_key=${config.riotApiKey}`,
  },
  riotApiLeagueExpUrl: {
    leagueExpUrl: (
      queue: Queue,
      tier: Tier,
      division: Division,
      region: Region,
      page?: number
    ) =>
      `${config.riotApiUrl[region]}/lol/league-exp/v4/entries/${queue}/${tier}/${division}?api_key=${config.riotApiKey}&page=${page}`,
  },
};

export default config;
