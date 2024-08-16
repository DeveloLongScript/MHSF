"use client";
import { useEffect, useState } from "react";
import { Spinner } from "./ui/spinner";
import { sortedFavorites } from "@/lib/api";
import InfiniteScroll from "react-infinite-scroll-component";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { useRouter } from "@/lib/useRouter";
import { OnlineServer } from "@/lib/types/mh-server";
import ServerCard from "./ServerCard";
import { CircleUser, Copy, Info, Layers, Network } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { BorderBeam } from "./effects/border-beam";
import Stat from "./Stat";
import { Separator } from "./ui/separator";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import Link from "next/link";
import toast from "react-hot-toast";

export default function FavoriteSortView() {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState<{ server: string; favorites: number }[]>([]);
  const [allItems, setAllItems] = useState<
    Array<{ server: string; favorites: number }>
  >([]);
  const [upNumber, setUpNumber] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [totalServers, setTotalServers] = useState(0);
  const [totalPlayers, setTotalPlayers] = useState(0);
  const [online, setOnline] = useState<any>({});
  const router = useRouter();

  useEffect(() => {
    sortedFavorites().then((c) => {
      if (typeof c !== "boolean") {
        const slicedArray = c.slice(0, 20);
        setAllItems(slicedArray);
        setList(c);
        fetch("https://api.minehut.com/servers").then((b) =>
          b.json().then((c) => {
            c.servers.forEach((v: OnlineServer) =>
              setOnline(setManipulate(online, v.name, v))
            );
            setLoading(false);
            setTotalPlayers(c.total_players);
            setTotalServers(c.total_servers);
          })
        );

        console.log(list);
      }
    });
  }, []);

  if (loading) {
    return <Spinner className="flex items-center" />;
  }

  return (
    <div>
      <div className="max-lg:grid-cols-2 grid grid-cols-2 gap-4 ">
        <Stat
          title="Players online"
          desc={totalPlayers.toString()}
          icon={CircleUser}
        />
        <Stat
          title={
            <div
              className={
                totalServers >= 3200
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
                  totalServers >= 3200
                    ? "bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-500 "
                    : ""
                }
              >
                {totalServers.toString()}
              </div>
              {totalServers >= 3200 && (
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
          {totalServers >= 3200 && (
            <BorderBeam
              size={135}
              duration={12}
              delay={9}
              colorFrom="rgb(6 182 212)"
              colorTo="rgb(59 130 246)"
            />
          )}
        </Stat>
      </div>
      <br />
      <Separator />
      <br />
      <Popover>
        <PopoverTrigger>
          <Button className="ml-2" variant="secondary">
            Sort
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <RadioGroup
            defaultValue="option-two"
            onValueChange={() => router.push("/")}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="option-one" id="option-one" />
              <Label htmlFor="option-one">Online Players</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="option-two" id="option-two" />
              <Label htmlFor="option-two">Favorites</Label>
            </div>
          </RadioGroup>
        </PopoverContent>
      </Popover>
      <Button
        variant="secondary"
        className="ml-2"
        onClick={() => {
          setLoading(true);
          sortedFavorites().then((c) => {
            if (typeof c !== "boolean") {
              const slicedArray = c.slice(0, 20);
              setAllItems(slicedArray);
              setList(c);
              fetch("https://api.minehut.com/servers").then((b) =>
                b.json().then((c) => {
                  c.servers.forEach((v: OnlineServer) =>
                    setOnline(setManipulate(online, v.name, v))
                  );
                  setLoading(false);
                  setTotalPlayers(c.total_players);
                  setTotalServers(c.total_servers);
                })
              );

              console.log(list);
            }
          });
        }}
      >
        Refresh
      </Button>
      <br />
      <br />

      <InfiniteScroll
        dataLength={list.length}
        hasMore={hasMore}
        next={() => {
          const newUpNumber = upNumber + 1;
          const slicedArray = list.slice(
            newUpNumber * 20,
            newUpNumber * 20 + 20
          );
          console.log(slicedArray.length);

          setAllItems((prev) => [...prev, ...slicedArray]);
          if (slicedArray.length !== 20) setHasMore(false);
          setUpNumber(newUpNumber);
        }}
        loader={<br />}
        endMessage={
          <p style={{ textAlign: "center" }}>
            <br />
            <strong>You've seen it all</strong>
          </p>
        }
        style={{ overflow: "hidden", paddingLeft: 6 }}
      >
        <div className="grid sm:grid-cols-4 gap-4">
          {allItems.map((v) => {
            if (v.favorites == 0) {
              return <></>;
            }

            if (online[v.server] != undefined)
              return (
                <ServerCard
                  mini
                  b={online[v.server]}
                  favs={v.favorites}
                  key={v.server}
                />
              );
            else
              return (
                <Card className="h-[226px]" key={v.server}>
                  <CardHeader>
                    <CardTitle>{v.server}</CardTitle>
                    <CardDescription>
                      {v.favorites} favorited
                      <br />
                      <Button
                        size="icon"
                        variant="secondary"
                        className="min-w-[128px] max-w-[328px] h-[32px] mt-2 ml-2 max-md:hidden"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            v.server + ".mshf.minehut.gg"
                          );
                          toast.success("Copied IP to clipboard");
                        }}
                      >
                        <Copy size={18} />
                        <code className="ml-2">{v.server}</code>
                      </Button>
                      <Tooltip>
                        <TooltipTrigger>
                          <Link href={"/server/" + v.server}>
                            <Button
                              size="icon"
                              variant="secondary"
                              className="w-[32px] h-[32px] mt-2 ml-2 max-md:hidden"
                            >
                              <Layers size={18} />
                            </Button>
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                          Open up the server page to see more information about
                          the server
                        </TooltipContent>
                      </Tooltip>
                    </CardDescription>
                  </CardHeader>
                </Card>
              );
          })}
        </div>
      </InfiniteScroll>
    </div>
  );
}

function setManipulate(object: any, change: string, value: any) {
  let newObject = object;
  newObject[change] = value;
  return newObject;
}
