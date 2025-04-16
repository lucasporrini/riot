import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TABS } from "@/lib/constantes";

export const DataTabs = () => {
  return (
    <Tabs
      defaultValue={TABS.find((tab) => tab.default)?.value}
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-3">
        {TABS.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value} className="max-w-md">
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {TABS.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          {tab.render}
        </TabsContent>
      ))}
    </Tabs>
  );
};
