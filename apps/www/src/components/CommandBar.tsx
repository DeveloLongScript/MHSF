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
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { useEffect, useState } from "react";
import events from "@/lib/commandEvent";
import { useHotkeys } from "react-hotkeys-hook";
import {
  ArrowDown01,
  ArrowLeft,
  Calendar,
  CheckIcon,
  CommandIcon,
  Database,
  LinkIcon,
  Server,
  ServerCog,
  Settings,
  Star,
  XIcon,
} from "lucide-react";
import { useEffectOnce } from "@/lib/useEffectOnce";
import { useClerk, useUser } from "@clerk/nextjs";
import { useRouter } from "@/lib/useRouter";
import type { SVGProps } from "react";
import {
  favoriteServer,
  getAccountFavorites,
  isFavorited,
  serverOwned,
} from "@/lib/api";
import IconDisplay from "./IconDisplay";
import ServerSingle from "@/lib/single";
import { toast } from "sonner";
import { ServerResponse, OnlineServer } from "@/lib/types/mh-server";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { TagShower } from "./ServerList";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";
import { CheckmarkIcon } from "react-hot-toast";

export function SearchCommandBar() {
  const [serverList, setServerList] = useState<OnlineServer[]>([]);
  const [open, setOpen] = useState(false);
  const [backEnabled, setBackEnabled] = useState(false);
  const [searchRes, setSearchRes] = useState<ServerResponse | undefined>(
    undefined
  );
  const router = useRouter();
  useHotkeys("mod+shift+k", () => setOpen(true), []);

  useEffectOnce(() => {
    events.on("search-request-event", () => {
      setOpen(true);
      setSearchRes(undefined);
    });
    events.on("search-request-event-back", () => {
      setOpen(true);
      setBackEnabled(true);
      setSearchRes(undefined);
    });

    fetch("https://api.minehut.com/servers").then((c) =>
      c.json().then((b: { servers: OnlineServer[] }) => {
        setServerList(b.servers.slice(0, 20));
      })
    );
  });

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      shouldFilter={searchRes == undefined}
    >
      <CommandInput
        placeholder="Search for a server (offline or online)"
        onValueChange={(c) => {
          if (c != "") {
            fetch("https://api.minehut.com/server/" + c + "?byName=true").then(
              (l) => {
                l.json().then((m: any) => {
                  if (m.server != null) {
                    console.log(m);
                    setSearchRes(m.server);
                  } else {
                    setSearchRes(undefined);
                  }
                });
              }
            );
          }
        }}
      />
      <CommandList>
        {searchRes != undefined && (
          <CommandGroup heading="Search Result">
            <CommandItem
              onSelect={() => {
                if (!backEnabled) events.emit("cmd-offline", searchRes);
                if (backEnabled) events.emit("cmd-offline-vb", searchRes);
                setOpen(false);
              }}
            >
              {searchRes?.name}
            </CommandItem>
          </CommandGroup>
        )}

        {searchRes == undefined && (
          <CommandGroup heading="Popular Servers">
            {serverList.map((b: OnlineServer) => (
              <CommandItem
                key={b.name}
                onSelect={() => {
                  if (!backEnabled)
                    events.emit("cmd-server", {
                      serverName: b.name,
                      serverObject: b,
                    });
                  if (backEnabled)
                    events.emit("cmd-server-vb", {
                      serverName: b.name,
                      serverObject: b,
                    });
                  setOpen(false);
                }}
              >
                <IconDisplay server={b} className="mr-2" />
                {b.name}
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        <CommandGroup heading="Hierarchy">
          <CommandItem
            onSelect={() => {
              setOpen(false);
              if (backEnabled) events.emit("cmd-event");
              setBackEnabled(false);
            }}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span>Go back</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

export function OfflineServerCB() {
  const [open, setOpen] = useState(false);
  const [customized, setCustomized] = useState(false);
  const [obj, setObj] = useState<ServerResponse | object>({});
  const [vb, setVB] = useState(false);
  const { isSignedIn } = useUser();
  const router = useRouter();
  const [starred, setStarred] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    events.on("cmd-offline", (info: ServerResponse) => {
      if (info.online) {
        fetch("https://api.minehut.com/servers").then((c) => {
          c.json().then((b: { servers: OnlineServer[] }) => {
            const filteredRes = b.servers.filter(
              (value) => value.name == info.name
            );
            if (filteredRes.length != 0) {
              events.emit("cmd-server", {
                serverName: filteredRes[0].name,
                serverObject: filteredRes[0],
              });
            } else {
              toast.error("Couldn't find server");
            }
          });
        });
      } else {
        isFavorited(info.name).then((b) => setStarred(b));
        setVB(false);
        setOpen(true);
        setObj(info);
        serverOwned(info.name).then((b) => setCustomized(b));
      }
    });
    events.on("cmd-offline-vb", (info: ServerResponse) => {
      if (info.online) {
        fetch("https://api.minehut.com/servers").then((c) => {
          c.json().then((b: { servers: OnlineServer[] }) => {
            const filteredRes = b.servers.filter(
              (value) => value.name == info.name
            );
            if (filteredRes.length != 0) {
              events.emit("cmd-server-vb", {
                serverName: filteredRes[0].name,
                serverObject: filteredRes[0],
              });
            } else {
              toast.error("Couldn't find server");
            }
          });
        });
      } else {
        isFavorited(info.name).then((b) => setStarred(b));
        setOpen(true);
        setVB(true);
        setObj(info);
        serverOwned(info.name).then((b) => setCustomized(b));
      }
    });
  }, []);
  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        {Object.keys(obj).length != 0 && (
          <div className="m-4 dark:bg-ring min-h-[150px] rounded p-4 dark:text-white">
            <h1 className="font-bold text-2xl">
              {(obj as ServerResponse).name}
            </h1>
            <h2 className="flex items-center text-muted-foreground">
              <XIcon />
              <span className="pl-1.5 text-[16px]">
                Server offline currently
              </span>
            </h2>
            <h2 className="flex items-center text-muted-foreground">
              <Calendar />
              <span className="pl-1.5 text-[16px]">
                Created in {timeConverter((obj as ServerResponse).creation)}
              </span>
            </h2>

            {customized && (
              <h2 className="flex items-center text-muted-foreground">
                <CheckmarkIcon />
                <span className="pl-1.5 text-[16px]">
                  Is customized by a MHSF User
                </span>
              </h2>
            )}
          </div>
        )}
        <CommandGroup heading="Server Actions">
          <CommandItem
            onSelect={() => {
              router.push("/server/" + (obj as ServerResponse).name + "/");
              setOpen(false);
            }}
          >
            <Server className="mr-2 h-4 w-4" />
            Open Server Page
          </CommandItem>
          <CommandItem
            onSelect={() => {
              favoriteServer((obj as ServerResponse).name).then(() => {
                setStarred(!starred);
                toast.success("Done!");
              });
            }}
            disabled={!isSignedIn}
          >
            <Star
              className="mr-2 h-4 w-4"
              fill={
                starred == true
                  ? resolvedTheme == "dark"
                    ? "white"
                    : "black"
                  : "transparent"
              }
            />
            {!starred ? "F" : "Unf"}avorite Server
          </CommandItem>
          <CommandItem
            onSelect={() => {
              router.push(
                "/server/" + (obj as ServerResponse).name + "/statistics"
              );
              setOpen(false);
            }}
          >
            <Database className="mr-2 h-4 w-4" />
            See Statistics
          </CommandItem>
        </CommandGroup>
        <CommandGroup heading="Hierarchy">
          <CommandItem
            onSelect={() => {
              setOpen(false);
              if (vb) events.emit("search-request-event-back");
              if (!vb) events.emit("search-request-event");
            }}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go back
          </CommandItem>
          {vb && (
            <CommandItem
              onSelect={() => {
                setOpen(false);
                events.emit("cmd-event");
              }}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to main
            </CommandItem>
          )}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

export function ServerCommandBar() {
  const [open, setOpen] = useState(false);
  const [serverName, setServerName] = useState("");
  const [obj, setObj] = useState<OnlineServer | object>({});
  const [vb, setVB] = useState(false);
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const { isSignedIn } = useUser();
  const [owned, setOwned] = useState(false);
  const [starred, setStarred] = useState(false);
  const [serverSingle, setSingle] = useState<ServerSingle>(
    new ServerSingle(serverName)
  );

  useEffect(() => {
    events.on("cmd-server", (info) => {
      serverSingle.setName(info.serverName);
      if (serverSingle != undefined)
        (serverSingle as ServerSingle).init(true).then(() => {
          isFavorited(info.serverName).then((b) => setStarred(b));
          setServerName(info.serverName);
          setObj(info.serverObject);
          setOpen(true);
          serverSingle.isCustomized().then((b) => setOwned(b));
        });
    });
    events.on("cmd-server-vb", (info) => {
      serverSingle.setName(info.serverName);
      setVB(true);
      if (serverSingle != undefined)
        (serverSingle as ServerSingle).init(true).then(() => {
          setServerName(info.serverName);
          setObj(info.serverObject);
          setOpen(true);
          serverSingle.isCustomized().then((b) => setOwned(b));
        });
    });
  }, []);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        {Object.keys(obj).length != 0 && (
          <div className="m-4 dark:bg-ring min-h-[150px] rounded p-4 dark:text-white">
            <h1 className="font-bold text-2xl">
              <IconDisplay server={obj} />
              {serverName}
            </h1>
            {(obj as OnlineServer).author != undefined && (
              <h1 className="text-muted-foreground">
                by {(obj as OnlineServer).author}
              </h1>
            )}

            <h2 className="flex items-center text-muted-foreground pt-[15px] pl-1.5">
              <span className="relative flex h-[10px] w-[10px]">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black dark:bg-[#0cce6b] opacity-75" />
                <span className="relative inline-flex rounded-full h-[10px] w-[10px] bg-black dark:bg-[#0cce6b]" />
              </span>{" "}
              <span className="pl-1.5 text-[16px]">
                {(obj as OnlineServer).playerData.playerCount} online currently
              </span>
            </h2>
            <h2 className="flex items-center text-muted-foreground">
              <Calendar />
              <span className="pl-1.5 text-[16px]">
                Created in{" "}
                {timeConverter(
                  (serverSingle as ServerSingle).grabOffline()?.creation
                )}
              </span>
            </h2>
            {owned && (
              <h2 className="flex items-center text-muted-foreground">
                <CheckIcon />
                <span className="pl-1.5 text-[16px]">
                  Is customized by a MHSF User
                </span>
              </h2>
            )}
          </div>
        )}

        <CommandGroup heading="Server Actions">
          <CommandItem
            onSelect={() => {
              router.push("/server/" + serverName + "/");
              setOpen(false);
            }}
          >
            <Server className="mr-2 h-4 w-4" />
            Open Server Page
          </CommandItem>
          <CommandItem
            onSelect={() => {
              favoriteServer(serverName).then(() => {
                setStarred(!starred);
                toast.success("Done!");
              });
            }}
            disabled={!isSignedIn}
          >
            <Star
              className="mr-2 h-4 w-4"
              fill={
                starred == true
                  ? resolvedTheme == "dark"
                    ? "white"
                    : "black"
                  : "transparent"
              }
            />
            {!starred ? "F" : "Unf"}avorite Server
          </CommandItem>
          <CommandItem
            onSelect={() => {
              router.push("/server/" + serverName + "/statistics");
              setOpen(false);
            }}
          >
            <Database className="mr-2 h-4 w-4" />
            See Statistics
          </CommandItem>
        </CommandGroup>
        <CommandGroup heading="Hierarchy">
          <CommandItem
            onSelect={() => {
              setOpen(false);
              if (vb) events.emit("search-request-event-back");
              if (!vb) events.emit("search-request-event");
            }}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go back
          </CommandItem>
          {vb && (
            <CommandItem
              onSelect={() => {
                setOpen(false);
                events.emit("cmd-event");
              }}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to main
            </CommandItem>
          )}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

function timeConverter(UNIX_timestamp: any) {
  const a = new Date(UNIX_timestamp);
  const months = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
  ];
  const year = a.getFullYear();
  const month = months[a.getMonth()];
  const date = a.getDate();
  const time = month + "/" + date + "/" + year;
  return time;
}

export function CommandBar() {
  const [open, setOpen] = useState(false);
  const clerk = useClerk();
  const { user } = useUser();
  useHotkeys("mod+k", () => setOpen(true), []);

  useEffectOnce(() => {
    events.on("cmd-event", () => {
      setOpen(true);
    });
  });

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="General">
          <CommandItem
            onSelect={() => {
              setOpen(false);
              events.emit("search-request-event-back");
            }}
          >
            <Server className="mr-2 h-4 w-4" />
            <span>Servers</span>
            <CommandShortcut className="flex items-center">
              <CommandIcon size={10} />
              +Shift+K
            </CommandShortcut>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              setOpen(false);
              events.emit("cmd-event-link");
            }}
          >
            <LinkIcon className="mr-2 h-4 w-4" />
            <span>Links</span>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              setOpen(false);
              events.emit("cmd-ran-server");
            }}
          >
            <ServerCog className="mr-2 h-4 w-4" />
            <span>Pick Random Server</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Profile">
          <CommandItem
            onSelect={() => {
              events.emit("cmd-event-favorites");
              setOpen(false);
            }}
          >
            <Star className="mr-2 h-4 w-4" />
            <span>Favorites</span>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              try {
                clerk.openUserProfile();
              } catch {
                clerk.openSignIn();
              }
            }}
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>User Settings</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

export function RandomServerDialog() {
  const [textCopied, setTextCopied] = useState(false);
  const [randomData, setRandomData] = useState<OnlineServer | undefined>(
    undefined
  );
  const [open, setOpen] = useState(false);

  useEffect(() => {
    events.on("cmd-ran-server", () => {
      setRandomData(undefined);
      setTextCopied(false);
      fetch("https://api.minehut.com/servers").then((c) =>
        c.json().then((b: { servers: OnlineServer[] }) => {
          setRandomData(
            b.servers[Math.floor(Math.random() * b.servers.length)]
          );
          setOpen(true);
        })
      );
    });
  }, []);
  const onChange = (state: boolean) => {
    if (state == false) {
      setOpen(false);
      events.emit("cmd-event");
    } else setOpen(state);
  };

  return (
    <Dialog open={open} onOpenChange={onChange}>
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
                {randomData.name}.mshf.minehut.gg{" "}
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
                    <CheckIcon size={16} className="flex items-center" />
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
  );
}

export function SubLinkCommandBar() {
  const [open, setOpen] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffectOnce(() => {
    events.on("cmd-event-link", () => {
      setOpen(true);
    });
  });

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Suggestions">
          <CommandItem
            onSelect={() => {
              window
                .open("https://github.com/DeveloLongScript/MHSF", "_blank")
                ?.focus();
            }}
          >
            <Github
              className="mr-2 h-4 w-4"
              fill={resolvedTheme == "dark" ? "white" : "black"}
            />
            <span>GitHub</span>
          </CommandItem>

          <CommandItem
            onSelect={() => {
              window.open("https://mhsf.betteruptime.com", "_blank")?.focus();
            }}
          >
            <ArrowDown01 className="mr-2 h-4 w-4" />
            <span>Status Page</span>
          </CommandItem>
        </CommandGroup>
        <CommandGroup heading="Hierarchy">
          <CommandItem
            onSelect={() => {
              setOpen(false);
              events.emit("cmd-event");
            }}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go back
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
const Github = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 256 250"
    width="1em"
    height="1em"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid"
    {...props}
  >
    <path d="M128.001 0C57.317 0 0 57.307 0 128.001c0 56.554 36.676 104.535 87.535 121.46 6.397 1.185 8.746-2.777 8.746-6.158 0-3.052-.12-13.135-.174-23.83-35.61 7.742-43.124-15.103-43.124-15.103-5.823-14.795-14.213-18.73-14.213-18.73-11.613-7.944.876-7.78.876-7.78 12.853.902 19.621 13.19 19.621 13.19 11.417 19.568 29.945 13.911 37.249 10.64 1.149-8.272 4.466-13.92 8.127-17.116-28.431-3.236-58.318-14.212-58.318-63.258 0-13.975 5-25.394 13.188-34.358-1.329-3.224-5.71-16.242 1.24-33.874 0 0 10.749-3.44 35.21 13.121 10.21-2.836 21.16-4.258 32.038-4.307 10.878.049 21.837 1.47 32.066 4.307 24.431-16.56 35.165-13.12 35.165-13.12 6.967 17.63 2.584 30.65 1.255 33.873 8.207 8.964 13.173 20.383 13.173 34.358 0 49.163-29.944 59.988-58.447 63.157 4.591 3.972 8.682 11.762 8.682 23.704 0 17.126-.148 30.91-.148 35.126 0 3.407 2.304 7.398 8.792 6.14C219.37 232.5 256 184.537 256 128.002 256 57.307 198.691 0 128.001 0Zm-80.06 182.34c-.282.636-1.283.827-2.194.39-.929-.417-1.45-1.284-1.15-1.922.276-.655 1.279-.838 2.205-.399.93.418 1.46 1.293 1.139 1.931Zm6.296 5.618c-.61.566-1.804.303-2.614-.591-.837-.892-.994-2.086-.375-2.66.63-.566 1.787-.301 2.626.591.838.903 1 2.088.363 2.66Zm4.32 7.188c-.785.545-2.067.034-2.86-1.104-.784-1.138-.784-2.503.017-3.05.795-.547 2.058-.055 2.861 1.075.782 1.157.782 2.522-.019 3.08Zm7.304 8.325c-.701.774-2.196.566-3.29-.49-1.119-1.032-1.43-2.496-.726-3.27.71-.776 2.213-.558 3.315.49 1.11 1.03 1.45 2.505.701 3.27Zm9.442 2.81c-.31 1.003-1.75 1.459-3.199 1.033-1.448-.439-2.395-1.613-2.103-2.626.301-1.01 1.747-1.484 3.207-1.028 1.446.436 2.396 1.602 2.095 2.622Zm10.744 1.193c.036 1.055-1.193 1.93-2.715 1.95-1.53.034-2.769-.82-2.786-1.86 0-1.065 1.202-1.932 2.733-1.958 1.522-.03 2.768.818 2.768 1.868Zm10.555-.405c.182 1.03-.875 2.088-2.387 2.37-1.485.271-2.861-.365-3.05-1.386-.184-1.056.893-2.114 2.376-2.387 1.514-.263 2.868.356 3.061 1.403Z" />
  </svg>
);
export function FavoriteBar() {
  const [isOpen, setOpen] = useState(false);
  const [favorites, setFavorites] = useState<Array<string> | undefined>(
    undefined
  );
  const clerk = useClerk();
  const router = useRouter();

  useEffectOnce(() => {
    events.on("cmd-event-favorites", () => setOpen(true));
    getAccountFavorites().then((c) => setFavorites(c));
  });

  return (
    <CommandDialog open={isOpen} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Favorites">
          {favorites == undefined && (
            <CommandItem onSelect={() => clerk.openSignIn()}>
              Login to see favorites
            </CommandItem>
          )}
          {favorites != undefined && (
            <>
              {favorites.map((c) => (
                <CommandItem
                  key={c}
                  onSelect={() => {
                    router.push("/server/" + c);
                    setOpen(false);
                  }}
                >
                  {c}
                </CommandItem>
              ))}
            </>
          )}
        </CommandGroup>
        <CommandGroup heading="Hierarchy">
          <CommandItem
            onSelect={() => {
              setOpen(false);
              events.emit("cmd-event");
            }}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go back
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
export function CommandBarer() {
  return (
    <>
      <FavoriteBar />
      <SubLinkCommandBar />
      <CommandBar />
      <SearchCommandBar />
      <ServerCommandBar />
      <OfflineServerCB />
      <RandomServerDialog />
    </>
  );
}
