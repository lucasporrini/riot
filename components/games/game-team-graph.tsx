import config from "@/lib/global.config";
import { Match, MatchParticipant } from "@/lib/types";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useMemo } from "react";

interface GameTeamGraphProps {
  match: Match;
}

export const GameTeamGraph = ({ match }: GameTeamGraphProps) => {
  const blueTeam = match.info.participants.filter((p) => p.teamId === 100);
  const redTeam = match.info.participants.filter((p) => p.teamId === 200);

  return (
    <div className="rounded-lg bg-card text-card-foreground shadow-sm overflow-hidden">
      <div className="bg-blue-950 text-white p-2 text-sm">
        <div className="flex justify-between items-center">
          <h3>Defeat (Blue Team)</h3>
          <div className="flex gap-4">
            <span>
              Total Kills: {blueTeam.reduce((acc, p) => acc + p.kills, 0)}
            </span>
            <span>
              Total Gold: {blueTeam.reduce((acc, p) => acc + p.goldEarned, 0)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        {blueTeam.map((participant, index) => (
          <TeamRow key={index} participant={participant} match={match} />
        ))}
      </div>

      <div className="bg-red-950 text-white p-2 mt-2 text-sm">
        <div className="flex justify-between items-center">
          <h3>Victory (Red Team)</h3>
          <div className="flex gap-4">
            <span>
              Total Kills: {redTeam.reduce((acc, p) => acc + p.kills, 0)}
            </span>
            <span>
              Total Gold: {redTeam.reduce((acc, p) => acc + p.goldEarned, 0)}
            </span>
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
      <div className="flex items-center gap-2 w-40">
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
          <span className="text-sm font-medium">
            {participant.riotIdGameName}
          </span>
          <span className="text-xs text-gray-500">
            {participant.teamPosition}
          </span>
        </div>
      </div>

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

      <div className="w-32 flex items-center gap-2 relative">
        <div className="w-full h-2 bg-gray-100/50 rounded overflow-hidden">
          <div
            className="bg-red-400/80 h-full rounded"
            style={{
              width: `${damagePercentage}%`,
            }}
          />
        </div>
        <span>{participant.totalDamageDealtToChampions}</span>
      </div>

      <div className="w-20 text-center">
        {participant.wardsPlaced}/{participant.wardsKilled}
      </div>

      <div className="w-20 text-center">
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
            <div key={i} className="w-6 h-6 rounded-md bg-background" />
          );
        })}
      </div>
    </div>
  );
};
