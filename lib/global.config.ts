import { Region } from "./types";

const config = {
  riotApiKey: process.env.RIOT_API_KEY,
  riotApiUrl: {
    ASIA: "https://asia.api.riotgames.com",
    EUROPE: "https://europe.api.riotgames.com",
    AMERICAS: "https://americas.api.riotgames.com",
    EUW1: "https://euw1.api.riotgames.com",
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
};

export default config;
