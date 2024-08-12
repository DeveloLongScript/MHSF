"use client";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
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
  const router = useRouter();

  return (
    <div className="w-full flex justify-center">
      <Tabs
        value={tab}
        onValueChange={(tac) => {
          setTab(tac);
          if (tac == "customize") router.push(`/server/${server}/customize`);
          if (tac == "statistics") router.push(`/server/${server}/statistics`);
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
          <TabsTrigger value="statistics">
            <div className="max-sm:hidden">Statistics</div>
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
