/*
 * MHSF, Minehut Server List
 * All external content is rather licensed under the ECA Agreement
 * located here: https://mhsf.app/docs/legal/external-content-agreement
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

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChevronDown,
  Dices,
  ListRestart,
  MoreVertical,
  Search,
  SquareTerminal,
} from "lucide-react";
import { FilterMenu } from "./FilterMenu";
import { DisplaySettings } from "./DisplaySettings";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import events from "@/lib/commandEvent";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export default function ServerListInterface({
  linksProps,
  viewProps,
  refreshCallback,
  pickRandomServerCallback,
}: {
  linksProps: {
    serverSizeChangerCallback: any;
    serverSizeChangerValueCallback: any;
    templateFilter: any;
    tagChangerValueCallback: any;
    tagChangerCallback: any;
    categoryChangerCallback: any;
    categoryChangerValueCallback: any;
  };
  viewProps: {
    setPresentationMode: any;
    presentationMode: any;
    selectedProperties: any;
    setSelectedProperties: any;
    hero: any;
    setHero: any;
    iprChangerCallback: any;
    ipr: any;
    am: any;
    padding: any;
    paddingChangerCallback: any;
  };
  refreshCallback: any;
  pickRandomServerCallback: any;
}) {
  return (
    <div className="w-full mt-6">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-between gap-2 sm:gap-8">
        <div className="grid grid-cols-2 sm:flex sm:flex-row items-stretch sm:items-center gap-2">
          <FilterMenu {...linksProps}>
            <Button variant="outline" className="w-full gap-2">
              Filter
              <ChevronDown className="h-4 w-4" />
            </Button>
          </FilterMenu>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full gap-2">
                Display
                <ChevronDown className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0">
              <DisplaySettings {...viewProps} />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-8"
              value=""
              onClick={(c) => {
                c.preventDefault();
                events.emit("search-request-event");
              }}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="shrink-0">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                className="dark:text-white py-2"
                onSelect={refreshCallback}
              >
                <ListRestart />
                Reload Servers
              </DropdownMenuItem>
              <DropdownMenuItem
                className="dark:text-white py-2"
                onSelect={pickRandomServerCallback}
              >
                <Dices />
                Pick Random Server
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="dark:text-white py-2"
                onSelect={() => events.emit("cmd-event")}
              >
                <SquareTerminal />
                Show Command Bar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
