"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getUserDataByGameName } from "@/lib/actions/users";
import { useRiotDataStore } from "@/lib/store";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export const SearchBar = () => {
  const { userData, setUserData, defaultRegion } = useRiotDataStore();
  const router = useRouter();

  const [name, setName] = useState<string>("");
  const [gameName, setGameName] = useState<string>("");
  const [tagLine, setTagLine] = useState<string>("");

  const { refetch } = useQuery({
    queryKey: ["user-data", gameName, tagLine, defaultRegion],
    queryFn: async () => {
      if (!gameName || !tagLine) {
        return null;
      }

      const response = await getUserDataByGameName(gameName, tagLine, "EUROPE");

      console.log("response", response);

      if (!response.ok || !response.data) {
        toast.error("User not found");
        return null;
      }

      setUserData({
        ...userData,
        ...response.data,
      });

      router.push(`/profile/${response.data.puuid}`);

      return response.data;
    },
  });

  const handleSearch = () => {
    if (!name.includes("#")) {
      toast.warning("Please enter a valid name");
      return;
    }

    const [game, tag] = name.split("#");

    setGameName(game);
    setTagLine(tag);

    refetch();
  };

  return (
    <div className="flex items-center gap-2">
      <Input
        placeholder="Game name + tag"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />{" "}
      <Button variant="outline" disabled={!name} onClick={handleSearch}>
        Search
      </Button>
    </div>
  );
};
