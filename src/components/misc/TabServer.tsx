"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { Spinner } from "../ui/spinner";
import { useRouter } from '@/lib/useRouter'

export default function TabServer({
  server,
  tabDef,
}: {
  server: string;
  tabDef: string;
}) {
  const [tab, setTab] = useState(tabDef);
  const [tabLoading, setTabLoading] = useState(false);
  const router = useRouter()

  return (
    <div className="w-full flex justify-center">
      <Tabs
        value={tab}
        onValueChange={(tac) => {
          setTab(tac);
          setTabLoading(true);
          if (tac == "historical")
            router.push(`/server/${server}/short-term`);
          if (tac == "general") router.push(`/server/${server}`);
        }}
        className="w-[300px]"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="general"> General Information</TabsTrigger>
          <TabsTrigger value="historical">Short Term</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
