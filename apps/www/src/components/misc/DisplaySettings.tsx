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
import { CircleAlert, LayoutGrid, List, Phone } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Select } from "@radix-ui/react-select";
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { SignedIn } from "@clerk/nextjs";

export function DisplaySettings({
  presentationMode,
  setPresentationMode,
  selectedProperties,
  setSelectedProperties,
  hero,
  setHero,
  ipr,
  am,
  iprChangerCallback,
  padding,
  paddingChangerCallback,
}: any) {
  const toggleProperty = (property: string) => {
    setSelectedProperties((prev: any) =>
      prev.includes(property)
        ? prev.filter((p: any) => p !== property)
        : [...prev, property]
    );
  };

  return (
    <div className="w-full space-y-6 bg-background">
      <Tabs
        defaultValue="cards"
        className="w-full"
        onValueChange={setPresentationMode}
        value={presentationMode}
      >
        <div className="border-b">
          <TabsList className="grid w-full grid-cols-2 bg-background p-0">
            <TabsTrigger
              value="grid"
              className="flex items-center gap-2 py-2.5 px-4 data-[state=active]:bg-background data-[state=active]:shadow-none rounded-none border-r"
            >
              <LayoutGrid className="h-4 w-4" />
              Grid
            </TabsTrigger>
            <TabsTrigger
              value="table"
              className="flex items-center gap-2 py-2.5 px-4 data-[state=active]:bg-background data-[state=active]:shadow-none rounded-none"
            >
              <List className="h-4 w-4" />
              Table
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="grid" className="space-y-6 mt-0 ">
          <SignedIn>
            <div className="flex items-center justify-between pt-5 pb-1 p-4">
              <Label htmlFor="set-hero" className="font-normal">
                Show hero at the top of the page
              </Label>
              <Switch id="set-hero" value={hero} onCheckedChange={setHero} />
            </div>
          </SignedIn>

          <Separator />

          <div
            className={
              "flex items-center justify-between py-1 " +
              (am ? "border border-orange-500 rounded px-2 mx-2" : "mx-4")
            }
          >
            <Label
              htmlFor="grid-columns"
              className="font-normal flex items-center"
            >
              {am && (
                <Tooltip>
                  <TooltipTrigger>
                    <CircleAlert size={16} className="mr-2 text-orange-500" />
                  </TooltipTrigger>
                  <TooltipContent>
                    If you change this setting, it will take priority over your{" "}
                    <br />
                    account settings. These settings will not save over reloads.
                  </TooltipContent>
                </Tooltip>
              )}
              Grid items p/ row
            </Label>
            <Select value={ipr} onValueChange={iprChangerCallback}>
              <SelectTrigger className="w-[125px]">
                <SelectValue placeholder="" id="grid-columns" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="4">4 items</SelectItem>
                  <SelectItem value="5">5 items</SelectItem>
                  <SelectItem value="6">6 items</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div
            className={
              "flex items-center justify-between py-1 " +
              (am ? "border border-orange-500 rounded px-2 mx-2" : "mx-4")
            }
          >
            <Label htmlFor="padding" className="font-normal flex items-center">
              {am && (
                <Tooltip>
                  <TooltipTrigger>
                    <CircleAlert size={16} className="mr-2 text-orange-500" />
                  </TooltipTrigger>
                  <TooltipContent>
                    If you change this setting, it will take priority over your{" "}
                    <br />
                    account settings. These settings will not save over reloads.
                  </TooltipContent>
                </Tooltip>
              )}
              Padding
            </Label>
            <Select
              value={padding.toString()}
              onValueChange={paddingChangerCallback}
            >
              <SelectTrigger className="w-[125px]">
                <SelectValue placeholder="" id="padding" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="0">Default</SelectItem>
                  <SelectSeparator />
                  <SelectItem value="15">15px</SelectItem>
                  <SelectItem value="30">30px</SelectItem>
                  <SelectItem value="40">40px</SelectItem>
                  <SelectItem value="60">60px</SelectItem>
                  <SelectItem value="100">100px</SelectItem>
                  <SelectItem value="200">200px</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="space-y-4 pt-1 p-4">
            <h3 className="text-xs uppercase text-gray-500">
              Display Properties
            </h3>
            <div className="flex flex-wrap gap-2">
              {["Author", "MOTD", "Tags", "Players Online", "Actions"].map(
                (property) => (
                  <button
                    key={property}
                    onClick={() => toggleProperty(property)}
                    className={cn(
                      "px-3 py-1.5 text-sm rounded-md transition-colors",
                      selectedProperties.includes(property)
                        ? "bg-secondary text-secondary-foreground border"
                        : "hover:bg-muted/80"
                    )}
                  >
                    {property}
                  </button>
                )
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="table" className="mt-0 px-4 my-4">
          <Alert className="md:hidden">
            <Phone className="h-4 w-4" />
            <AlertTitle>Table mode isn't optimized for mobile</AlertTitle>
            <AlertDescription>
              At this time, we do not recommend using table mode on mobile.
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>
    </div>
  );
}
