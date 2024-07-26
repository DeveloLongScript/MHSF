"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { Spinner } from "../ui/spinner";

export default function TabServer({
  server,
  tabDef,
}: {
  server: string;
  tabDef: string;
}) {
  const [tab, setTab] = useState(tabDef);
  const [tabLoading, setTabLoading] = useState(false);

  return (
    <div className="w-full flex justify-center">
      <Tabs
        value={tab}
        onValueChange={(tac) => {
          setTab(tac);
          setTabLoading(true);
          if (tac == "historical")
            window.location.replace(`/server/${server}/historical-data`);
          if (tac == "general") window.location.replace(`/server/${server}`);
        }}
        className="w-[300px]"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="general"> General Information</TabsTrigger>
          <TabsTrigger value="historical">Historical Data</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
