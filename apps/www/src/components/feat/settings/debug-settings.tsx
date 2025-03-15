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
import { Setting, SettingContent, SettingDescription, SettingMeta, SettingTitle } from "./setting";
import { Button } from "@/components/ui/button";
import { AnimatedText } from "@/components/ui/animated-text";
import { useState } from "react";
import { loadingList } from "../server-page/util";

export function DebugSettings() {
  const [randomText, setRandomText] = useState("")

  return (
    <Material className="mt-6 grid gap-4">
      <h2 className="text-xl font-semibold text-inherit">Debug Settings</h2>
      <Setting>
        <SettingContent>
            <SettingMeta>
                <SettingTitle>
                    Generate loading text
                </SettingTitle>
                <SettingDescription>
                    Generate a random loading text
                </SettingDescription>
            </SettingMeta>
            <div className="block pb-6">
            <Button onClick={() => {
                setRandomText(loadingList[Math.floor(Math.random() * loadingList.length)])
            }}>
                Generate
            </Button>
            <AnimatedText className="font-bold" text={randomText + "..."}/>
            </div>
        </SettingContent>
      </Setting>
    </Material>
  );
}
