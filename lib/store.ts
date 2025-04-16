import { create } from "zustand";
import { UserData } from "./types";

interface Store {
  userData: UserData;
  setUserData: (userData: UserData) => void;
}

export const useRiotDataStore = create<Store>((set) => ({
  userData: {
    puuid: "",
    gameName: "",
    tagLine: "",
  },
  setUserData: (userData) => set({ userData }),
}));
