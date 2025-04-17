import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
