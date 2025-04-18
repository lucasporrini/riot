import { cn } from "@/lib/utils";

export const Badge = ({
  win = false,
  className,
  children,
}: {
  win: boolean | undefined;
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "text-xs px-1 py-0.5 rounded-md text-white font-semibold",
        win ? "bg-green-700 dark:bg-green-800" : "bg-red-700 dark:bg-red-800",
        className
      )}
    >
      {children ? children : win ? "Victory" : "Defeat"}
    </div>
  );
};
