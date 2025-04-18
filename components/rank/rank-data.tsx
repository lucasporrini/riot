"use client";

import { useRiotDataStore } from "@/lib/store";
import { Queue, UserLeagueData } from "@/lib/types";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Loader } from "../loader";

export const LeagueData = () => {
  const { userData } = useRiotDataStore();

  const [soloLeague, setSoloLeague] = useState<
    Partial<UserLeagueData> | undefined
  >(undefined);
  const [flexLeague, setFlexLeague] = useState<
    Partial<UserLeagueData> | undefined
  >(undefined);

  useEffect(() => {
    if (userData.rank.length) {
      setSoloLeague(
        userData.rank.find((rank) => rank.queueType === "RANKED_SOLO_5x5")
      );
      setFlexLeague(
        userData.rank.find((rank) => rank.queueType === "RANKED_FLEX_SR")
      );
    }
  }, [userData.rank, soloLeague, flexLeague]);

  if (!soloLeague || !flexLeague) {
    return (
      <LeagueLayout title={undefined}>
        <Loader className="px-2" />
      </LeagueLayout>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <LeagueDetails league={soloLeague} />
      <LeagueDetails league={flexLeague} />
    </div>
  );
};

const LeagueLayout = ({
  title,
  className,
  children,
}: {
  title: Queue | undefined;
  className?: string;
  children: React.ReactNode;
}) => {
  const rankedType = useMemo(() => {
    if (!title) return "Ranked";

    switch (title) {
      case "RANKED_SOLO_5x5":
        return "Ranked Solo";
      case "RANKED_FLEX_SR":
        return "Ranked Flex";
      case "RANKED_FLEX_TT":
        return "Ranked Flex";
      case "RANKED_TFT":
        return "Ranked TFT";
      default:
        return "Ranked";
    }
  }, [title]);

  return (
    <div className={cn("bg-muted p-1 rounded-md min-w-xs", className)}>
      <h2 className="text-sm font-medium px-2 py-1">{rankedType}</h2>
      {children}
    </div>
  );
};

const LeagueDetails = ({ league }: { league: Partial<UserLeagueData> }) => {
  const winRate = useMemo(() => {
    if (!league.wins || !league.losses) return 0;

    return ((league.wins / (league.wins + league.losses)) * 100).toFixed(0);
  }, [league.wins, league.losses]);

  return (
    <LeagueLayout title={league.queueType}>
      <div className="flex items-center gap-2">
        <Image
          src={`/ranked/Rank=${league?.tier}.png`}
          alt="Rank"
          width={100}
          height={100}
        />
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-2 font-semibold">
            <span>
              {league.tier &&
                league.tier.slice(0, 1).toUpperCase() + league.tier.slice(1)}
            </span>
            <span>{league.rank}</span>
            <span>-</span>
            <span>{league.leaguePoints} LP</span>
          </div>
          <div className="flex items-baseline gap-2 text-sm">
            <span className="text-primary">
              W {league.wins} L {league.losses}
            </span>
            <span>-</span>
            <span className="text-muted-foreground">{winRate}%</span>
          </div>
        </div>
      </div>
    </LeagueLayout>
  );
};
