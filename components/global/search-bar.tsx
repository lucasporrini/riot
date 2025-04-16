"use client";

import { RegionMap } from "@/lib/constantes";
import { useRiotDataStore } from "@/lib/store";
import { Input } from "../ui/input";
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
          {Object.entries(RegionMap).map(([key, value]) => (
            <SelectItem key={key} value={value} className="hover:bg-card">
              {key}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        className="h-8 text-xs px-2 py-1 bg-white rounded-l-none border-none ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 w-80"
        placeholder="Game name + tag"
      />
    </div>
  );
};
