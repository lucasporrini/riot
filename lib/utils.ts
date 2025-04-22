import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { AllChampions, Match, MatchParticipant, TeamPosition } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Utility function to combine class names with Tailwind CSS
 * @param inputs - Array of class values to be merged
 * @returns A string of combined and de-duplicated class names
 *
 * This function uses clsx to combine multiple class names and
 * tailwind-merge to handle Tailwind CSS class conflicts.
 *
 * Example:
 * ```
 * cn("text-red-500", "bg-blue-200", isActive && "font-bold")
 * ```
 */
export const formatGameDuration = (minutes: number): string => {
  const totalMinutes = Math.floor(minutes);
  const seconds = Math.round((minutes - totalMinutes) * 60);

  return `${totalMinutes}:${seconds.toString().padStart(2, "0")}`;
};

/**
 * Get the common role from riot API naming
 * @param role - The riot role
 * @returns A common role
 *
 * Example:
 * ```
 * getRole("UTILITY") // returns "SUPPORT"
 * ```
 */
export const getRole = (role: TeamPosition): string => {
  switch (role) {
    case "TOP":
      return "TOP";
    case "JUNGLE":
      return "JUNGLE";
    case "MIDDLE":
      return "MID";
    case "BOTTOM":
      return "ADC";
    case "UTILITY":
      return "SUPPORT";
    default:
      return "-";
  }
};

/**
 * Determines if a match result is a win or loss
 * @param win - Boolean indicating whether the match was won
 * @returns "Victory" if true, "Defeat" if false
 *
 * Example:
 * ```
 * isWinner(true) // returns "Victory"
 * isWinner(false) // returns "Defeat"
 * ```
 */
export const isWinner = (win: boolean) => (win ? "Victory" : "Defeat");

/**
 * Get the champion data from the all champions
 * @param allChampions - The all champions
 * @param championId - The champion id
 * @returns The champion data
 */
export const getChampionFromAllChampions = (
  allChampions: AllChampions,
  championId: number
) => Object.values(allChampions).find((c) => c.key == championId);

export const roleIconPath = (
  game: Match | null,
  playerPerformance: MatchParticipant
) => {
  if (game?.info.gameMode === "CHERRY") return "/roles/Role=Top.svg";

  let path: string;

  switch (playerPerformance?.teamPosition) {
    case "SUPPORT":
    case "UTILITY":
      path = "/roles/Role=Support.svg";
      break;
    case "BOTTOM":
      path = "/roles/Role=Bot.svg";
      break;
    case "TOP":
      path = "/roles/Role=Top.svg";
      break;
    case "MIDDLE":
      path = "/roles/Role=Mid.svg";
      break;
    case "JUNGLE":
      path = "/roles/Role=Jungle.svg";
      break;
    default:
      path = "/roles/Role=Top.svg";
      break;
  }

  return path;
};
