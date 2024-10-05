/*
 * MHSF, Minehut Server List
 * All external content is rather licensed under the ECA Agreement
 * located here: https://list.mlnehut.com/docs/legal/external-content-agreement
 *
 * All code under MHSF is licensed under the MIT License
 * by open source contributors
 *
 * Copyright (c) 2024 dvelo
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
