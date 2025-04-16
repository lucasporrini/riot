import { create } from "zustand";
import { Region, UserStore } from "./types";

interface Store {
  userData: UserStore;
  setUserData: (userData: UserStore) => void;
  defaultRegion: Region;
  setDefaultRegion: (defaultRegion: Region) => void;
}

export const useRiotDataStore = create<Store>((set) => ({
  userData: {
    puuid: "",
    gameName: "",
    tagLine: "",
    rank: [],
  },
  setUserData: (userData) => set({ userData }),
  defaultRegion: "EUW",
  setDefaultRegion: (defaultRegion) => set({ defaultRegion }),
}));
