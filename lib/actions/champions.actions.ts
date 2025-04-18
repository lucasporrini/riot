"use server";

import config from "../global.config";

export const getAllChampions = async () => {
  const response = await fetch(config.riotApiChampionUrl.allChampionsUrl());

  const data = await response.json();

  return {
    ok: response.ok,
    data,
  };
};

export const getChampionData = async (championName: string) => {
  const response = await fetch(
    config.riotApiChampionUrl.championUrl(championName)
  );
  const data = await response.json();
  return data;
};
