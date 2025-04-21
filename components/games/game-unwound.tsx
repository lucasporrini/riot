import config from "@/lib/global.config";
import { AllChampions, Match, MatchParticipant } from "@/lib/types";
import { cn, getChampionFromAllChampions } from "@/lib/utils";
import { ChevronDownIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useCallback, useState } from "react";
import { TotalData } from "./game-team-graph";
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
            team="blue"
          />
        ))}
      </div>

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
            team="red"
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
  team,
}: {
  player: MatchParticipant;
  allChampions: AllChampions;
  match: Match;
  team: "blue" | "red";
}) => {
  const [isPlayerDetailsOpen, setIsPlayerDetailsOpen] = useState(false);

  const champion = getChampionFromAllChampions(allChampions, player.championId);

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

  const handleClick = useCallback(() => {
    setIsPlayerDetailsOpen(!isPlayerDetailsOpen);
  }, [isPlayerDetailsOpen]);

  return (
    <motion.div
      transition={{
        layout: {
          duration: 0.2,
          type: "spring",
          bounce: 0,
        },
      }}
      className="bg-card p-4 overflow-hidden space-y-3 relative rounded-md hover:bg-muted/50"
      onClick={handleClick}
    >
      <div
        className={cn(
          "absolute top-0 left-0 w-2 h-full",
          team === "blue" ? "bg-blue-500" : "bg-red-500"
        )}
      />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 w-full">
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
            <p className="text-sm text-muted-foreground">
              {player.teamPosition}
            </p>
          </div>
        </div>

        <div className="flex justify-between">
          <div className="flex gap-1 w-60">
            {[...Array(6)].map((_, i) => {
              const itemId = player[`item${i}` as keyof MatchParticipant];
              return itemId ? (
                <Image
                  key={i}
                  src={config.riotApiItemsUrl.itemIconUrl(itemId as string)}
                  alt={`Item ${itemId}`}
                  width={32}
                  height={32}
                  className="rounded-md w-8 h-8"
                />
              ) : (
                <div key={i} className="w-8 h-8 rounded-md bg-muted" />
              );
            })}
          </div>

          <div className="flex items-center justify-between gap-3 w-60">
            <div className="flex items-center gap-1">
              <TotalData type="gold" totalGold={player.goldEarned} />
              <span className="text-muted-foreground text-xs">
                (
                {((player.goldEarned / match.info.gameDuration) * 60).toFixed(
                  0
                )}
                /min)
              </span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <TotalData type="kill" totalGold={kda} />
              <span
                className={cn("text-muted-foreground text-xs", {
                  "text-green-500": parseFloat(kdaRatio) >= 3,
                  "text-yellow-500":
                    parseFloat(kdaRatio) >= 2 && parseFloat(kdaRatio) < 3,
                  "text-red-500": parseFloat(kdaRatio) < 2,
                })}
              >
                ({kdaRatio})
              </span>
            </div>
          </div>
          <motion.div
            animate={{ rotate: isPlayerDetailsOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center w-8 h-8"
          >
            <ChevronDownIcon className="w-4 h-4" />
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {isPlayerDetailsOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="space-y-2">
              <h5 className="text-sm font-medium">Combat</h5>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Damage: </span>
                  <span>
                    {player.totalDamageDealtToChampions.toLocaleString()}
                  </span>
                  <span className="text-muted-foreground">
                    {" "}
                    ({damagePercentage}%)
                  </span>
                </div>
              </div>
            </div>

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
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
