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

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "../ui/badge";
import { allCategories, allTags } from "@/config/tags";

export function FilterMenu({
  serverSizeChangerCallback,
  serverSizeChangerValueCallback,
  templateFilter,
  tagChangerValueCallback,
  tagChangerCallback,
  categoryChangerCallback,
  categoryChangerValueCallback,
  children,
}: {
  children: React.ReactNode;
  serverSizeChangerCallback: any;
  serverSizeChangerValueCallback: any;
  templateFilter: any;
  tagChangerValueCallback: any;
  tagChangerCallback: any;
  categoryChangerCallback: any;
  categoryChangerValueCallback: any;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent className="max-h-[400px] overflow-auto">
        <DropdownMenuRadioGroup
          onValueChange={serverSizeChangerCallback}
          value={serverSizeChangerValueCallback()}
        >
          <DropdownMenuRadioItem value="smaller">
            <div className="block">
              Only allow smaller servers
              <br />
              <span className="text-sm text-muted-foreground">
                Only allow servers that have the player range 7-15, and cannot{" "}
                <br />
                be Always Online.
              </span>
            </div>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="bigger">
            <div className="block">
              Only allow bigger servers
              <br />
              <span className="text-sm text-muted-foreground">
                Only allow servers with more than 15 players.
              </span>
            </div>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="none">
            No/custom requirements
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <span className="text-sm text-muted-foreground ml-2">Tags</span>
        </DropdownMenuSub>
        {allTags.map((tag) => (
          <div key={tag.docsName}>
            {tag.docsName && tag.__filter == undefined && (
              <DropdownMenuCheckboxItem
                disabled={templateFilter && tag.__disab != undefined}
                id={tag.docsName}
                checked={tagChangerValueCallback(tag)}
                onCheckedChange={tagChangerCallback(tag)}
              >
                <Badge variant={tag.role} className="mr-1">
                  {tag.docsName}
                </Badge>
              </DropdownMenuCheckboxItem>
            )}
          </div>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <span className="text-sm text-muted-foreground ml-2">Categories</span>
        </DropdownMenuSub>
        {allCategories.map((categorie) => (
          <DropdownMenuCheckboxItem
            id={categorie.name}
            key={categorie.name}
            onCheckedChange={categoryChangerCallback(categorie)}
            checked={categoryChangerValueCallback(categorie)}
          >
            <Badge variant={categorie.role} className="mr-1">
              {categorie.name}
            </Badge>
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
