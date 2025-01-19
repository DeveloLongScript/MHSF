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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Badge } from "../ui/badge";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { ServerOff } from "lucide-react";

export function ShowInfo() {
  return (
    <div>
      <br />
      Choose a method:
      <Tabs defaultValue="preview" className="relative mr-auto w-full">
        <div className="flex items-center justify-between pb-3">
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
            <TabsTrigger
              value="coreboxx"
              className="relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              CoreBoxx <Badge className="ml-3">Recommended</Badge>
            </TabsTrigger>
            <TabsTrigger
              value="mhsfpv"
              className="relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              MHSFPV
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="coreboxx">
          <p>
            <Link href="/server/CoreBoxx" className="underline">
              CoreBoxx
            </Link>{" "}
            has partnered with us to have an integrated account linking feature,
            which is also open all day.
          </p>
          <br />
          <p className="py-1">
            <code className="border rounded-full bg-muted h-[1.75rem] w-[1.75rem] absolute inline-flex items-center justify-center">
              1
            </code>
            <span className="ml-[2.25rem] pt-0.5 grid grid-rows-2">
              <span>Join CoreBoxx</span>

              <code className="border rounded p-2">CoreBoxx.minehut.gg</code>
            </span>
          </p>
          <p className="py-1">
            <code className="border rounded-full bg-muted h-[1.75rem] w-[1.75rem] absolute inline-flex items-center justify-center">
              2
            </code>
            <span className="ml-[2.25rem] pt-0.5 grid">
              <span>
                Link your account using <code>/mhsf</code>
              </span>
            </span>
          </p>
          <p className="py-1">
            <code className="border rounded-full bg-muted h-[1.75rem] w-[1.75rem] absolute inline-flex items-center justify-center">
              3
            </code>
            <span className="ml-[2.25rem] pt-0.5 grid">
              <span>Input the code returned below</span>
            </span>
          </p>
        </TabsContent>
        <TabsContent value="mhsfpv">
          <Alert>
            <ServerOff className="h-4 w-4" />
            <AlertTitle>Server isn't online all day</AlertTitle>
            <AlertDescription>
              While joining MHSFPV, you may need to go into the lobby to start
              the server to then join.
            </AlertDescription>
          </Alert>
          <br />
          <p>
            MHSFPV is a Minehut server dedicated to linking your account on
            MHSF.
          </p>
          <br />
          <p className="py-1">
            <code className="border rounded-full bg-muted h-[1.75rem] w-[1.75rem] absolute inline-flex items-center justify-center">
              1
            </code>
            <span className="ml-[2.25rem] pt-0.5 grid grid-rows-2">
              <span>Join MHSFPV</span>

              <code className="border rounded p-2">MHSFPV.minehut.gg</code>
            </span>
          </p>
          <p className="py-1">
            <code className="border rounded-full bg-muted h-[1.75rem] w-[1.75rem] absolute inline-flex items-center justify-center">
              2
            </code>
            <span className="ml-[2.25rem] pt-0.5 grid">
              <span>Input the code in chat below</span>
            </span>
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
