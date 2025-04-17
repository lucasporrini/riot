"use client";

import { getGamesHistory, getMatchDetails } from "@/lib/actions/games.actions";
import { useRiotDataStore } from "@/lib/store";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export const GamesHistory = () => {
  const { userData } = useRiotDataStore();

  const { data } = useQuery({
    queryKey: ["games-history", userData.puuid],
    queryFn: async () => {
      const response = await getGamesHistory(userData.puuid, "EUROPE");

      if (!response.ok) return null;

      const matchDetails = await getMatchDetails(response.data[0], "EUROPE");

      return matchDetails.data;
    },
  });

  console.log("data", data);

  const participantId = useMemo(() => {
    const index = data?.metadata.participants.findIndex(
      (participant) => participant === userData.puuid
    );

    if (index === -1 || !index) return null;

    return index + 1;
  }, [data, userData.puuid]);

  const playerPerformance = useMemo(() => {
    return data?.info.participants.find(
      (participant) => participant.participantId === participantId
    );
  }, [data, participantId]);

  return (
    <GamesHistoryLayout title="Games History">
      {data?.info.participants
        .filter((participant) => participant.participantId === participantId)
        .map(() => (
          <div key={data?.metadata.matchId}>
            {playerPerformance?.championName}
          </div>
        ))}
    </GamesHistoryLayout>
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
      {children}
    </div>
  );
};
