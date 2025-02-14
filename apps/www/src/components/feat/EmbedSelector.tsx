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

"use client";

import { TabsContent } from "@radix-ui/react-tabs";
import { Button } from "../ui/button";
import { DrawerFooter, DrawerTrigger } from "../ui/drawer";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { useEffect, useState } from "react";
import { codeToHtml } from "shiki";
import { useTheme } from "next-themes";
import { Asterisk, Copy } from "lucide-react";
import useClipboard from "@/lib/useClipboard";
import { toast } from "sonner";
import { Checkbox } from "../ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default function EmbedSelector({ server }: { server: string }) {
  const { theme, systemTheme, resolvedTheme } = useTheme();

  const [embedTheme, setEmbedTheme] = useState("");
  const [embedStatic, setEmbedStatic] = useState(false);
  const [highlightedHtml, setHighlightedHtml] = useState("");
  const [highlightedJsx, setHighlightedJsx] = useState("");
  const [selectedCodeType, setSelectedCodeType] = useState("jsx");
  const [noMinehutBranding, setNoMinehutBranding] = useState(false);
  const clipboard = useClipboard();
  const [url, setURL] = useState(`https://embeds.mhsf.app/embed/${server}?`);
  const [jsxCode, setJsxCode] = useState(`<iframe
    src="${url}"
    width={390}
    height={145}
    style={{ borderRadius: "0.25rem" }}
    allow="clipboard-write"
    frameBorder={0}
    sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
  />`);
  const [htmlCode, setHtmlCode] = useState(`<iframe 
    src="${url}"
    width="390" 
    height="145" 
    style="border-radius: 0.25rem;" 
    allow="clipboard-write"
    frameborder="0" 
    sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
></iframe>`);

  useEffect(() => {
    setHtmlCode(`<iframe 
    src="${url}"
    width="390" 
    height="145" 
    style="border-radius: 0.25rem;" 
    allow="clipboard-write"
    frameborder="0" 
    sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
></iframe>`);
    setJsxCode(`<iframe
    src="${url}"
    width={390}
    height={145}
    style={{ borderRadius: "0.25rem" }}
    allow="clipboard-write"
    frameBorder={0}
    sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
  />`);

    const currentTheme = theme === "system" ? systemTheme : theme;
    const selectedTheme =
      currentTheme === "dark" ? "vitesse-dark" : "vitesse-light";

    async function highlightCode() {
      const jsx = await codeToHtml(jsxCode, {
        lang: "jsx",
        theme: selectedTheme,
      });
      const html = await codeToHtml(htmlCode, {
        lang: "html",
        theme: selectedTheme,
      });
      setHighlightedHtml(html);
      setHighlightedJsx(jsx);
    }

    highlightCode();
  }, [
    theme,
    systemTheme,
    jsxCode,
    htmlCode,
    embedStatic,
    noMinehutBranding,
    url,
  ]);

  const renderCode = (code: string, highlighted: string) => {
    if (highlighted) {
      return (
        <div
          className="h-full overflow-auto bg-background font-mono text-xs [&>pre]:h-full [&>pre]:!bg-transparent [&>pre]:p-4 [&_code]:break-all"
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      );
    } else {
      return (
        <pre className="h-full overflow-auto break-all bg-background p-4 font-mono text-xs text-foreground">
          {code}
        </pre>
      );
    }
  };

  return (
    <>
      <div className="p-4">
        <div className="px-2 pb-8">
          <div className="items-top flex space-x-2">
            <Checkbox
              id="static"
              checked={embedStatic}
              onCheckedChange={(c) => {
                setEmbedStatic(c == "indeterminate" ? true : c);
                setURL(
                  `https://embeds.mhsf.app/embed/${server}?${c ? "&static=true" : ""}${
                    noMinehutBranding ? "&branding=false" : ""
                  }&theme=${embedTheme}`
                );
              }}
            />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="static"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Make embed static
              </label>
              <p className="text-sm text-muted-foreground">
                Interactions with the embed take less resources but will be less
                interactive.
              </p>
            </div>
          </div>
          <br />
          <div className="items-top flex space-x-2">
            <Checkbox
              id="static"
              checked={noMinehutBranding}
              onCheckedChange={(c) => {
                setNoMinehutBranding(c == "indeterminate" ? true : c);
                setURL(
                  `https://embeds.mhsf.app/embed/${server}?${embedStatic ? "&static=true" : ""}${
                    c ? "&branding=false" : ""
                  }&theme=${embedTheme}`
                );
              }}
            />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="static"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Remove Minehut branding
              </label>
              <p className="text-sm text-muted-foreground">
                Enabling this will remove the "on Minehut" tag on the embed.
              </p>
            </div>
          </div>
          <br />
          <div>
            <label
              htmlFor="theme"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Theme
            </label>
            <Select
              name="theme"
              value={embedTheme}
              onValueChange={(c) => {
                setEmbedTheme(c);
                setURL(
                  `https://embeds.mhsf.app/embed/${server}?${embedStatic ? "&static=true" : ""}${
                    noMinehutBranding ? "&branding=false" : ""
                  }&theme=${c}`
                );
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Light" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Tabs defaultValue="preview" className="relative mr-auto w-full">
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
            <TabsTrigger
              value="preview"
              className="relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              Preview
            </TabsTrigger>
            <TabsTrigger
              value="code"
              className="relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              Code
            </TabsTrigger>
          </TabsList>
          <TabsContent value="preview">
            <iframe
              src={`/embed/${server}?${embedStatic ? "&static=true" : ""}${
                noMinehutBranding ? "&branding=false" : ""
              }&theme=${embedTheme}`}
              width={390}
              height={145}
              className="justify-center m-1"
              style={{ borderRadius: "0.25rem" }}
              allow="clipboard-write"
              frameBorder={0}
              sandbox="allow-forms allow-scripts"
            />
          </TabsContent>
          <TabsContent value="code">
            <div className="bg-secondary h-[43px] px-3 py-1 rounded-b">
              <div className="w-[130px] grid grid-cols-2">
                <Button
                  size="icon"
                  className="h-8 w-16 justify-end"
                  variant="ghost"
                  onClick={() => {
                    if (selectedCodeType === "jsx") setSelectedCodeType("html");
                    else setSelectedCodeType("jsx");
                  }}
                >
                  <Asterisk size={16} className="mr-1" />
                  {selectedCodeType === "jsx" ? <>JSX</> : <>HTML</>}
                </Button>
                <Button
                  size="icon"
                  className="h-8 w-8 justify-end"
                  variant="ghost"
                  onClick={() => {
                    clipboard.writeText(
                      selectedCodeType === "jsx" ? jsxCode : htmlCode
                    );
                    toast.success("Copied!");
                  }}
                >
                  <Copy size={16} />
                </Button>
              </div>
            </div>
            {renderCode(
              selectedCodeType === "jsx" ? jsxCode : htmlCode,
              selectedCodeType === "jsx" ? highlightedJsx : highlightedHtml
            )}
          </TabsContent>
        </Tabs>
      </div>
      <DrawerFooter>
        <DrawerTrigger asChild>
          <Button>Close</Button>
        </DrawerTrigger>
      </DrawerFooter>
    </>
  );
}
