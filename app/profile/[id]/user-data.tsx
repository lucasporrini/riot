"use client";

import { Loader } from "@/components/loader";
import { getUserDataByPuuid, getUserLeagueData } from "@/lib/actions/users";
import { useRiotDataStore } from "@/lib/store";
import { RequestResponse, UserData as UserDataType } from "@/lib/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const UserData = ({ userId }: { userId: string }) => {
  const { userData, setUserData } = useRiotDataStore();
  const router = useRouter();

  const { data: userLeagueData, refetch: refetchLeagueData } = useQuery({
    queryKey: ["userLeagueData", userData?.puuid],
    queryFn: () => getUserLeagueData(userData?.puuid || "", "EUROPE"),
    enabled: !!userData?.puuid,
  });

  const mutation = useMutation({
    mutationFn: () => getUserDataByPuuid(userId, "EUROPE"),
    onSuccess: (data: RequestResponse<UserDataType | null>) => {
      if (!data.ok || !data.data) {
        router.push("/");
        return;
      }

      setUserData(data.data);
    },
  });

  useEffect(() => {
    if (!userData?.puuid && userId) {
      mutation.mutate();
    }
  }, [userId, userData?.puuid, mutation]);

  useEffect(() => {
    if (userData?.puuid) {
      refetchLeagueData();
    }
  }, [userData?.puuid, refetchLeagueData]);

  if (!userData?.puuid || !userData?.gameName || !userData?.tagLine) {
    return <Loader />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="flex items-center gap-1">
        <span className="font-semibold">{userData?.gameName}</span>
        <span className="text-gray-500">#{userData?.tagLine}</span>
      </div>
      {userLeagueData?.data && (
        <div className="flex items-center">
          <span>{userLeagueData?.data?.[0]?.tier}</span>
          <span>{userLeagueData?.data?.[0]?.rank}</span>
        </div>
      )}
    </motion.div>
  );
};
