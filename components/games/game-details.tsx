import { Match, MatchParticipant } from "@/lib/types";
import { cn } from "@/lib/utils";
import { EyeIcon } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

export const GameDetails = ({
  game,
  playerPerformance,
}: {
  game: Match | null;
  playerPerformance: MatchParticipant | undefined;
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon">
          <EyeIcon />
        </Button>
      </DialogTrigger>
      <DialogContent
        className={cn(
          playerPerformance?.win ? "border-green-400" : "border-red-400"
        )}
      >
        <DialogTitle>Game details</DialogTitle>
        <DialogDescription>Game description</DialogDescription>
        <span>IND.POS: {playerPerformance?.individualPosition}</span>
        <span>LANE: {playerPerformance?.lane}</span>
        <span>ROLE: {playerPerformance?.role}</span>
        <span>TEAM.POS: {playerPerformance?.teamPosition}</span>
        <span>------------------</span>
        <span>GAME MODE: {game?.info.gameMode}</span>
      </DialogContent>
    </Dialog>
  );
};
