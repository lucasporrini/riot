import { create } from "zustand";
import { Region, UserData } from "./types";

interface Store {
  userData: UserData;
  setUserData: (userData: UserData) => void;
  defaultRegion: Region;
  setDefaultRegion: (defaultRegion: Region) => void;
}

export const useRiotDataStore = create<Store>((set) => ({
  userData: {
    puuid: "",
    gameName: "",
    tagLine: "",
  },
  setUserData: (userData) => set({ userData }),
  defaultRegion: "EUW1",
  setDefaultRegion: (defaultRegion) => set({ defaultRegion }),
}));
