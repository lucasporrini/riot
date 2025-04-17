import { GamesHistory } from "../games/games-history";
import { LeagueData } from "../rank/rank-data";

export const SummaryTab = () => {
  return (
    <div className="flex items-start gap-2">
      <LeagueData />
      <GamesHistory />
    </div>
  );
};
