import { ChampionsTab } from "@/components/tabs/champions-tab";
import { MasteriesTab } from "@/components/tabs/masteries-tab";
import { SummaryTab } from "@/components/tabs/summary-tab";
import { Region, Tabs } from "./types";

export const API_VERSION = "15.8.1";

export const REGION_MAP: Record<Region, string> = {
  ASIA: "asia",
  EUROPE: "europe",
  AMERICAS: "americas",
  EUW: "euw1",
};

export const TABS: Tabs[] = [
  {
    label: "Summary",
    value: "summary",
    render: <SummaryTab />,
    default: true,
  },
  {
    label: "Champions",
    value: "champions",
    render: <ChampionsTab />,
  },
  {
    label: "Masteries",
    value: "masteries",
    render: <MasteriesTab />,
  },
];
