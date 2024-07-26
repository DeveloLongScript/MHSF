"use client";
import { useState, useEffect } from "react";
import { Spinner } from "./ui/spinner";
import IconDisplay from "./IconDisplay";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  BetterHeader,
} from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import beautify from "json-beautify";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "./ui/badge";
import Editor from "@monaco-editor/react";
import { allTags } from "@/allTags";
import ServerSingle from "@/lib/single";
import { parse, parseExpression } from "@babel/parser";
import { NEXT_ROUTER_STATE_TREE } from "next/dist/client/components/app-router-headers";
import { Button } from "./ui/button";
import * as prettierPluginBabel from "prettier/plugins/babel";
import toast from "react-hot-toast";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import SignInPopoverButton from "./clerk/SignInPopoverButton";
import { Sparkle, Star, X } from "lucide-react";

export default function ServerView(props: { server: string }) {
  const [single, setSingle] = useState(new ServerSingle(props.server));
  const [loading, setLoading] = useState(true);
  const [favorited, setFavorited] = useState(false);
  const [randomText, setRandomText] = useState("");
  const [lastOnline, setLastOnline] = useState(0);
  const [format, setFormat] = useState("");
  const allText = [""];
  const getRandomText = () => {
    return allText[Math.floor(Math.random() * allText.length)];
  };

  useEffect(() => {
    setRandomText(getRandomText());
    single.init().then(() => {
      fetch("/api/favorites/isFavorited", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          server: single.grabOffline()?.name,
        }),
      })
        .then((b) => {
          b.json().then((c) => {
            setFavorited(c.result);
            setLoading(false);
            var online = single.grabOffline()?.last_online;
            if (online != undefined) {
              setLastOnline(online);
            }
          });
        })
        .catch(() => {
          setLoading(false);
          var online = single.grabOffline()?.last_online;
          if (online != undefined) {
            setLastOnline(online);
          }
        });
    });
  }, []);

  if (loading) {
    return (
      <>
        <Spinner className="flex items-center" />
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
      {single.grabOnline() == undefined && (
        <div className="  grid pl-4 pr-4">
          <div
            className="   rounded p-2"
            style={{ backgroundColor: "rgba(244, 63, 94, .16)" }}
          >
            <strong className="flex items-center">
              This server is offline <X />
            </strong>
            <p>
              This means that the server can{"'"}t loading some resources, like
              tags, icons and authors. However, all historical data still is
              stored and works.
            </p>
          </div>
        </div>
      )}

      <div className="  grid p-4 sm:grid-cols-3 gap-4">
        <Card className="  sm:col-span-2">
          <BetterHeader>
            <CardTitle className="  flex items-center">
              {single.grabOnline() == undefined ? (
                <div
                  className="  items-center mr-1"
                  style={{
                    width: ".75rem",
                    height: ".75rem",
                    borderRadius: "9999px",
                    backgroundColor: "#ff1744",
                  }}
                />
              ) : (
                <div
                  className="  items-center mr-1"
                  style={{
                    width: ".75rem",
                    height: ".75rem",
                    borderRadius: "9999px",
                    backgroundColor: "#0cce6b",
                  }}
                />
              )}
              {props.server}
            </CardTitle>
            <CardDescription>
              {/* 1704088800000 is the Unix time (in milliseconds) of (GMT) Monday, January 1, 2024 6:00:00 AM */}
              {lastOnline < 1704088800000 &&
                single.grabOnline() == undefined && (
                  <Tooltip>
                    <TooltipTrigger>
                      <Badge variant="secondary">
                        Server too old to grab data
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      This server was last online before 1/1/24 or{" "}
                      <code>(GMT) Monday, January 1, 2024 6:00:00 AM</code>,
                      <br />
                      meaning data like tags, authors and other information
                      about the server cannot be seen.
                    </TooltipContent>
                  </Tooltip>
                )}

              {single.getAuthor() != undefined && (
                <p>by {single.getAuthor()}</p>
              )}
            </CardDescription>
          </BetterHeader>
          <CardContent>
            <p>
              <strong>Time:</strong>
              <br />
              <i>Last online</i>{" "}
              <Tooltip>
                <TooltipTrigger>
                  <code>
                    {timeConverter(single.grabOffline()?.last_online)}
                  </code>
                </TooltipTrigger>
                <TooltipContent>
                  <code>{single.grabOffline()?.last_online}</code> in Unix time
                </TooltipContent>
              </Tooltip>{" "}
              <br />
              <i>Created on</i>{" "}
              <Tooltip>
                <TooltipTrigger>
                  <code>{timeConverter(single.grabOffline()?.creation)}</code>
                </TooltipTrigger>
                <TooltipContent>
                  <code>{single.grabOffline()?.creation}</code> in Unix time
                </TooltipContent>
              </Tooltip>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Favorite the server?</CardTitle>
            <CardDescription>
              By favoriting the server, you can see it later.{" "}
              <SignedOut>
                <strong>You need to sign in to favorite a server.</strong>
              </SignedOut>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignedOut>
              <SignInPopoverButton />
            </SignedOut>
            <SignedIn>
              <Button
                variant="outline"
                onClick={() => {
                  fetch("/api/favorites/favoriteServer", {
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      server: single.grabOffline()?.name,
                    }),
                    method: "POST",
                  }).then(() => {});
                  setFavorited(!favorited);
                }}
              >
                {favorited && (
                  <motion.div
                    animate={{ color: "yellow", fill: "yellow" }}
                    transition={{ duration: 2 }}
                  >
                    <Star
                      className="mr-2"
                      size="16"
                      color="yellow"
                      fill="yellow"
                    />
                  </motion.div>
                )}
                {!favorited && (
                  <motion.div
                    transition={{ duration: 1 }}
                    animate={{ color: "yellow", fill: "yellow" }}
                  >
                    <Star className="mr-2" size="16" />
                  </motion.div>
                )}
                Favorite Server
              </Button>
            </SignedIn>
          </CardContent>
          <CardFooter>
            <small>
              This is unlike voting. The{" "}
              <i>amount of people who favorited are public</i>, but the server
              doesn{"'"}t know who favorited, as Favorites are completely
              anonymous.
            </small>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}

function timeConverter(UNIX_timestamp: any) {
  var a = new Date(UNIX_timestamp);
  var months = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var time = month + "/" + date + "/" + year;
  return time;
}

export interface ServerResponse {
  __unix?: string;
  deletion?: Deletion;
  _id: string;
  categories: string[];
  inheritedCategories: any[];
  purchased_icons: string[];
  backup_slots: number;
  suspended: boolean;
  server_version_type: string;
  proxy: boolean;
  connectedServers: any[];
  motd: string;
  visibility: boolean;
  server_plan: string;
  storage_node: string;
  default_banner_image: string;
  default_banner_tint: string;
  owner: string;
  name: string;
  name_lower: string;
  creation: number;
  platform: string;
  credits_per_day: number;
  in_game: boolean;
  using_cosmetics: boolean;
  __v: number;
  port: number;
  last_online: number;
  joins: number;
  active_icon: string;
  expired: boolean;
  icon: string;
  online: boolean;
  maxPlayers: number;
  playerCount: number;
  rawPlan: string;
  activeServerPlan: string;
}

export interface Deletion {
  started: boolean;
  started_at: number;
  reason: string;
  completed: boolean;
  completed_at: number;
  storage_completed: boolean;
  storage_completed_at: number;
}

export interface OnlineServer {
  staticInfo: StaticInfo;
  maxPlayers: number;
  name: string;
  motd: string;
  icon: string;
  playerData: PlayerData;
  connectable: boolean;
  visibility: boolean;
  allCategories: string[];
  usingCosmetics: boolean;
  author?: string;
  authorRank: string;
}

export interface StaticInfo {
  _id: string;
  serverPlan: string;
  serviceStartDate: number;
  platform: string;
  planMaxPlayers: number;
  planRam: number;
  alwaysOnline: boolean;
  rawPlan: string;
  connectedServers: any[];
}

export interface PlayerData {
  playerCount: number;
  timeNoPlayers: number;
}
