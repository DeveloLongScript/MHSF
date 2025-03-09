/*
 * MHSF, Minehut Server List
 *
 * All code under MHSF is licensed under the MIT License
 * by open source contributors
 *
 * Copyright (c) 2025 dvelo
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

"use client";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { useRouter } from "@/lib/useRouter";
import { CornerDownLeft, Database, Home, Paintbrush } from "lucide-react";

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
    <div className="w-full px-4">
      <Tabs
        value={tab}
        onValueChange={(tac) => {
          setTab(tac);
          if (tac == "customize") router.push(`/server/${server}/customize`);
          if (tac == "statistics") router.push(`/server/${server}/statistics`);
          if (tac == "general") router.push(`/server/${server}`);
          if (tac == "server-list") router.push("/");
        }}
      >
        <TabsList className="border-b bg-transparent p-0 rounded-none w-full justify-start">
          <TabsTrigger
            value="general"
            className="relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
          >
            {" "}
            <div className="max-sm:hidden">General Information</div>
            <Home className="sm:hidden" size={18} />
          </TabsTrigger>
          <TabsTrigger
            value="statistics"
            className="relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
          >
            <div className="max-sm:hidden">Statistics</div>
            <Database className="sm:hidden" size={18} />
          </TabsTrigger>
          <TabsTrigger
            value="customize"
            className="relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
          >
            <div className="max-sm:hidden">Customization</div>
            <Paintbrush className="sm:hidden" size={18} />
          </TabsTrigger>

          <TabsTrigger
            value="server-list"
            className="relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
          >
            <CornerDownLeft size={16} className="mr-2" />
            <div className="max-sm:hidden">Back to server list</div>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
