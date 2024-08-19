"use client";
import { getCommunityServerFavorites, getCustomization } from "@/lib/api";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import Markdown from "react-markdown";
import { useTheme } from "next-themes";
import FadeIn from "react-fade-in/lib/FadeIn";
import { Button } from "./ui/button";
import { ServerResponse } from "@/lib/types/mh-server";
import { Copy } from "lucide-react";
import toast, { CheckmarkIcon } from "react-hot-toast";
import { MHSF } from "@/lib/mhsf";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export default function AfterServerView({ server }: { server: string }) {
  const [description, setDescription] = useState("");
  const [discord, setDiscord] = useState("");
  const [mhsf, setMHSF] = useState(new MHSF());
  const { resolvedTheme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("desc");
  const [serverObject, setServerObject] = useState<ServerResponse | undefined>(
    undefined
  );
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
      setLoading(false);
    });
  }, []);
  if (loading) return <></>;

  return (
    <>
      <FadeIn>
        <div
          className={
            description != "" || discord != ""
              ? "grid sm:grid-cols-6 h-full pl-4 pr-4"
              : ""
          }
        >
          <div className="ml-5 mb-2 flex items-center sm:hidden">
            <Button
              variant={view == "desc" ? undefined : "ghost"}
              onClick={() => setView("desc")}
            >
              Description
            </Button>
            <Button
              variant={view == "extra" ? undefined : "ghost"}
              onClick={() => setView("extra")}
              className="ml-2"
            >
              Server Information
            </Button>
          </div>
          {(description != "" || discord != "") && (
            <div className="max-sm:hidden">
              <div className="grid">
                <Button
                  variant={view == "desc" ? undefined : "ghost"}
                  onClick={() => setView("desc")}
                >
                  Description
                </Button>
                <Button
                  variant={view == "extra" ? undefined : "ghost"}
                  onClick={() => setView("extra")}
                >
                  Server Information
                </Button>
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-4 pl-4 pr-4 gap-3.5 col-span-5">
            {description != "" && view == "desc" && (
              <Card className="sm:col-span-3">
                <CardDescription className="p-4 prose dark:prose-invert">
                  <Markdown disallowedElements={["img"]}>
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
            {((description == "" && discord == "") || view == "extra") && (
              <>
                <Card className="col-span-2">
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
                            "? (unknown)"
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
                        <th className="border p-2">Credits per day</th>
                        <td className="border p-2">
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
                <Card className="col-span-2">
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
                            "? (unknown)"
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
                <Card className="col-span-2">
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
              </>
            )}
          </div>
        </div>
        <br />
        <br />
      </FadeIn>
    </>
  );
}

function toJSX(boolean: boolean) {
  if (boolean) {
    return <div className="text-green-400">True</div>;
  }

  return <div className="text-red-400">False</div>;
}
