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

export function BrowserSettings() {
  const settingsStore = useSettingsStore();
  const [fontFamily, setFontFamily] = useState("inter");

  useEffect(() => {
    setFontFamily((settingsStore.get("font-family") ?? "inter") as string);
  }, [settingsStore]);

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
