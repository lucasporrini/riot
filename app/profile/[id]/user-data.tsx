"use client";

import { Loader } from "@/components/loader";
import { getUserDataByPuuid, getUserSummonerData } from "@/lib/actions/users";
import config from "@/lib/global.config";
import { useRiotDataStore } from "@/lib/store";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const UserData = ({ userId }: { userId: string }) => {
  const { userData, setUserData, defaultRegion } = useRiotDataStore();
  const router = useRouter();

  const { refetch } = useQuery({
    queryKey: ["user-data", userId],
    queryFn: async () => {
      const response = await getUserDataByPuuid(userId, "EUROPE");

      console.log("response", response);

      if (!response.ok || !response.data) {
        router.push("/");
        return { ok: false, data: null };
      }

      const profileResponse = await getUserSummonerData(
        response.data.puuid,
        defaultRegion
      );

      console.log("profileResponse", profileResponse);

      setUserData({
        ...userData,
        ...response.data,
        ...profileResponse.data,
      });

      return response;
    },
  });

  useEffect(() => {
    if (!userData?.puuid && userId) {
      refetch();
    }
  }, [userId, userData?.puuid, refetch]);

  if (!userData?.puuid || !userData?.gameName || !userData?.tagLine) {
    return <Loader />;
  }

  console.log("userData", userData);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="flex items-start gap-2">
        <div className="w-16 h-16 rounded-lg bg-gray-200 overflow-hidden">
          <Image
            src={config.riotApiProfileIconsUrl.profileIconUrlById(
              userData?.profileIconId ?? 0
            )}
            alt="Profile Icon"
            width={64}
            height={64}
          />
        </div>
        <div className="flex items-center gap-1">
          <span className="font-semibold">{userData?.gameName}</span>
          <span className="text-gray-500">#{userData?.tagLine}</span>
        </div>
      </div>
    </motion.div>
  );
};
