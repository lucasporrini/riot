"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getUserDataByGameNameAndTagLine,
  getUserLeagueData,
  getUserSummonerData,
} from "@/lib/actions/users.actions";
import config from "@/lib/global.config";
import { useRiotDataStore } from "@/lib/store";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import Image from "next/image";
import { useEffect } from "react";
import { toast } from "sonner";

export const UserData = ({ user }: { user: string }) => {
  const { userData, setUserData, defaultRegion } = useRiotDataStore();

  const { refetch, isFetching } = useQuery({
    queryKey: ["user-data", user],
    queryFn: async () => {
      const decodedUser = decodeURIComponent(user);
      const parts = decodedUser.split("-");
      const tagLine = parts.pop() || "";
      const gameName = parts.join("-");

      const response = await getUserDataByGameNameAndTagLine(
        gameName,
        tagLine,
        "EUROPE"
      );

      if (!response.ok || !response.data) {
        toast.error("Impossible to fetch user data");
        return { ok: false, data: null };
      }

      const profileResponse = await getUserSummonerData(
        response.data.puuid,
        defaultRegion
      );

      const leagueResponse = await getUserLeagueData(
        userData.puuid,
        defaultRegion
      );

      if (!leagueResponse.ok || !leagueResponse.data) {
        setUserData({
          ...userData,
          ...response.data,
          ...profileResponse.data,
        });

        return response;
      }

      setUserData({
        ...userData,
        ...response.data,
        ...profileResponse.data,
        rank: [...leagueResponse.data],
      });
      return response;
    },
  });

  useEffect(() => {
    if (!userData?.puuid && user) {
      refetch();
    }
  }, [user, userData?.puuid, refetch]);

  if (!userData?.puuid || !userData?.gameName || !userData?.tagLine) {
    return <UserSkeleton />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="flex items-start gap-2">
        <div className="relative size-24 rounded-lg bg-gray-200">
          <Image
            src={config.riotApiProfileIconsUrl.profileIconUrlById(
              userData?.profileIconId ?? 0
            )}
            alt="Profile Icon"
            width={64}
            height={64}
            className="rounded-lg size-24"
          />
          <div className="bg-secondary absolute bottom-0 right-1/2 translate-x-1/2 translate-y-1/2 rounded-full px-2">
            <span className=" text-sm">{userData?.summonerLevel}</span>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <span className="font-semibold">{userData?.gameName}</span>
            <span className="text-secondary-foreground">
              #{userData?.tagLine}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-sm text-secondary-foreground">
              {defaultRegion.replace(/\d+/g, "")}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button size="sm" disabled={isFetching} onClick={() => refetch()}>
              {isFetching ? "Updating..." : "Update"}
            </Button>
            <Button size="sm" variant="outline" disabled={true}>
              To be implemented
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const UserSkeleton = () => {
  return (
    <div className="flex items-start gap-2">
      <Skeleton className="size-24 rounded-lg" />
      <div className="flex flex-col gap-1 flex-1">
        <div className="flex items-center gap-1">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-20" />
        </div>
        <div className="flex items-center gap-1">
          <Skeleton className="h-5 w-20" />
        </div>
        <div className="flex items-center gap-1">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-20" />
        </div>
      </div>
    </div>
  );
};
