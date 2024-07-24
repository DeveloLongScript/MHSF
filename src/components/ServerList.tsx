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
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "./ui/badge";
import ServersList from "@/lib/list";
import {
  CircleUser,
  Network,
  Copy,
  Sun,
  SlidersHorizontal,
  Check,
  XIcon,
} from "lucide-react";
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
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import toast from "react-hot-toast";
import { allTags, allCategories } from "@/allTags";
import IconDisplay from "./IconDisplay";
import InfiniteScroll from "react-infinite-scroll-component";
import Markdown from "react-markdown";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import remarkGfm from "remark-gfm";
import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "./ui/spinner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OnlineServer, ServerResponse } from "./ServerView";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEffectOnce } from "@/lib/useEffectOnce";
import ServerCard from "./ServerCard";
import { useHotkeys } from "react-hotkeys-hook";

export default function ServerList() {
  const [loading, setLoading]: any = useState(true);
  const [command, setCommand] = useState(false);
  const [randomText, setRandomText] = useState("");
  const [motdList, setMotdList] = useState<any>({});
  const allText = [""];
  const getRandomText = () => {
    return allText[Math.floor(Math.random() * allText.length)];
  };
  const [searchRes, setSearchRes] = useState<any>(undefined);
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
  useHotkeys("ctrl+k", () => setCommand(true), []);
  const [inErrState, setErrState] = useState(false);
  const [servers, setServers] = useState<Array<OnlineServer>>([]);
  const [filters, setFilters] = useState<
    Array<(server: OnlineServer) => Promise<boolean>>
  >([]);
  const [randomData, setRandomData] = useState<OnlineServer | undefined>(
    undefined,
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
        <Spinner className="  flex items-center" />
        <br />
        <div
          className="  flex justify-center"
          dangerouslySetInnerHTML={{ __html: randomText }}
        ></div>
      </>
    );
  }

  return (
    <>
      <div className="  max-lg:grid-cols-2 grid grid-cols-3 gap-4 ">
        <Stat
          title="Players online"
          desc={serverList.getExtraData().total_players.toString()}
          icon={CircleUser}
        />
        <Stat
          title="Servers online"
          desc={serverList.getExtraData().total_servers.toString()}
          icon={Network}
        />
        <Stat
          title="Current most popular server (in filter)"
          className="  max-lg:col-span-2"
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
      <div className="  mt-3 ml-3">
        <Button
          onClick={() => setCommand(true)}
          variant="secondary"
          className="  max-lg:mb-3"
        >
          Search <code className="ml-2">Ctrl+K</code>
        </Button>
        <Popover>
          <PopoverTrigger>
            <Button className="  ml-3" variant="secondary">
              Filter
              <code className="ml-2">{filters.length}</code>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="  w-[390px] z-3">
            <RadioGroup
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
                  },
                );
              }}
              defaultValue={(() => {
                if (nameFilters["smaller-tf"]) {
                  return "smaller";
                } else if (nameFilters["bigger-tf"]) {
                  return "bigger";
                } else {
                  return "none";
                }
              })()}
            >
              <div className="  items-top flex space-x-2">
                <RadioGroupItem id="smaller" value="smaller" />
                <div className="  grid gap-1.5 leading-none">
                  <label
                    htmlFor="smaller"
                    className="  text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Only allow smaller servers
                  </label>
                  <p className="  text-sm text-muted-foreground">
                    Server have 15-7 players, cannot be{" "}
                    <Badge variant="secondary">Always Online</Badge>
                  </p>
                </div>
              </div>
              <div className="  items-top flex space-x-2">
                <RadioGroupItem id="bigger" value="bigger" />
                <div className="  grid gap-1.5 leading-none">
                  <label
                    htmlFor="bigger"
                    className="  text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Only allow bigger servers
                  </label>
                  <p className="  text-sm text-muted-foreground">
                    Server has 16 players or more
                  </p>
                </div>
              </div>
              <div className="  items-top flex space-x-2">
                <RadioGroupItem id="none" value="none" />
                <div className="  grid gap-1.5 leading-none">
                  <label
                    htmlFor="none"
                    className="  text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Custom/no requirements
                  </label>
                </div>
              </div>
            </RadioGroup>
            <br />
            <br />
            <strong className="  pb-2">Tags</strong>
            <br />

            {allTags.map((tag) => (
              <div key={tag.docsName}>
                {tag.docsName && tag.__filter == undefined && (
                  <div className="  items-top flex space-x-2 pb-1">
                    <Checkbox
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
                    />
                    <div className="  grid gap-1.5 leading-none">
                      <label
                        htmlFor={tag.docsName}
                        className="  text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        <Badge variant={tag.role} className="  mr-1">
                          {tag.docsName}
                        </Badge>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            ))}
            <br />
            <strong>Categories</strong>
            <br />
            {allCategories.map((categorie) => (
              <div
                className="  items-top flex space-x-2 pb-1"
                key={categorie.name}
              >
                <Checkbox
                  id={categorie.name}
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
                />
                <div className="  grid gap-1.5 leading-none">
                  <label
                    htmlFor={categorie.name}
                    className="  text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    <Badge variant={categorie.role} className="  mr-1">
                      {categorie.name}
                    </Badge>
                  </label>
                </div>
              </div>
            ))}
          </PopoverContent>
        </Popover>
        <Button
          variant="secondary"
          className="  md:ml-3 "
          onClick={() => {
            setRandomData(serverList.getRandomServer());
            setRandom(true);
          }}
        >
          Pick Random Server
        </Button>
        <Button
          variant="secondary"
          className="  ml-3"
          onClick={() => {
            toast.promise(
              new Promise((s, e) => {
                setLoading(true);
                serverList
                  .fetchDataAndFilter()
                  .then(() => {
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
              },
            );
          }}
        >
          Refresh
        </Button>
        <Dialog open={random} onOpenChange={setRandom}>
          <DialogContent>
            {randomData == undefined && <>No data to randomize</>}
            {randomData != undefined && (
              <DialogHeader>
                <DialogTitle>
                  <IconDisplay server={randomData} /> {randomData.name}
                  {randomData.author != undefined ? (
                    <div className="  text-sm text-muted-foreground">
                      by {randomData.author}
                    </div>
                  ) : (
                    <br />
                  )}
                  <TagShower server={randomData} />
                </DialogTitle>
                <DialogDescription className="  float-left inline">
                  <span className="  flex items-center">
                    {randomData.playerData.playerCount == 0 ? (
                      <div
                        className="  items-center border"
                        style={{
                          width: ".5rem",
                          height: ".5rem",
                          borderRadius: "9999px",
                        }}
                      />
                    ) : (
                      <div
                        className="  items-center"
                        style={{
                          backgroundColor: "#0cce6b",
                          width: ".5rem",
                          height: ".5rem",
                          borderRadius: "9999px",
                        }}
                      />
                    )}

                    <span className="  pl-1">
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
                  <code className="  border p-3 rounded">
                    {randomData.name}.minehut.gg{" "}
                    <Button
                      size="icon"
                      className="  ml-1 h-[20px]"
                      onClick={() => {
                        setTextCopied(true);
                        navigator.clipboard.writeText(
                          randomData.name + ".minehut.gg",
                        );
                        toast.success("Copied!");
                        setTimeout(() => setTextCopied(false), 1000);
                      }}
                    >
                      {textCopied ? (
                        <Check size={16} className="  flex items-center" />
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
      </div>
      <CommandDialog open={command} onOpenChange={setCommand}>
        <CommandInput
          placeholder="Search for a server (offline or online)"
          onValueChange={(c) => {
            fetch("https://api.minehut.com/server/" + c + "?byName=true").then(
              (l) => {
                if (l.ok) {
                  console.log("found!");
                  l.json().then((m: any) => {
                    setSearchRes(m.server);
                    console.log(searchRes);
                  });
                } else {
                  setSearchRes(undefined);
                }
              },
            );
          }}
        />
        <CommandList>
          <CommandEmpty>
            No results found. (Minehut deleted legacy servers)
          </CommandEmpty>
          {searchRes == undefined ? (
            ""
          ) : (
            <CommandGroup heading="Search Results">
              <CommandItem
                onSelect={() => {
                  window.location.replace("/server/" + searchRes.name);
                }}
              >
                <div className="block">
                  <span className="font-medium">{searchRes.name}</span> <br />
                  <code className="text-gray-500 text-[14px]">
                    {searchRes.joins} total joins •{" "}
                    {searchRes.online ? "Online" : "Offline"}
                  </code>
                </div>
              </CommandItem>
            </CommandGroup>
          )}

          <CommandGroup heading="Popular Servers">
            {serverList.currentServers.map((b: OnlineServer) => (
              <CommandItem
                key={b.name}
                onSelect={() => {
                  window.location.replace("/server/" + b.name);
                }}
              >
                <div className="block">
                  <span className="font-medium">{b.name}</span> <br />
                  <code className="text-gray-500 text-[14px]">
                    <TagShower server={b} />
                  </code>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
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
        loader={<Spinner className="  flex items-center" />}
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
        <div className=" grid sm:grid-cols-4 gap-4">
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

export function TagShower(props: { server: OnlineServer; className?: string }) {
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
          <Dialog key={t.name}>
            <DialogTrigger>
              <Tooltip>
                <TooltipTrigger>
                  <Badge variant={t.role} className={"mr-1" + props.className}>
                    {t.name}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="  font-normal">
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
        </>
      ))}
    </>
  );
}
