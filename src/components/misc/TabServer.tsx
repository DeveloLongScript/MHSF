"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { Spinner } from "../ui/spinner";
import { useRouter } from "@/lib/useRouter";
import { Database, Home, Paintbrush } from "lucide-react";

export default function TabServer({
  server,
  tabDef,
}: {
  server: string;
  tabDef: string;
}) {
  const [tab, setTab] = useState(tabDef);
  const [tabLoading, setTabLoading] = useState(false);
  const router = useRouter();

  return (
    <div className="w-full flex justify-center">
      <Tabs
        value={tab}
        onValueChange={(tac) => {
          setTab(tac);
          setTabLoading(true);
          if (tac == "customize") router.push(`/server/${server}/customize`);
          if (tac == "historical") router.push(`/server/${server}/short-term`);
          if (tac == "general") router.push(`/server/${server}`);
        }}
        className="sm:w-[500px] max-sm:w-[200px]"
      >
        <TabsList className="grid w-full grid-cols-3 max-sm:min-h-[50px]">
          <TabsTrigger value="general" className="">
            {" "}
            <div className="max-sm:hidden">General Information</div>
            <Home className="sm:hidden" size={18} />
          </TabsTrigger>
          <TabsTrigger value="historical">
            <div className="max-sm:hidden">Short Term</div>
            <Database className="sm:hidden" size={18} />
          </TabsTrigger>
          <TabsTrigger value="customize">
            <div className="max-sm:hidden">Customization</div>
            <Paintbrush className="sm:hidden" size={18} />
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
