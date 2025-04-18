import { getAllChampions } from "@/lib/actions/champions.actions";
import { ROLE_ORDER } from "@/lib/constantes";
import QUEUE_TYPE from "@/lib/datas/queues.json";
import {
  AllChampions,
  Match,
  MatchParticipant,
  Tabs as TabsType,
} from "@/lib/types";
import { formatGameDuration } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { EyeIcon } from "lucide-react";
import { useMemo } from "react";
import { Badge } from "../global/badge";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { GameTeamGraph } from "./game-team-graph";
import { GameUnwound } from "./game-unwound";

export const GameDetails = ({
  game,
  playerPerformance,
}: {
  game: Match;
  playerPerformance: MatchParticipant | undefined;
}) => {
  const queueType = useMemo(
    () => QUEUE_TYPE.find((queue) => queue.queueId === game.info.queueId),
    [game.info.queueId]
  );

  const { data: allChampions } = useQuery({
    queryKey: ["allChampions"],
    queryFn: async () => {
      const all = await getAllChampions();

      if (!all.ok) return null;

      return all.data.data;
    },
  });

  const blueTeam = useMemo(
    () =>
      game.info.participants
        .filter((p) => p.teamId === 100)
        .sort(
          (a, b) => ROLE_ORDER[a.teamPosition] - ROLE_ORDER[b.teamPosition]
        ),
    [game.info.participants]
  );

  const redTeam = useMemo(
    () =>
      game.info.participants
        .filter((p) => p.teamId === 200)
        .sort(
          (a, b) => ROLE_ORDER[a.teamPosition] - ROLE_ORDER[b.teamPosition]
        ),
    [game.info.participants]
  );

  if (!game) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline">
          <EyeIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[90%] overflow-y-scroll">
        <DialogTitle>
          <div className="flex items-center gap-2">
            <span>Game details</span>
            <Badge win={playerPerformance?.win} />
          </div>
        </DialogTitle>
        <DialogDescription>
          {queueType?.description} -{" "}
          {formatGameDuration(game?.info.gameDuration / 60)}
        </DialogDescription>

        <GameTabs
          match={game}
          allChampions={allChampions}
          blueTeam={blueTeam}
          redTeam={redTeam}
        />
      </DialogContent>
    </Dialog>
  );
};

const GameTabs = ({
  match,
  allChampions,
  blueTeam,
  redTeam,
}: {
  match: Match;
  allChampions: AllChampions;
  blueTeam: MatchParticipant[];
  redTeam: MatchParticipant[];
}) => {
  const GAME_DETAILS_TABS: TabsType[] = useMemo(
    () => [
      {
        label: "Details",
        value: "details",
        render: (
          <GameTeamGraph
            match={match}
            allChampions={allChampions}
            blueTeam={blueTeam}
            redTeam={redTeam}
          />
        ),
        default: true,
      },
      {
        label: "Unwound",
        value: "unwound",
        render: (
          <GameUnwound
            match={match}
            allChampions={allChampions}
            blueTeam={blueTeam}
            redTeam={redTeam}
          />
        ),
      },
    ],
    [allChampions, blueTeam, match, redTeam]
  );

  return (
    <Tabs
      defaultValue={GAME_DETAILS_TABS.find((tab) => tab.default)?.value}
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-2">
        {GAME_DETAILS_TABS.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value} className="max-w-md">
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {GAME_DETAILS_TABS.map((tab) => (
        <TabsContent key={tab.value} value={tab.value} className="h-full">
          {tab.render}
        </TabsContent>
      ))}
    </Tabs>
  );
};
