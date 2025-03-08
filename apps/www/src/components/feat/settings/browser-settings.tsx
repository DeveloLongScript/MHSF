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

import { Material } from "@/components/ui/material";
import {
  Setting,
  SettingContent,
  SettingDescription,
  SettingMeta,
  SettingTitle,
} from "./setting";
import { ModeToggle } from "@/components/util/mode-toggle";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { useSettingsStore } from "@/lib/hooks/use-settings-store";
import { Switch } from "@/components/ui/switch";

export function BrowserSettings() {
  const settingsStore = useSettingsStore();
  const [fontFamily, setFontFamily] = useState("inter");
  const [mcFont, setMcFont] = useState(true);

  useEffect(() => {
    setFontFamily((settingsStore.get("font-family") ?? "inter") as string);
    setMcFont((settingsStore.get("mc-font") === "true") as boolean);
  }, []);

  return (
    <Material className="mt-6 grid gap-4">
      <h2 className="text-xl font-semibold text-inherit">Appearance</h2>
      <Setting>
        <SettingContent>
          <SettingMeta>
            <SettingTitle>Color Scheme</SettingTitle>
            <SettingDescription>
              Change the MHSF color scheme
            </SettingDescription>
          </SettingMeta>
          <ModeToggle />
        </SettingContent>
      </Setting>
      <Setting>
        <SettingContent>
          <SettingMeta>
            <SettingTitle>Use Minecraft font</SettingTitle>
            <SettingDescription>
              Use Minecraft font for MOTD. Turning this off restores font
              settings for MOTD's to a v1-like state.
            </SettingDescription>
          </SettingMeta>
          <Switch
            checked={mcFont}
            onCheckedChange={(c) => {
              settingsStore.set("mc-font", c, false);
              setMcFont(c);
            }}
          />
        </SettingContent>
      </Setting>
      <Setting>
        <SettingContent>
          <SettingMeta>
            <SettingTitle>Font</SettingTitle>
            <SettingDescription>
              Change the default font used in the interface.
            </SettingDescription>
          </SettingMeta>
          <Select
            defaultValue="inter"
            value={fontFamily}
            onValueChange={(c) => {
              settingsStore.set("font-family", c, false);
              window.dispatchEvent(new Event("font-family-change"));
              setFontFamily(c);
            }}
          >
            <SelectTrigger className="max-w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="inter">Inter</SelectItem>
              <SelectItem value="geist-sans">Geist Sans</SelectItem>
              <SelectItem value="system-ui">System UI</SelectItem>
              <SelectItem value="roboto">Roboto</SelectItem>
            </SelectContent>
          </Select>
        </SettingContent>
      </Setting>
    </Material>
  );
}
