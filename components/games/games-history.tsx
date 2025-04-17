"use client";

import {
  getGamesHistory,
  getMatchesDetails,
} from "@/lib/actions/games.actions";
import config from "@/lib/global.config";
import { useRiotDataStore } from "@/lib/store";
import { Match } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useMemo } from "react";
import { Loader } from "../loader";
import { GameDetails } from "./game-details";

export const GamesHistory = () => {
  const { userData } = useRiotDataStore();

  const { data, isFetching } = useQuery({
    queryKey: ["games-history", userData.puuid],
    queryFn: async () => {
      const response = await getGamesHistory(userData.puuid, "EUROPE");

      if (!response.ok) return null;

      const matchesDetails = await getMatchesDetails(response.data, "EUROPE");

      return matchesDetails;
    },
  });

  return (
    <GamesHistoryLayout title="Games History">
      {isFetching && !data?.length ? (
        <Loader />
      ) : (
        data?.map((game, index) => <GamesItem key={index} game={game} />)
      )}
    </GamesHistoryLayout>
  );
};

const GamesItem = ({ game }: { game: Match | null }) => {
  const { userData } = useRiotDataStore();

  const playerPerformance = useMemo(
    () =>
      game?.info.participants.find(
        (participant) => participant.puuid === userData.puuid
      ),
    [game?.info.participants, userData.puuid]
  );

  const roleIconPath = useMemo(() => {
    if (game?.info.gameMode === "CHERRY") return;

    let path: string;

    switch (playerPerformance?.teamPosition) {
      case "SUPPORT":
      case "UTILITY":
        path = "/roles/Role=Support.svg";
        break;
      case "BOTTOM":
        path = "/roles/Role=Bot.svg";
        break;
      case "TOP":
        path = "/roles/Role=Top.svg";
        break;
      case "MIDDLE":
        path = "/roles/Role=Mid.svg";
        break;
      case "JUNGLE":
        path = "/roles/Role=Jungle.svg";
        break;
      default:
        path = "/roles/Role=Top.svg";
        break;
    }

    return path;
  }, [playerPerformance, game]);

  if (!playerPerformance) return null;

  return (
    <div className="flex justify-between items-center bg-background py-1 px-2 rounded-md mx-1">
      <div className="flex items-center gap-2 w-full">
        {playerPerformance?.championName ? (
          <Image
            src={config.riotApiChampionUrl.championSquareIconUrl(
              playerPerformance?.championName
            )}
            alt="Champion icon"
            width={40}
            height={40}
            className="rounded-md"
          />
        ) : (
          <div className="w-10 h-10" />
        )}
        <div className="flex items-center gap-2">
          <div className="bg-muted p-1 rounded-md w-10 h-10 flex items-center justify-center">
            {roleIconPath ? (
              <Image src={roleIconPath} alt="role" width={30} height={30} />
            ) : (
              <span className="text-xl font-semibold">A</span>
            )}
          </div>
          <span>{playerPerformance?.championName ?? "Not found"}</span>
        </div>
      </div>
      <GameDetails playerPerformance={playerPerformance} game={game} />
    </div>
  );
};

const GamesHistoryLayout = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="bg-muted p-1 rounded-md min-w-xs w-full">
      <h2 className="text-sm font-medium px-2 py-1">{title}</h2>
      <div className="space-y-2">{children}</div>
    </div>
  );
};
