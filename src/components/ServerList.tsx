"use client";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "./ui/badge";
import ServersList from "@/lib/list";
import { CircleUser, Network, Sun, Check, XIcon, Info } from "lucide-react";
import Stat from "./Stat";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import toast from "react-hot-toast";
import { allTags, allCategories } from "@/allTags";
import IconDisplay from "./IconDisplay";
import InfiniteScroll from "react-infinite-scroll-component";
import { Spinner } from "./ui/spinner";
import { CommandIcon } from "lucide-react";
import { OnlineServer } from "@/lib/types/mh-server";
import { useEffectOnce } from "@/lib/useEffectOnce";
import ServerCard from "./ServerCard";
import events from "@/lib/commandEvent";
import { BorderBeam } from "@/components/effects/border-beam";
import { useRouter } from "@/lib/useRouter";
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";

export default function ServerList() {
  const [loading, setLoading]: any = useState(true);
  const [randomText, setRandomText] = useState("");
  const [motdList, setMotdList] = useState<any>({});
  const allText = [""];
  const getRandomText = () => {
    return allText[Math.floor(Math.random() * allText.length)];
  };
  const [templateFilter, setTemplateFilter] = useState(false);
  const [random, setRandom] = useState(false);
  const [serverList, setServerList] = useState(new ServersList([]));
  const [textCopied, setTextCopied] = useState(false);
  const bigger = async (server: OnlineServer) =>
    server.playerData.playerCount > 15;
  const smaller = async (server: OnlineServer) =>
    !server.staticInfo.alwaysOnline &&
    server.playerData.playerCount < 15 &&
    server.playerData.playerCount > 7;
  const [nameFilters, setNameFilters] = useState<any>({});
  const [inErrState, setErrState] = useState(false);
  const [servers, setServers] = useState<Array<OnlineServer>>([]);
  const router = useRouter();
  const [ipr, setIPR] = useState("4");
  const [filters, setFilters] = useState<
    Array<(server: OnlineServer) => Promise<boolean>>
  >([]);
  const [randomData, setRandomData] = useState<OnlineServer | undefined>(
    undefined
  );

  useEffectOnce(() => {
    setRandomText(getRandomText());
    serverList
      .fetchDataAndFilter()
      .then(() => {
        serverList.moveListDown();
        let stringList: Array<{ server: string; motd: string }> = [];
        let obj: any = {};

        serverList.currentServers.forEach((b) => {
          stringList.push({ motd: b.motd, server: b.name });
        });

        serverList.getMOTDs(stringList).then((c) => {
          var updatedSL = motdList;
          c.forEach((b: { server: string; motd: string }) => {
            updatedSL[b.server] = b.motd;
          });
          setMotdList(updatedSL);
          setServers(serverList.currentServers);
          setLoading(false);
        });
      })
      .catch(() => setErrState(true));
  });
  if (inErrState) {
    return (
      <>
        <div className="flex justify-center">
          <XIcon />
          <br />
        </div>
        <div className="flex justify-center">
          Hmm. Something is wrong. Reload the page.
        </div>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Spinner className="flex items-center" />
        <br />
        <div
          className="flex justify-center"
          dangerouslySetInnerHTML={{ __html: randomText }}
        ></div>
      </>
    );
  }

  return (
    <>
      <div className="max-lg:grid-cols-2 grid grid-cols-3 gap-4 ">
        <Stat
          title="Players online"
          desc={serverList.getExtraData().total_players.toString()}
          icon={CircleUser}
        />
        <Stat
          title={
            <div
              className={
                serverList.getExtraData().total_servers >= 3200
                  ? "bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-500"
                  : ""
              }
            >
              Servers online{" "}
            </div>
          }
          className="relative z-0"
          desc={
            <div className="flex items-center">
              <div
                className={
                  serverList.getExtraData().total_servers >= 3200
                    ? "bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-500 "
                    : ""
                }
              >
                {serverList.getExtraData().total_servers.toString()}
              </div>
              {serverList.getExtraData().total_servers >= 3200 && (
                <Tooltip>
                  <TooltipTrigger>
                    <Info size={16} className="ml-2" />
                  </TooltipTrigger>
                  <TooltipContent className="font-normal">
                    The server amount is over 3.2k, meaning that new servers
                    have to go into a queue before being able to be online.{" "}
                    <br />
                    (the server count isn't entirely accurate, so sometimes you
                    might not go into a queue even when the server count is at
                    3.2k)
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          }
          icon={Network}
        >
          {serverList.getExtraData().total_servers >= 3200 && (
            <BorderBeam
              size={135}
              duration={12}
              delay={9}
              colorFrom="rgb(6 182 212)"
              colorTo="rgb(59 130 246)"
            />
          )}
        </Stat>
        <Stat
          title="Current most popular server (in filter)"
          className="max-lg:col-span-2"
          desc={
            <>
              {serverList.currentServers[0] != undefined
                ? serverList.currentServers[0].name
                : "None"}{" "}
              {serverList.currentServers[0] != undefined && (
                <IconDisplay server={serverList.currentServers[0]} />
              )}
            </>
          }
          icon={Sun}
        />
      </div>
      <br />
      <Separator />
      <Menubar className="mt-3 ml-2 border rounded p-2">
        <MenubarMenu>
          <MenubarTrigger>Servers</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onSelect={() => events.emit("search-request-event")}>
              Search Servers
              <MenubarShortcut className="flex items-center ml-3">
                <CommandIcon size={14} />
                +Shift+K
              </MenubarShortcut>
            </MenubarItem>
            <MenubarItem
              onSelect={() => {
                setRandomData(serverList.getRandomServer());
                setRandom(true);
              }}
            >
              Pick Random Server
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem
              onSelect={() => {
                toast.promise(
                  new Promise((s, e) => {
                    setLoading(true);
                    serverList
                      .fetchDataAndFilter()
                      .then(() => {
                        serverList.moveListDown();

                        let stringList: Array<{
                          server: string;
                          motd: string;
                        }> = [];
                        let obj: any = {};

                        serverList.currentServers.forEach((b) => {
                          stringList.push({ motd: b.motd, server: b.name });
                        });

                        serverList.getMOTDs(stringList).then((c) => {
                          var updatedSL = motdList;
                          c.forEach((b: { server: string; motd: string }) => {
                            updatedSL[b.server] = b.motd;
                          });
                          setMotdList(updatedSL);
                          setServers(serverList.currentServers);
                          setLoading(false);
                          s(false);
                        });
                      })
                      .catch(() => {
                        e();
                      });
                  }),
                  {
                    success: "Succesfully refreshed servers",
                    loading: "Refreshing...",
                    error: "Error while refreshing",
                  }
                );
              }}
            >
              Refresh
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Filter</MenubarTrigger>
          <MenubarContent className="max-h-[400px] overflow-auto">
            <MenubarRadioGroup
              onValueChange={(v) => {
                toast.promise(
                  new Promise((g, b) => {
                    if (v == "smaller") {
                      setTemplateFilter(true);
                      var filt = nameFilters;
                      filt["smaller-tf"] = true;
                      filt["bigger-tf"] = false;
                      setNameFilters(filt);

                      var filt2 = filters;
                      filt2.push(smaller);
                      if (filt2.includes(bigger)) {
                        filt2.splice(filt2.indexOf(bigger), 1);
                      }
                      setFilters(filt2);
                      serverList.editFilters(filters);
                      serverList.fetchDataAndFilter().then(() => {
                        serverList.moveListDown();

                        let stringList: Array<{
                          server: string;
                          motd: string;
                        }> = [];
                        let obj: any = {};

                        serverList.currentServers.forEach((b) => {
                          stringList.push({ motd: b.motd, server: b.name });
                        });

                        serverList.getMOTDs(stringList).then((c) => {
                          var updatedSL = motdList;
                          c.forEach((b: { server: string; motd: string }) => {
                            updatedSL[b.server] = b.motd;
                          });
                          setMotdList(updatedSL);
                          setServers(serverList.currentServers);
                          g(undefined);
                        });
                      });
                    } else if (v == "bigger") {
                      setTemplateFilter(true);
                      var filt = nameFilters;
                      filt["smaller-tf"] = false;
                      filt["bigger-tf"] = true;
                      setNameFilters(filt);
                      var filt2 = filters;
                      filt2.push(bigger);

                      filt2.splice(filt2.indexOf(smaller), 1);

                      setFilters(filt2);
                      serverList.editFilters(filters);

                      serverList.fetchDataAndFilter().then(() => {
                        serverList.moveListDown();

                        let stringList: Array<{
                          server: string;
                          motd: string;
                        }> = [];
                        let obj: any = {};

                        serverList.currentServers.forEach((b) => {
                          stringList.push({ motd: b.motd, server: b.name });
                        });

                        serverList.getMOTDs(stringList).then((c) => {
                          var updatedSL = motdList;
                          c.forEach((b: { server: string; motd: string }) => {
                            updatedSL[b.server] = b.motd;
                          });
                          setMotdList(updatedSL);
                          setServers(serverList.currentServers);
                          g(undefined);
                        });
                      });
                    } else {
                      var filt = nameFilters;
                      filt["smaller-tf"] = false;
                      filt["bigger-tf"] = false;
                      setNameFilters(filt);
                      setTemplateFilter(false);

                      var filt2 = filters;
                      filt2.splice(filt2.indexOf(smaller), 1);
                      filt2.splice(filt2.indexOf(bigger), 1);
                      setFilters(filt2);
                      console.log(filters, filters.includes(smaller));
                      serverList.editFilters(filters);

                      serverList.fetchDataAndFilter().then(() => {
                        serverList.moveListDown();

                        let stringList: Array<{
                          server: string;
                          motd: string;
                        }> = [];
                        let obj: any = {};

                        serverList.currentServers.forEach((b) => {
                          stringList.push({ motd: b.motd, server: b.name });
                        });

                        serverList.getMOTDs(stringList).then((c) => {
                          var updatedSL = motdList;
                          c.forEach((b: { server: string; motd: string }) => {
                            updatedSL[b.server] = b.motd;
                          });
                          setMotdList(updatedSL);
                          setServers(serverList.currentServers);
                          g(undefined);
                        });
                      });
                    }
                  }),
                  {
                    error: "Error while changing filters",
                    loading: "Changing filters...",
                    success: "Changed filters!",
                  }
                );
              }}
              value={(() => {
                if (nameFilters["smaller-tf"]) {
                  return "smaller";
                } else if (nameFilters["bigger-tf"]) {
                  return "bigger";
                } else {
                  return "none";
                }
              })()}
            >
              <MenubarRadioItem value="smaller">
                <div className="block">
                  Only allow smaller servers
                  <br />
                  <span className="text-sm text-muted-foreground">
                    Only allow servers that have the player range 7-15, and
                    cannot <br />
                    be Always Online.
                  </span>
                </div>
              </MenubarRadioItem>
              <MenubarRadioItem value="bigger">
                <div className="block">
                  Only allow bigger servers
                  <br />
                  <span className="text-sm text-muted-foreground">
                    Only allow servers with more than 15 players.
                  </span>
                </div>
              </MenubarRadioItem>
              <MenubarRadioItem value="none">
                No/custom requirements
              </MenubarRadioItem>
            </MenubarRadioGroup>
            <MenubarSeparator />
            <MenubarSub>
              <span className="text-sm text-muted-foreground ml-2">Tags</span>
            </MenubarSub>
            {allTags.map((tag) => (
              <div key={tag.docsName}>
                {tag.docsName && tag.__filter == undefined && (
                  <MenubarCheckboxItem
                    disabled={templateFilter && tag.__disab != undefined}
                    id={tag.docsName}
                    checked={(() => {
                      return nameFilters["t-" + tag.docsName];
                    })()}
                    onCheckedChange={async (b) => {
                      var filt = nameFilters;
                      filt["t-" + tag.docsName] = b;
                      setNameFilters(filt);
                      if (b) {
                        var filt2 = filters;
                        filt2.push(tag.condition);
                        setFilters(filt2);
                      } else {
                        var filt2 = filters;
                        filt2.splice(filt2.indexOf(tag.condition), 1);
                        setFilters(filt2);
                      }
                      serverList.editFilters(filters);
                      serverList.fetchDataAndFilter().then(() => {
                        serverList.moveListDown();

                        let stringList: Array<{
                          server: string;
                          motd: string;
                        }> = [];
                        let obj: any = {};

                        serverList.currentServers.forEach((b) => {
                          stringList.push({ motd: b.motd, server: b.name });
                        });

                        serverList.getMOTDs(stringList).then((c) => {
                          var updatedSL = motdList;
                          c.forEach((b: { server: string; motd: string }) => {
                            updatedSL[b.server] = b.motd;
                          });
                          setMotdList(updatedSL);
                          setServers(serverList.currentServers);
                        });
                      });
                    }}
                  >
                    <Badge variant={tag.role} className="mr-1">
                      {tag.docsName}
                    </Badge>
                  </MenubarCheckboxItem>
                )}
              </div>
            ))}
            <MenubarSeparator />
            <MenubarSub>
              <span className="text-sm text-muted-foreground ml-2">
                Categories
              </span>
            </MenubarSub>
            {allCategories.map((categorie) => (
              <MenubarCheckboxItem
                id={categorie.name}
                key={categorie.name}
                onCheckedChange={async (b) => {
                  var filt = nameFilters;
                  filt["c-" + categorie.name] = b;
                  setNameFilters(filt);
                  if (b) {
                    var filt2 = filters;
                    filt2.push(categorie.condition);
                    setFilters(filt2);
                  } else {
                    var filt2 = filters;
                    filt2.splice(filt2.indexOf(categorie.condition), 1);
                    setFilters(filt2);
                  }
                  serverList.editFilters(filters);
                  serverList.fetchDataAndFilter().then(() => {
                    serverList.moveListDown();

                    let stringList: Array<{ server: string; motd: string }> =
                      [];
                    let obj: any = {};

                    serverList.currentServers.forEach((b) => {
                      stringList.push({ motd: b.motd, server: b.name });
                    });

                    serverList.getMOTDs(stringList).then((c) => {
                      var updatedSL = motdList;
                      c.forEach((b: { server: string; motd: string }) => {
                        updatedSL[b.server] = b.motd;
                      });
                      setMotdList(updatedSL);
                      setServers(serverList.currentServers);
                    });
                  });
                }}
                checked={(() => {
                  return nameFilters["c-" + categorie.name];
                })()}
              >
                <Badge variant={categorie.role} className="mr-1">
                  {categorie.name}
                </Badge>
              </MenubarCheckboxItem>
            ))}
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>View</MenubarTrigger>
          <MenubarContent>
            <MenubarSub>
              <MenubarSubTrigger>Grid</MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarRadioGroup value={ipr} onValueChange={setIPR}>
                  <MenubarRadioItem value="4">4 items per row</MenubarRadioItem>
                  <MenubarRadioItem value="5">5 items per row</MenubarRadioItem>
                  <MenubarRadioItem value="6">6 items per row</MenubarRadioItem>
                </MenubarRadioGroup>
              </MenubarSubContent>
            </MenubarSub>
            <MenubarSub>
              <MenubarSubTrigger>Sort</MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarRadioGroup
                  value="joins"
                  onValueChange={(c) =>
                    c == "favorites" && router.push("/sort/favorites")
                  }
                >
                  <MenubarRadioItem value="joins">
                    Players Online
                  </MenubarRadioItem>
                  <MenubarRadioItem value="favorites">
                    Favorites
                  </MenubarRadioItem>
                </MenubarRadioGroup>
              </MenubarSubContent>
            </MenubarSub>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>

      <Dialog open={random} onOpenChange={setRandom}>
        <DialogContent>
          {randomData == undefined && <>No data to randomize</>}
          {randomData != undefined && (
            <DialogHeader>
              <DialogTitle>
                <IconDisplay server={randomData} /> {randomData.name}
                {randomData.author != undefined ? (
                  <div className="text-sm text-muted-foreground">
                    by {randomData.author}
                  </div>
                ) : (
                  <br />
                )}
                <TagShower server={randomData} />
              </DialogTitle>
              <DialogDescription className="float-left inline">
                <span className="flex items-center">
                  {randomData.playerData.playerCount == 0 ? (
                    <div
                      className="items-center border"
                      style={{
                        width: ".5rem",
                        height: ".5rem",
                        borderRadius: "9999px",
                      }}
                    />
                  ) : (
                    <div
                      className="items-center"
                      style={{
                        backgroundColor: "#0cce6b",
                        width: ".5rem",
                        height: ".5rem",
                        borderRadius: "9999px",
                      }}
                    />
                  )}

                  <span className="pl-1">
                    {randomData.playerData.playerCount}{" "}
                    {randomData.playerData.playerCount == 1
                      ? "player"
                      : "players"}{" "}
                    currently online
                  </span>
                </span>
                <br />
                <strong>Server IP</strong>
                <br />
                <br />
                <code className="border p-3 rounded">
                  {randomData.name}.minehut.gg{" "}
                  <Button
                    size="icon"
                    className="ml-1 h-[20px]"
                    onClick={() => {
                      setTextCopied(true);
                      navigator.clipboard.writeText(
                        randomData.name + ".mshf.minehut.gg"
                      );
                      toast.success("Copied!");
                      setTimeout(() => setTextCopied(false), 1000);
                    }}
                  >
                    {textCopied ? (
                      <Check size={16} className="flex items-center" />
                    ) : (
                      <p>Copy</p>
                    )}
                  </Button>
                </code>
              </DialogDescription>
            </DialogHeader>
          )}
        </DialogContent>
      </Dialog>

      <br />
      <InfiniteScroll
        dataLength={serverList.currentServers.length}
        hasMore={serverList.hasMore}
        next={() => {
          serverList.moveListDown();
          let stringList: Array<{ server: string; motd: string }> = [];
          serverList.currentServers.forEach((b) => {
            stringList.push({ motd: b.motd, server: b.name });
          });

          serverList.getMOTDs(stringList).then((c) => {
            var updatedSL = motdList;
            c.forEach((b: { server: string; motd: string }) => {
              updatedSL[b.server] = b.motd;
            });
            setMotdList(updatedSL);
            setServers(serverList.currentServers);
            setLoading(false);
          });
        }}
        loader={<Spinner className="flex items-center" />}
        endMessage={
          <p
            style={{ textAlign: "center" }}
            dangerouslySetInnerHTML={{
              __html: randomText + "<br /> <strong>You've seen it all</strong>",
            }}
          />
        }
        style={{ overflow: "hidden !important", paddingLeft: 6 }}
      >
        <div className={" grid " + "grid-cols-" + ipr + " gap-4"}>
          {servers.map((b: any) => (
            <>
              <ServerCard b={b} motd={motdList[b.name]} />
            </>
          ))}
        </div>
      </InfiniteScroll>
    </>
  );
}

export function TagShower(props: {
  server: OnlineServer;
  className?: string;
  unclickable?: boolean;
}) {
  const [loading, setLoading] = useState(true);
  const [compatiableTags, setCompatiableTags] = useState<
    Array<{
      name: string;
      docsName?: string;
      tooltip: string;
      htmlDocs: string;
      role:
        | "default"
        | "destructive"
        | "outline"
        | "secondary"
        | "red"
        | "orange"
        | "yellow"
        | "green"
        | "lime"
        | "blue"
        | "teal"
        | "cyan"
        | "violet"
        | "indigo"
        | "purple"
        | "fuchsia"
        | "pink";
    }>
  >([]);

  useEffectOnce(() => {
    if (loading) {
      allTags.forEach((tag) => {
        tag.condition(props.server).then((b) => {
          if (b && tag.primary) {
            tag.name(props.server).then((n) => {
              compatiableTags.push({
                name: n,
                docsName: tag.docsName,
                tooltip: tag.tooltipDesc,
                htmlDocs: tag.htmlDocs,
                role: tag.role == undefined ? "secondary" : tag.role,
              });
              setLoading(false);
            });
          }
        });
      });
    }
  });

  if (loading) {
    return <></>;
  }

  return (
    <>
      {compatiableTags.map((t) => (
        <>
          {props.unclickable && (
            <Badge variant={t.role} className={props.className}>
              {t.name}
            </Badge>
          )}
          {!props.unclickable && (
            <Dialog key={t.name}>
              <DialogTrigger>
                <Tooltip>
                  <TooltipTrigger>
                    <Badge variant={t.role} className={props.className}>
                      {t.name}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="font-normal">
                      {t.tooltip}
                      <br />
                      Click the tag to learn more about it.
                    </div>
                  </TooltipContent>
                </Tooltip>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {'"'}
                    {t.docsName == undefined ? t.name : t.docsName}
                    {'"'} documentation
                  </DialogTitle>
                  <DialogDescription
                    dangerouslySetInnerHTML={{
                      __html: t.htmlDocs,
                    }}
                  />
                </DialogHeader>
              </DialogContent>
            </Dialog>
          )}
        </>
      ))}
    </>
  );
}
