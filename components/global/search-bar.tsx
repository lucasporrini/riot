"use client";

import { REGION_MAP } from "@/lib/constantes";
import config from "@/lib/global.config";
import { useRiotDataStore } from "@/lib/store";
import Image from "next/image";
import Link from "next/link";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export const SearchBar = () => {
  const { defaultRegion } = useRiotDataStore();

  return (
    <div className="flex items-center w-full">
      <Select>
        <SelectTrigger className="h-8 text-xs px-2 py-1 border-none rounded-r-none bg-secondary ring-0 focus:ring-0 focus:ring-offset-0 min-w-32 max-w-32">
          <SelectValue
            placeholder={defaultRegion}
            defaultValue={defaultRegion}
          />
        </SelectTrigger>
        <SelectContent className="text-xs bg-background">
          {Object.entries(REGION_MAP).map(([key, value]) => (
            <SelectItem key={key} value={value} className="hover:bg-card">
              {key}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Popover>
        <PopoverTrigger>
          <Input
            className="h-8 text-xs px-2 py-1 bg-white rounded-l-none border-none ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 w-80"
            placeholder="Game name + tag"
          />
        </PopoverTrigger>
        <PopoverContent className="w-80 p-1 space-y-1">
          {[10, 21, 32, 43, 54].map((index) => (
            <ResultItem key={index} />
          ))}
        </PopoverContent>
      </Popover>
    </div>
  );
};

const ResultItem = () => {
  const { userData } = useRiotDataStore();

  return (
    <Link
      className="flex items-center justify-between p-1 rounded-md hover:bg-muted"
      href=""
    >
      <div className="flex items-center gap-2">
        <Image
          src={config.riotApiProfileIconsUrl.profileIconUrlById(
            userData?.profileIconId ?? 0
          )}
          alt="Profiles picture"
          width={20}
          height={20}
          className="size-10 bg-accent rounded-md"
        />
        <span>Player name</span>
      </div>
      <span>Rank</span>
    </Link>
  );
};
