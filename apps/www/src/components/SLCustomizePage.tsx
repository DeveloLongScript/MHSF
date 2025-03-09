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

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Switch } from "./ui/switch";
import { setAccountSL } from "@/lib/api";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";

export function SLCustomize() {
  const [padding, setPadding] = useState("0");
  const [itemsPerRow, setItemsPerRow] = useState("4");
  const [usePaddingOnSides, setUsePaddingOnSides] = useState(false);
  const [advanced, setAdvanced] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    setItemsPerRow((user?.publicMetadata.ipr as string | undefined) || "4");
    setPadding((user?.publicMetadata.pad as string | undefined) || "0");
    setUsePaddingOnSides(
      (user?.publicMetadata.srv as boolean | undefined) || false
    );
  }, [
    user?.publicMetadata.srv,
    user?.publicMetadata.pad,
    user?.publicMetadata.ipr,
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (padding) setAccountSL(Number(padding), "pad");
    if (usePaddingOnSides) setAccountSL(usePaddingOnSides, "srv");
    if (itemsPerRow) setAccountSL(Number(itemsPerRow), "ipr");
    toast.success("Set account preferences");
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Server Display Settings</CardTitle>
              <CardDescription className="pt-2">
                Customize how servers are displayed in the list
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="advanced-mode"
                checked={advanced}
                onCheckedChange={setAdvanced}
              />
              <Label htmlFor="advanced-mode">Advanced Mode</Label>
            </div>
          </div>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Padding of servers</h3>
              <p className="text-sm text-muted-foreground">
                Adjust the spacing between server items in the list.
              </p>
              <RadioGroup value={padding} onValueChange={setPadding}>
                <div className="flex items-center space-x-2 mt-2">
                  <RadioGroupItem value="0" id="padding-normal" />
                  <Label htmlFor="padding-normal">
                    Normal{" "}
                    {advanced && (
                      <span className="text-muted-foreground">(0px)</span>
                    )}
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground ml-6">
                  Standard spacing, balanced appearance.
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  <RadioGroupItem value="15" id="padding-relaxed" />
                  <Label htmlFor="padding-normal">
                    Relaxed{" "}
                    {advanced && (
                      <span className="text-muted-foreground">(15px)</span>
                    )}
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground ml-6">
                  More spacious, easier to distinguish between servers.
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  <RadioGroupItem value="40" id="padding-comfortable" />
                  <Label htmlFor="padding-comfortable">
                    Comfortable{" "}
                    {advanced && (
                      <span className="text-muted-foreground">(40px)</span>
                    )}
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground ml-6">
                  Better for larger screens, can look more stylish.
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  <RadioGroupItem value="120" id="padding-comfortable" />
                  <Label htmlFor="padding-comfortable">
                    Very Spacious{" "}
                    {advanced && (
                      <span className="text-muted-foreground">(120px)</span>
                    )}
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground ml-6">
                  When information needs to be crunched in-between, recommended
                  for larger screens only.
                </p>
              </RadioGroup>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Items per row</h3>
              <p className="text-sm text-muted-foreground">
                Set how many server items appear in each row of the list.
              </p>
              <RadioGroup value={itemsPerRow} onValueChange={setItemsPerRow}>
                <div className="flex items-center space-x-2 mt-2">
                  <RadioGroupItem value="4" id="items-4" />
                  <Label htmlFor="items-4">
                    4 items{" "}
                    {advanced && (
                      <span className="text-muted-foreground">per row</span>
                    )}
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground ml-6">
                  Balanced size and quantity, suitable for most screens.
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  <RadioGroupItem value="5" id="items-5" />
                  <Label htmlFor="items-5">
                    5 items{" "}
                    {advanced && (
                      <span className="text-muted-foreground">per row</span>
                    )}
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground ml-6">
                  More compact view, fit more servers on screen.
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  <RadioGroupItem value="6" id="items-6" />
                  <Label htmlFor="items-6">
                    6 items{" "}
                    {advanced && (
                      <span className="text-muted-foreground">per row</span>
                    )}
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground ml-6">
                  Great for monitors/screens with more space.
                </p>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="use-padding-sides"
                  checked={usePaddingOnSides}
                  onCheckedChange={(checked) =>
                    setUsePaddingOnSides(checked as boolean)
                  }
                />
                <Label
                  htmlFor="use-padding-sides"
                  className="text-sm font-medium"
                >
                  Use padding on the sides of only the servers, not the whole
                  server list
                </Label>
              </div>
              <p className="text-sm text-muted-foreground ml-6">
                When enabled, applies padding to individual server items instead
                of the entire list container. This can create a more distinct
                separation between servers.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit">Save Settings</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
