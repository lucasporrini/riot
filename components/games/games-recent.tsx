import config from "@/lib/global.config";
import { useRiotDataStore } from "@/lib/store";
import { Match, MatchParticipant } from "@/lib/types";
import { roleIconPath } from "@/lib/utils";
import { motion } from "motion/react";
import Image from "next/image";
import { useCallback } from "react";

interface GamesRecentProps {
  matches: (Match | null)[] | undefined;
}

type ChampionStats = {
  championId: number;
  championName: string;
  games: number;
  wins: number;
  kills: number;
  deaths: number;
  assists: number;
};

type RoleStats = {
  role: string;
  games: number;
};

export const GamesRecent = ({ matches = [] }: GamesRecentProps) => {
  const { userData } = useRiotDataStore();

  // Get player stats from matches
  const getPlayerStats = (match: Match | null) => {
    if (!match) return null;

    const player = match.info.participants.find(
      (p) => p.puuid === userData.puuid
    );

    return player;
  };

  const validMatches = matches.filter(
    (match): match is Match => match !== null
  );

  // Calculate win rate
  const winRate =
    validMatches.length > 0
      ? (
          (validMatches.filter((match) => getPlayerStats(match)?.win).length /
            validMatches.length) *
          100
        ).toFixed(0)
      : "0";

  // Calculate average KDA
  const totalStats = validMatches.reduce(
    (acc, match) => {
      const player = getPlayerStats(match);
      if (!player) return acc;
      return {
        kills: acc.kills + player.kills,
        deaths: acc.deaths + player.deaths,
        assists: acc.assists + player.assists,
      };
    },
    { kills: 0, deaths: 0, assists: 0 }
  );

  const avgKills = (totalStats.kills / validMatches.length || 0).toFixed(1);
  const avgDeaths = (totalStats.deaths / validMatches.length || 0).toFixed(1);
  const avgAssists = (totalStats.assists / validMatches.length || 0).toFixed(1);
  const kdaRatio = (
    (totalStats.kills + totalStats.assists) /
    Math.max(1, totalStats.deaths)
  ).toFixed(2);

  // Calculate champion stats
  const championStats = validMatches
    .reduce((acc: ChampionStats[], match) => {
      const player = getPlayerStats(match);
      if (!player) return acc;

      const existingChamp = acc.find((c) => c.championId === player.championId);
      if (existingChamp) {
        existingChamp.games++;
        existingChamp.wins += player.win ? 1 : 0;
        existingChamp.kills += player.kills;
        existingChamp.deaths += player.deaths;
        existingChamp.assists += player.assists;
        return acc;
      }

      acc.push({
        championId: player.championId,
        championName: player.championName,
        games: 1,
        wins: player.win ? 1 : 0,
        kills: player.kills,
        deaths: player.deaths,
        assists: player.assists,
      });
      return acc;
    }, [])
    .sort((a, b) => b.games - a.games)
    .slice(0, 3);

  // Calculate role stats
  const roleStats = validMatches
    .reduce((acc: RoleStats[], match) => {
      const player = getPlayerStats(match);
      if (!player) return acc;

      const existingRole = acc.find((r) => r.role === player.teamPosition);
      if (existingRole) {
        existingRole.games++;
        return acc;
      }

      acc.push({
        role: player.teamPosition,
        games: 1,
      });
      return acc;
    }, [])
    .sort((a, b) => b.games - a.games);

  const roleIcon = useCallback((role: string) => {
    return roleIconPath(null, { teamPosition: role } as MatchParticipant);
  }, []);

  return (
    <div className="grid grid-cols-3 gap-4 p-4 bg-card rounded-lg">
      {/* Win Rate Circle */}
      <div className="flex items-center gap-4">
        <div className="relative w-24 h-24">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle
              className="stroke-muted fill-none"
              strokeWidth="10"
              cx="50"
              cy="50"
              r="45"
            />
            <circle
              className="stroke-blue-500 fill-none"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={`${Number(winRate) * 2.83} 283`}
              transform="rotate(-90 50 50)"
              cx="50"
              cy="50"
              r="45"
            />
            <text
              x="50"
              y="50"
              className="text-2xl font-bold"
              textAnchor="middle"
              dy=".3em"
              fill="currentColor"
            >
              {winRate}%
            </text>
          </svg>
        </div>
        <div className="space-y-1">
          <div className="text-sm font-bold">
            {avgKills} / {avgDeaths} / {avgAssists}
          </div>
          <div className="text-xs text-muted-foreground">{kdaRatio}:1</div>
        </div>
      </div>

      {/* Recent Champions */}
      <div className="space-y-2">
        {championStats.map((champ) => {
          const winRate = ((champ.wins / champ.games) * 100).toFixed(0);

          return (
            <div key={champ.championId} className="flex items-center gap-2">
              <Image
                src={config.riotApiChampionUrl.championSquareIconUrl(
                  champ.championName
                )}
                alt={champ.championName}
                width={32}
                height={32}
                className="rounded-full"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span>
                    {winRate}% ({champ.wins}W / {champ.games - champ.wins}L)
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Preferred Roles */}
      <div className="grid grid-cols-5 gap-2">
        {roleStats.map((role) => (
          <div key={role.role} className="flex flex-col items-center space-y-2">
            <div className="h-32 w-full bg-muted relative rounded-md overflow-hidden">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(role.games / matches.length) * 100}%` }}
                className="absolute bottom-0 w-full bg-blue-500"
              />
            </div>
            <div className="flex items-center justify-center bg-muted rounded-md p-2">
              <Image
                src={roleIcon(role.role)}
                alt={role.role}
                width={24}
                height={24}
                className="w-6 h-6"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
