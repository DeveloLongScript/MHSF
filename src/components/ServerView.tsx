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
import { useState, useEffect } from "react";
import {
  CardContent,
  CardDescription,
  CardTitle,
  BetterHeader,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "./ui/badge";
import ServerSingle from "@/lib/single";
import { motion } from "framer-motion";
import { Cake, Check, Heart, Star, Users, X } from "lucide-react";
import {
  favoriteServer,
  getCommunityServerFavorites,
  isFavorited,
} from "@/lib/api";
import { useTheme } from "next-themes";
import { Skeleton } from "./ui/skeleton";
import FadeIn from "react-fade-in/lib/FadeIn";
import { Button } from "./ui/button";
import IconDisplay from "./IconDisplay";
import { useClerk, useUser } from "@clerk/nextjs";
import { LoaderIcon } from "react-hot-toast";
import { Separator } from "./ui/separator";
import { convert } from "@/components/charts/NewChart";
import { LoadingSpinner } from "./ui/loading-spinner";
import { BadgeOfAffiliation } from "./Icon";

export default function ServerView(props: { server: string }) {
  const [single, setSingle] = useState(new ServerSingle(props.server));
  const [loading, setLoading] = useState(true);
  const [favorited, setFavorited] = useState(false);
  const { resolvedTheme } = useTheme();
  const [loadingFavorite, setLoadingFavorite] = useState(false);
  const [randomText, setRandomText] = useState("");
  const [lastOnline, setLastOnline] = useState(0);
  const { isSignedIn } = useUser();
  const [communityFavorited, setCommunityFavorited] = useState(0);
  const clerk = useClerk();
  const [format, setFormat] = useState("");
  const [description, setDescription] = useState("");
  const allText = [""];
  const getRandomText = () => {
    return allText[Math.floor(Math.random() * allText.length)];
  };

  useEffect(() => {
    setRandomText(getRandomText());

    single.init().then(() => {
      isFavorited(single.grabOffline()?.name as string)
        .then((b) => {
          setFavorited(b);
          setLoading(false);
          var online = single.grabOffline()?.last_online;
          if (online != undefined) {
            setLastOnline(online);
          }
        })
        .catch(() => {
          setLoading(false);
          var online = single.grabOffline()?.last_online;
          if (online != undefined) {
            setLastOnline(online);
          }
        });
      getCommunityServerFavorites(single.grabOffline()?.name as string).then(
        (b) => {
          setCommunityFavorited(b);
        }
      );
    });
  }, []);

  if (loading) {
    return (
      <>
        <div className="p-4">
          <Skeleton className="sm:col-span-2 h-[155px]" />
        </div>
      </>
    );
  }
  return (
    <>
      {single.grabOnline() == undefined && !single.grabOffline()?.online && (
        <div className="grid pl-4 pr-4">
          <div
            className=" rounded p-2"
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
      <FadeIn>
        <div className="flex items-center">
          <div className="bg-secondary p-4 rounded-lg ml-4">
            <IconDisplay
              server={single.grabOffline()}
              className="flex items-center"
            />
          </div>
          <div className="block">
            <BetterHeader>
              <CardTitle className="flex items-center">
                {single.grabOnline() == undefined &&
                !single.grabOffline()?.online ? (
                  <div
                    className="items-center mr-1"
                    style={{
                      width: ".75rem",
                      height: ".75rem",
                      borderRadius: "9999px",
                      backgroundColor: "#ff1744",
                    }}
                  />
                ) : (
                  <div
                    className="items-center mr-1"
                    style={{
                      width: ".75rem",
                      height: ".75rem",
                      borderRadius: "9999px",
                      backgroundColor: "#0cce6b",
                    }}
                  />
                )}
                {props.server}
                {props.server === "CoreBoxx" && (
                  <Tooltip>
                    <TooltipTrigger>
                      <BadgeOfAffiliation className="size-8 pl-2" />
                    </TooltipTrigger>
                    <TooltipContent className="font-normal tracking-normal flex items-center">
                      
                    <BadgeOfAffiliation className="size-8 pr-2" />
                    <span>
                      CoreBoxx is an official affiliate of MHSF. This server was
                      <br /> found to be a high-quality server and should be a
                      good join for any player!
                      </span>
                    </TooltipContent>
                  </Tooltip>
                )}
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

                {single.getAuthor() != undefined ? (
                  <p className="text-lg flex items-center">
                    by {single.getAuthor()}{" "}
                    <Button
                      className="h-7 ml-2"
                      variant={favorited ? "outline" : "favorite"}
                      onClick={() => {
                        if (!isSignedIn) {
                          clerk.openSignUp();
                          return;
                        }
                        setLoadingFavorite(true);
                        favoriteServer(
                          single.grabOffline()?.name as string
                        ).then(() => {
                          setLoadingFavorite(false);
                          setFavorited(!favorited);
                        });
                      }}
                      disabled={loadingFavorite}
                    >
                      {loadingFavorite && (
                        <LoadingSpinner className="mr-2 h-4 w-4" />
                      )}
                      {!favorited && !loadingFavorite && (
                        <motion.div
                          animate={{ opacity: 1, scale: 1 }}
                          initial={{ opacity: 0, scale: 0.3 }}
                          transition={{ duration: 0.25, ease: "linear" }}
                        >
                          <Star size={16} className="mr-2" />
                        </motion.div>
                      )}
                      {favorited && !loadingFavorite && (
                        <motion.div
                          animate={{ opacity: 1, scale: 1 }}
                          initial={{ opacity: 0, scale: 0.3 }}
                          transition={{ duration: 0.25, ease: "linear" }}
                        >
                          <Check size={16} className="mr-2" />
                        </motion.div>
                      )}
                      Favorite{favorited && "d"}
                    </Button>
                  </p>
                ) : (
                  <p className="text-lg flex items-center">
                    by Anonymous{" "}
                    <Button
                      className="h-7 ml-2"
                      variant={favorited ? "outline" : "favorite"}
                      onClick={() => {
                        if (!isSignedIn) {
                          clerk.openSignUp();
                          return;
                        }
                        setLoadingFavorite(true);
                        favoriteServer(
                          single.grabOffline()?.name as string
                        ).then(() => {
                          setLoadingFavorite(false);
                          setFavorited(!favorited);
                        });
                      }}
                      disabled={loadingFavorite}
                    >
                      {loadingFavorite && <LoaderIcon className="mr-2" />}
                      {!favorited && !loadingFavorite && (
                        <motion.div
                          animate={{ opacity: 1, scale: 1 }}
                          initial={{ opacity: 0, scale: 0.3 }}
                          transition={{ duration: 0.25, ease: "linear" }}
                        >
                          <Star size={16} className="mr-2" />
                        </motion.div>
                      )}
                      {favorited && !loadingFavorite && (
                        <motion.div
                          animate={{ opacity: 1, scale: 1 }}
                          initial={{ opacity: 0, scale: 0.3 }}
                          transition={{ duration: 0.25, ease: "linear" }}
                        >
                          <Check size={16} className="mr-2" />
                        </motion.div>
                      )}
                      Favorite{favorited && "d"}
                    </Button>
                  </p>
                )}
              </CardDescription>
            </BetterHeader>
            <CardContent>
              <p className="text-md font-semibold text-muted-foreground flex items-center">
                <>
                  <Heart className="mr-2" size={24} />
                  {convert(communityFavorited)}
                  <Separator orientation="vertical" className="ml-4 h-[30px]" />
                </>
                <>
                  <Users className="mr-2 ml-4" size={24} />{" "}
                  {convert(single.grabOffline()?.joins as number)}
                  <Separator orientation="vertical" className="ml-4 h-[30px]" />
                </>
                <>
                  <Cake className="mr-2 ml-4" size={24} />{" "}
                  {timeConverter(single.grabOffline()?.creation)}
                </>
              </p>
            </CardContent>
          </div>
        </div>
      </FadeIn>
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
