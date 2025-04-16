"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getUserDataByGameName } from "@/lib/actions/users";
import { useRiotDataStore } from "@/lib/store";
import { RequestResponse, UserData } from "@/lib/types";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export const SearchBar = () => {
  const [name, setName] = useState<string>("");
  const { setUserData } = useRiotDataStore();
  const router = useRouter();

  const [gameName, setGameName] = useState<string>("");
  const [tagLine, setTagLine] = useState<string>("");

  const mutation = useMutation({
    mutationFn: () => getUserDataByGameName(gameName, tagLine, "EUROPE"),
    onSuccess: (data: RequestResponse<UserData | null>) => {
      if (!data.ok || !data.data) {
        toast.error("User not found");
        return;
      }

      setUserData(data.data);
      router.push(`/profile/${data.data.puuid}`);
    },
    onError: () => {
      toast.error("Error fetching user data");
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
    toast.info(`Searching for ${game}#${tag}`);
    mutation.mutate();
  };

  return (
    <div className="flex items-center gap-2">
      <Input
        placeholder="gameName"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />{" "}
      <Button variant="reverse" onClick={handleSearch}>
        Search
      </Button>
    </div>
  );
};
