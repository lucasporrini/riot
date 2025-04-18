import config from "@/lib/global.config";
import { AllChampions, Match, MatchParticipant } from "@/lib/types";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface GameUnwoundProps {
  match: Match;
  allChampions: AllChampions;
  blueTeam: MatchParticipant[];
  redTeam: MatchParticipant[];
}

export const GameUnwound = ({
  match,
  allChampions,
  blueTeam,
  redTeam,
}: GameUnwoundProps) => {
  return (
    <div className="min-h-full space-y-4">
      {/* Blue Team */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400">
          Blue Team
        </h3>
        {blueTeam.map((player, index) => (
          <PlayerDetails
            key={index}
            player={player}
            allChampions={allChampions}
            match={match}
          />
        ))}
      </div>

      {/* Red Team */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-red-600 dark:text-red-400">
          Red Team
        </h3>
        {redTeam.map((player, index) => (
          <PlayerDetails
            key={index}
            player={player}
            allChampions={allChampions}
            match={match}
          />
        ))}
      </div>
    </div>
  );
};

const PlayerDetails = ({
  player,
  allChampions,
  match,
}: {
  player: MatchParticipant;
  allChampions: AllChampions;
  match: Match;
}) => {
  const champion = Object.values(allChampions).find(
    (c) => c.key === String(player.championId)
  );

  const kda = `${player.kills}/${player.deaths}/${player.assists}`;
  const kdaRatio =
    player.deaths === 0
      ? "Perfect"
      : ((player.kills + player.assists) / Math.max(1, player.deaths)).toFixed(
          2
        );

  const totalCs = player.totalMinionsKilled + player.neutralMinionsKilled;
  const csPerMin = (totalCs / (match.info.gameDuration / 60)).toFixed(1);

  const damagePercentage = (
    (player.totalDamageDealtToChampions /
      Math.max(
        ...match.info.participants.map((p) => p.totalDamageDealtToChampions)
      )) *
    100
  ).toFixed(1);

  return (
    <div className="bg-card p-4 rounded-lg space-y-3">
      {/* Player Header */}
      <div className="flex items-center gap-3">
        <Image
          src={config.riotApiChampionUrl.championSquareIconUrl(
            champion?.id || player.championName
          )}
          alt={champion?.id || player.championName}
          width={48}
          height={48}
          className="rounded-md"
        />
        <div>
          <h4 className="font-medium">{player.riotIdGameName}</h4>
          <p className="text-sm text-muted-foreground">{player.teamPosition}</p>
        </div>
      </div>

      {/* Combat Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <h5 className="text-sm font-medium">Combat</h5>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground">KDA: </span>
              <span
                className={cn({
                  "text-green-500": parseFloat(kdaRatio) >= 3,
                  "text-yellow-500":
                    parseFloat(kdaRatio) >= 2 && parseFloat(kdaRatio) < 3,
                  "text-red-500": parseFloat(kdaRatio) < 2,
                })}
              >
                {kda} ({kdaRatio})
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Damage: </span>
              <span>{player.totalDamageDealtToChampions.toLocaleString()}</span>
              <span className="text-muted-foreground">
                {" "}
                ({damagePercentage}%)
              </span>
            </div>
          </div>
        </div>

        {/* Vision Stats */}
        <div className="space-y-2">
          <h5 className="text-sm font-medium">Vision</h5>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground">Vision Score: </span>
              <span>{player.visionScore}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Wards: </span>
              <span>
                {player.wardsPlaced}/{player.wardsKilled}
              </span>
            </div>
          </div>
        </div>

        {/* CS Stats */}
        <div className="space-y-2">
          <h5 className="text-sm font-medium">Farming</h5>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground">CS: </span>
              <span>{totalCs}</span>
            </div>
            <div>
              <span className="text-muted-foreground">CS/min: </span>
              <span>{csPerMin}</span>
            </div>
          </div>
        </div>

        {/* Gold Stats */}
        <div className="space-y-2">
          <h5 className="text-sm font-medium">Gold</h5>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground">Total: </span>
              <span>{player.goldEarned.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Per min: </span>
              <span>
                {(player.goldEarned / (match.info.gameDuration / 60)).toFixed(
                  0
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="space-y-2">
        <h5 className="text-sm font-medium">Items</h5>
        <div className="flex gap-1">
          {[...Array(6)].map((_, i) => {
            const itemId = player[`item${i}` as keyof MatchParticipant];
            return itemId ? (
              <Image
                key={i}
                src={config.riotApiItemsUrl.itemIconUrl(itemId as string)}
                alt={`Item ${itemId}`}
                width={32}
                height={32}
                className="rounded-md"
              />
            ) : (
              <div key={i} className="w-8 h-8 rounded-md bg-muted" />
            );
          })}
        </div>
      </div>
    </div>
  );
};
