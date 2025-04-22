"use client";

import {
  getGamesHistory,
  getMatchesDetails,
} from "@/lib/actions/games.actions";
import config from "@/lib/global.config";
import { useRiotDataStore } from "@/lib/store";
import { Match, MatchParticipant } from "@/lib/types";
import { cn, roleIconPath } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useMemo } from "react";
import { Loader } from "../loader";
import { GameDetails } from "./game-details";
import { GamesRecent } from "./games-recent";

export const GamesHistory = () => {
  const { userData } = useRiotDataStore();

  const { data, isFetching } = useQuery({
    queryKey: ["games-history", userData.puuid],
    queryFn: async () => {
      const response = await getGamesHistory(userData.puuid, "EUROPE");

      if (!response.ok) return [];

      const matchesDetails = await getMatchesDetails(response.data, "EUROPE");

      const filteredMatches = matchesDetails.filter(
        (match): match is Match => match !== null
      );

      return filteredMatches;
    },
  });

  return (
    <div className="flex flex-col gap-2 w-full">
      <GamesHistoryLayout title={`Games Recent (${data?.length} games loaded)`}>
        <GamesRecent matches={data} />
      </GamesHistoryLayout>
      <GamesHistoryLayout title="Games History">
        {isFetching && !data?.length ? (
          <Loader />
        ) : (
          data?.map(
            (game, index) => game && <GamesItem key={index} game={game} />
          )
        )}
      </GamesHistoryLayout>
    </div>
  );
};

const GamesItem = ({ game }: { game: Match }) => {
  const { userData } = useRiotDataStore();

  const playerPerformance = useMemo(
    () =>
      game?.info.participants.find(
        (participant) => participant.puuid === userData.puuid
      ),
    [game?.info.participants, userData.puuid]
  );

  const roleIcon = useMemo(
    () => roleIconPath(game, playerPerformance as MatchParticipant),
    [playerPerformance, game]
  );

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
          <div
            className={cn(
              "bg-muted p-1 rounded-md w-10 h-10 flex items-center justify-center",
              playerPerformance.win ? "bg-green-800" : "bg-red-800"
            )}
          >
            {roleIcon ? (
              <Image src={roleIcon} alt="role" width={30} height={30} />
            ) : (
              <span className="text-xl font-semibold text-white">A</span>
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
