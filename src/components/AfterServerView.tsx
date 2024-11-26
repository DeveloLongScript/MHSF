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
import { getCommunityServerFavorites, getCustomization } from "@/lib/api";
import { MHSF } from "@/lib/mhsf";
import { ServerResponse } from "@/lib/types/mh-server";
import {
  MinehutIcon,
  getIndexFromRarity,
  getMinehutIcons,
} from "@/lib/types/server-icon";
import { Banknote, Copy, Info, QrCode, Share2 } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import FadeIn from "react-fade-in/lib/FadeIn";
import { CheckmarkIcon } from "react-hot-toast";
import { toast } from "sonner";
import Markdown from "react-markdown";
import IconDisplay from "./IconDisplay";
import AchievementList from "./feat/AchievementList";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "./ui/drawer";
import EmbedSelector from "./feat/EmbedSelector";
import { Separator } from "./ui/separator";
import QRCodeGenerator from "./feat/QRCodeGen";
import NoItems from "./misc/NoItems";

export default function AfterServerView({ server }: { server: string }) {
  const [description, setDescription] = useState("");
  const [discord, setDiscord] = useState("");
  const [mhsf, setMHSF] = useState(new MHSF());
  const [icons, setIcons] = useState<MinehutIcon[]>();
  const { resolvedTheme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [qrCodeOpen, setQrCodeOpen] = useState(false);
  const [view, setView] = useState(
    description !== "" || discord !== "" ? "desc" : "extra"
  );
  const [serverObject, setServerObject] = useState<ServerResponse | undefined>(
    undefined
  );
  const [embedOpened, setEmbedOpened] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    getCustomization(server).then((b) => {
      if (b != null) {
        setDescription(b.description == null ? "" : b.description);
        setDiscord(b.discord == null ? "" : b.discord);
        mhsf.setCustomizations(b);
        getCommunityServerFavorites(server).then((c) => {
          mhsf.setFavorites(c);
        });
      }
      fetch("https://api.minehut.com/server/" + server + "?byName=true").then(
        (c) => c.json().then((n) => setServerObject(n.server))
      );
      getMinehutIcons().then((i) => {
        setIcons(i);
      });
      setLoading(false);
    });
  }, []);
  if (loading) return <></>;

  return (
    <>
      <Drawer open={embedOpened} onOpenChange={setEmbedOpened}>
        <DrawerContent className="max-w-md w-full mx-auto rounded-t-[10px]">
          <DrawerHeader>
            <DrawerTitle>Embed Creator</DrawerTitle>
          </DrawerHeader>
          <EmbedSelector server={server} />
        </DrawerContent>
      </Drawer>
      <Drawer open={qrCodeOpen} onOpenChange={setQrCodeOpen}>
        <DrawerContent className="max-w-md w-full mx-auto rounded-t-[10px]">
          <DrawerHeader>
            <DrawerTitle>QR Code generator</DrawerTitle>
          </DrawerHeader>
          <QRCodeGenerator server={server} />
        </DrawerContent>
      </Drawer>
      <FadeIn>
        <div className="grid sm:grid-cols-6 h-full pl-4 pr-4 ">
          <div className="ml-5 mb-2 flex items-center sm:hidden overflow-auto w-[calc(100vw-5rem)]">
            {(description != "" || discord != "") && (
              <Button
                variant={view == "desc" ? undefined : "ghost"}
                onClick={() => setView("desc")}
              >
                Description
              </Button>
            )}
            <Button
              variant={view == "extra" ? undefined : "ghost"}
              onClick={() => setView("extra")}
              className="ml-2"
            >
              Server Information
            </Button>
            <Button
              variant={view == "achievements" ? undefined : "ghost"}
              onClick={() => setView("achievements")}
              className="ml-2"
            >
              Achievements
            </Button>
            <Button
              variant={view == "icons" ? undefined : "ghost"}
              onClick={() => setView("icons")}
            >
              Purchased Icons
            </Button>
            <Separator orientation="vertical" />
            <Button variant="ghost" onClick={() => setEmbedOpened(true)}>
              <Share2 className="h-[1rem] w-[1rem] mr-2" />
              Embeds
            </Button>
          </div>
          <div className="max-sm:hidden">
            <div className="grid">
              {(description != "" || discord != "") && (
                <Button
                  variant={view == "desc" ? undefined : "ghost"}
                  onClick={() => setView("desc")}
                >
                  Description
                </Button>
              )}
              <Button
                variant={view == "extra" ? undefined : "ghost"}
                onClick={() => setView("extra")}
              >
                Server Information
              </Button>
              <Button
                variant={view == "achievements" ? undefined : "ghost"}
                onClick={() => setView("achievements")}
              >
                Achievements
              </Button>
              <Button
                variant={view == "icons" ? undefined : "ghost"}
                onClick={() => setView("icons")}
              >
                Purchased Icons
              </Button>
              <br />
              <Separator />
              <br />
              <Button variant="ghost" onClick={() => setEmbedOpened(true)}>
                <Share2 className="h-[1rem] w-[1rem] mr-2" />
                Embeds
              </Button>
              <Button variant="ghost" onClick={() => setQrCodeOpen(true)}>
                <QrCode className="h-[1rem] w-[1rem] mr-2" />
                QR Code
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-4 pl-4 pr-4 gap-3.5 col-span-5">
            {description != "" && view == "desc" && (
              <Card className="sm:col-span-3">
                <CardDescription className="p-4 prose dark:prose-invert">
                  <Markdown
                    components={{
                      img(props) {
                        // wsrv.nl caches images for us AND protects the IP's of users
                        return (
                          <img src={`//wsrv.nl/?url=${props.src}`} {...props} />
                        );
                      },
                    }}
                  >
                    {description}
                  </Markdown>
                </CardDescription>
              </Card>
            )}
            {discord != "" && view == "desc" && (
              <Card>
                <CardHeader>
                  <CardTitle>Discord Server</CardTitle>
                  <CardDescription className="p-4 prose dark:prose-invert">
                    <iframe
                      src={`https://discord.com/widget?id=${discord}&theme=${resolvedTheme}`}
                      height="500"
                      allowTransparency={true}
                      className="rounded-lg max-sm:w-[100px] max-md:w-[250px]"
                      sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
                    />
                  </CardDescription>
                </CardHeader>
              </Card>
            )}{" "}
            {view == "achievements" && (
              <div className="col-span-4">
                <AchievementList server={server} />
              </div>
            )}
            {view == "extra" && (
              <div className="sm:grid sm:grid-cols-3 col-span-4 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Plan Details</CardTitle>
                    <CardDescription>
                      Information about the plan being used by the server
                    </CardDescription>
                  </CardHeader>
                  {(() => {
                    console.log(serverObject);
                    return true;
                  })()}
                  <CardContent>
                    {" "}
                    <table className="table-auto w-full">
                      <tr>
                        <th className="border p-2">Server plan</th>
                        <td className="border p-2">
                          {serverObject?.expired == undefined ? (
                            <div className="flex items-center">
                              Free{" "}
                              <Tooltip>
                                <TooltipTrigger>
                                  <div>
                                    <Info size={16} className="ml-2" />
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  The plan is really unknown, but in most
                                  scenarios, the Minehut API returns{" "}
                                  <code>undefined</code> if the server is free.
                                </TooltipContent>
                              </Tooltip>
                            </div>
                          ) : (
                            <>{serverObject?.activeServerPlan}</>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <th className="border p-2">Raw plan</th>
                        <td className="border p-2">
                          {serverObject?.expired == undefined ? (
                            "? (unknown)"
                          ) : (
                            <code>{serverObject?.rawPlan}</code>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <th className="border p-2">Credits p/ day</th>
                        <td className="border p-2 flex items-center">
                          <Banknote className="mr-1" />
                          {serverObject?.credits_per_day == undefined
                            ? "? (unknown)"
                            : Math.floor(serverObject?.credits_per_day)}
                        </td>
                      </tr>
                      <tr>
                        <th className="border p-2">Server expired</th>
                        <td className="border p-2">
                          {serverObject?.expired == undefined
                            ? "? (unknown)"
                            : toJSX(serverObject?.expired)}
                        </td>
                      </tr>
                      <tr>
                        <th className="border p-2">Server external</th>
                        <td className="border p-2">
                          {serverObject?.rawPlan == undefined
                            ? "? (unknown)"
                            : toJSX(serverObject?.rawPlan == "EXTERNAL")}
                        </td>
                      </tr>
                    </table>{" "}
                  </CardContent>
                </Card>
                <br className="sm:hidden" />
                <Card>
                  <CardHeader>
                    <CardTitle>Additional Info</CardTitle>
                    <CardDescription>
                      Additional info that could be useful{" "}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <table className="table-auto w-full">
                      <tr>
                        <th className="border p-2">Icon</th>
                        <td className="border p-2">
                          {serverObject?.icon == undefined ? (
                            <>
                              Default (<code>OAK_SIGN</code>)
                            </>
                          ) : (
                            <code>{serverObject?.icon}</code>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <th className="border p-2">All-time joins</th>
                        <td className="border p-2">
                          {serverObject?.joins == undefined
                            ? "? (unknown)"
                            : serverObject?.joins}
                        </td>
                      </tr>
                      <tr>
                        <th className="border p-2">Server Type</th>
                        <td className="border p-2">
                          {serverObject?.server_version_type == undefined ? (
                            "? (unknown)"
                          ) : (
                            <>
                              {serverObject?.server_version_type.toLowerCase()}
                            </>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <th className="border p-2">Server Platform</th>
                        <td className="border p-2">
                          {serverObject?.platform == undefined
                            ? "? (unknown)"
                            : serverObject?.platform}
                        </td>
                      </tr>
                    </table>
                  </CardContent>
                </Card>
                <br className="sm:hidden" />
                <Card>
                  <CardHeader>
                    <CardTitle>
                      <div>
                        <span>Technical Info</span>
                        <Tooltip>
                          <TooltipContent className="font-normal tracking-normal">
                            Copy JSON data about the server
                          </TooltipContent>
                          <TooltipTrigger>
                            <Button
                              className="justify-right ml-2"
                              size="icon"
                              variant="secondary"
                              onClick={() => {
                                setCopied(true);
                                try {
                                  navigator.clipboard.writeText(
                                    JSON.stringify({
                                      minehut: serverObject,
                                      mhsf: mhsf.getMHSF(),
                                    })
                                  );
                                } catch {
                                  toast.error(
                                    "Clipboard is inaccessible. Cannot copy"
                                  );
                                }
                                toast.success(
                                  <div className="block w-[300px]">
                                    Copied the following: <br />{" "}
                                    <code className="flex items-center">
                                      {JSON.stringify({
                                        minehut: serverObject,
                                        mhsf,
                                      }).substring(0, 36)}
                                      ...
                                    </code>
                                  </div>
                                );
                                setTimeout(() => setCopied(false), 1000);
                              }}
                            >
                              {!copied && <Copy size={16} />}
                              {copied && <CheckmarkIcon />}
                            </Button>
                          </TooltipTrigger>
                        </Tooltip>
                      </div>
                    </CardTitle>
                    <CardDescription>
                      Technical information about the server{" "}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <table className="table-auto w-full">
                      <tr>
                        <th className="border p-2">Visible</th>
                        <td className="border p-2">
                          {serverObject?.visibility == undefined
                            ? "? (unknown)"
                            : toJSX(serverObject?.visibility)}
                        </td>
                      </tr>
                      <tr>
                        <th className="border p-2">Server Port</th>
                        <td className="border p-2">
                          {serverObject?.port == undefined ? (
                            "? (unknown)"
                          ) : (
                            <code>{serverObject?.port}</code>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <th className="border p-2">Storage Node</th>
                        <td className="border p-2">
                          {serverObject?.storage_node == undefined
                            ? "? (unknown)"
                            : serverObject?.storage_node.toUpperCase()}
                        </td>
                      </tr>
                      <tr>
                        <th className="border p-2">Server ID</th>
                        <td className="border p-2">
                          {serverObject?._id == undefined ? (
                            "? (unknown)"
                          ) : (
                            <code>{serverObject?._id}</code>
                          )}
                        </td>
                      </tr>
                    </table>
                  </CardContent>
                </Card>
              </div>
            )}
            {view == "icons" && (
              <div className="col-span-4">
                <p>
                  Purchased Icons are icons that are under the server's
                  ownership, they may or may not available at that certain
                  moment either.
                </p>
                {serverObject?.purchased_icons.length == 0 && <NoItems />}
                {serverObject?.purchased_icons.map((icon) => (
                  <Card key={icon} className="my-4">
                    <CardContent
                      className="pt-4 flex items-center"
                      style={{
                        color: getIndexFromRarity(
                          icons?.find((c) => c._id === icon)?.rank.toLowerCase()
                        ).text,
                      }}
                    >
                      <IconDisplay
                        server={{
                          icon: icons?.find((c) => c._id === icon)?.icon_name,
                        }}
                        className="mr-2"
                      />
                      {icons?.find((c) => c._id === icon)?.display_name}
                      <Tooltip>
                        <TooltipTrigger>
                          <Info size={18} className="ml-2" />
                        </TooltipTrigger>
                        <TooltipContent>
                          Just because an item is available, it doesn't directly{" "}
                          <br />
                          mean that it can be bought immediately, it just means
                          its in the <br />
                          pool of icons that are in the weekly rotation.
                          <br />
                          <br />
                          <span className="flex items-center">
                            <span className="mr-1">Available currently:</span>
                            {toJSX(
                              icons?.find((c) => c._id === icon)?.available
                            )}
                          </span>
                          <span className="flex items-center">
                            <span className="mr-1">Disabled currently:</span>
                            {toJSX(
                              icons?.find((c) => c._id === icon)?.disabled
                            )}
                          </span>
                          <span className="flex items-center">
                            <span className="mr-1">Price:</span>
                            <Banknote size={16} className="mr-1" />
                            {icons?.find((c) => c._id === icon)?.price} credits
                          </span>
                        </TooltipContent>
                      </Tooltip>
                      <span
                        className="mx-2 p-1 pr-2 rounded italic font-bold"
                        style={{
                          backgroundColor: getIndexFromRarity(
                            icons
                              ?.find((c) => c._id === icon)
                              ?.rank.toLowerCase()
                          ).bg,
                        }}
                      >
                        {icons
                          ?.find((c) => c._id === icon)
                          ?.rank.toLocaleUpperCase()}
                      </span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
        <br />
        <br />
      </FadeIn>
    </>
  );
}

function toJSX(boolean?: boolean) {
  if (boolean) {
    return <div className="text-green-400">True</div>;
  }

  if (boolean == undefined) {
    return <div className="text-gray-400">N/A</div>;
  }

  return <div className="text-red-400">False</div>;
}
