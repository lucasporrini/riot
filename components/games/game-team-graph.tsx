import { getAllChampions } from "@/lib/actions/champions.actions";
import { ROLE_ORDER } from "@/lib/constantes";
import config from "@/lib/global.config";
import { Match, MatchParticipant } from "@/lib/types";
import { cn, getRole, isWinner } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo } from "react";

interface GameTeamGraphProps {
  match: Match;
}

export const GameTeamGraph = ({ match }: GameTeamGraphProps) => {
  const blueTeam = useMemo(
    () =>
      match.info.participants
        .filter((p) => p.teamId === 100)
        .sort(
          (a, b) => ROLE_ORDER[a.teamPosition] - ROLE_ORDER[b.teamPosition]
        ),
    [match.info.participants]
  );
  const redTeam = useMemo(
    () =>
      match.info.participants
        .filter((p) => p.teamId === 200)
        .sort(
          (a, b) => ROLE_ORDER[a.teamPosition] - ROLE_ORDER[b.teamPosition]
        ),
    [match.info.participants]
  );

  const blueTeamResult = useMemo(() => isWinner(blueTeam[0].win), [blueTeam]);
  const redTeamResult = useMemo(() => isWinner(redTeam[0].win), [redTeam]);

  return (
    <div className="rounded-lg bg-card text-card-foreground shadow-sm overflow-hidden">
      <div className="bg-blue-800 dark:bg-blue-950 text-white p-2 text-sm">
        <div className="flex justify-between items-center">
          <h3>{blueTeamResult}</h3>
          <div className="flex gap-4">
            <TotalData
              type="kill"
              totalGold={blueTeam.reduce((acc, p) => acc + p.kills, 0)}
            />

            <TotalData
              type="gold"
              totalGold={blueTeam.reduce((acc, p) => acc + p.goldEarned, 0)}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        {blueTeam.map((participant, index) => (
          <TeamRow key={index} participant={participant} match={match} />
        ))}
      </div>

      <div className="bg-red-800 dark:bg-red-950 text-white p-2 mt-2 text-sm">
        <div className="flex justify-between items-center">
          <h3>{redTeamResult}</h3>
          <div className="flex gap-4">
            <TotalData
              type="kill"
              totalGold={redTeam.reduce((acc, p) => acc + p.kills, 0)}
            />

            <TotalData
              type="gold"
              totalGold={redTeam.reduce((acc, p) => acc + p.goldEarned, 0)}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        {redTeam.map((participant, index) => (
          <TeamRow key={index} participant={participant} match={match} />
        ))}
      </div>
    </div>
  );
};

const TeamRow = ({
  participant,
  match,
}: {
  participant: MatchParticipant;
  match: Match;
}) => {
  const { data: allChampions } = useQuery({
    queryKey: ["allChampions"],
    queryFn: async () => {
      const data = await getAllChampions();

      return data;
    },
  });

  useEffect(() => {
    console.log("allChampions", allChampions);
  }, [allChampions]);

  const kda = useMemo(
    () => `${participant.kills}/${participant.deaths}/${participant.assists}`,
    [participant.assists, participant.deaths, participant.kills]
  );

  const kdaRatio = useMemo(() => {
    if (participant.deaths === 0) return "Perfect";

    return (
      (participant.kills + participant.assists) /
      Math.max(1, participant.deaths)
    ).toFixed(2);
  }, [participant.assists, participant.deaths, participant.kills]);

  const totalCs = useMemo(
    () => participant.totalMinionsKilled + participant.neutralMinionsKilled,
    [participant.neutralMinionsKilled, participant.totalMinionsKilled]
  );

  const damagePercentage = useMemo(
    () =>
      (participant.totalDamageDealtToChampions /
        Math.max(
          ...match.info.participants.map((p) => p.totalDamageDealtToChampions)
        )) *
      100,
    [match.info.participants, participant.totalDamageDealtToChampions]
  );

  return (
    <div className="flex items-center justify-between gap-4 p-2">
      <Link
        className="flex items-center gap-2 w-40"
        href={`/profile/${participant.riotIdGameName}-${participant.riotIdTagline}`}
      >
        <Image
          src={config.riotApiChampionUrl.championSquareIconUrl(
            participant.championName
          )}
          alt={participant.championName}
          width={40}
          height={40}
          className="w-8 h-8 rounded-md"
        />
        <div className="flex flex-col">
          <span className="text-sm font-medium truncate">
            {participant.riotIdGameName}
          </span>
          <span className="text-xs text-gray-500">
            {getRole(participant.teamPosition)}
          </span>
        </div>
      </Link>

      <div className="flex flex-col w-24 text-center">
        <span>{kda}</span>
        <span
          className={cn("text-xs ml-1", {
            "text-gray-500":
              kdaRatio !== "Perfect" && parseFloat(kdaRatio) < 2.5,
            "text-green-500":
              kdaRatio !== "Perfect" &&
              parseFloat(kdaRatio) >= 2.5 &&
              parseFloat(kdaRatio) < 4,
            "text-blue-500":
              kdaRatio !== "Perfect" &&
              parseFloat(kdaRatio) >= 4 &&
              parseFloat(kdaRatio) < 5,
            "text-orange-500":
              kdaRatio === "Perfect" || parseFloat(kdaRatio) >= 5,
          })}
        >
          {kdaRatio}
        </span>
      </div>

      <div className="w-44 flex items-center gap-2 relative">
        <div className="w-24 h-2 bg-gray-300/50 dark:bg-gray-100/50 rounded overflow-hidden">
          <div
            className="bg-red-600/80 dark:bg-red-400/80 h-full rounded"
            style={{
              width: `${damagePercentage}%`,
            }}
          />
        </div>
        <span className="w-14 text-end">
          {participant.totalDamageDealtToChampions}
        </span>
      </div>

      <div className="flex flex-col items-center justify-center w-14 text-center">
        <span>{participant.visionScore}</span>
        <span className="text-xs text-gray-500">
          {participant.wardsPlaced}/{participant.wardsKilled}
        </span>
      </div>

      <div className="w-26 text-end">
        {totalCs}
        <span className="text-sm text-gray-500 ml-1">
          ({(totalCs / (match.info.gameDuration / 60)).toFixed(1)}
          /m)
        </span>
      </div>

      <div className="flex gap-1">
        {[...Array(6)].map((_, i) => {
          const itemId = participant[`item${i}` as keyof MatchParticipant];

          return itemId ? (
            <Image
              key={i}
              src={config.riotApiItemsUrl.itemIconUrl(itemId as string)}
              alt={`Item ${itemId}`}
              className="w-6 h-6 rounded-md"
              width={40}
              height={40}
            />
          ) : (
            <div
              key={i}
              className="w-6 h-6 rounded-md bg-gray-600 dark:bg-gray-400"
            />
          );
        })}
      </div>
    </div>
  );
};

const TotalData = ({
  type,
  totalGold,
}: {
  type: "gold" | "kill";
  totalGold: number;
}) => {
  const icon = {
    gold: "gold_icon.webp",
    kill: "kill_icon.webp",
  };

  return (
    <div className="flex items-center gap-1">
      <Image
        src={`/icons/${icon[type]}`}
        alt={`${type} icon`}
        width={16}
        height={16}
      />
      <span>{totalGold}</span>
    </div>
  );
};
