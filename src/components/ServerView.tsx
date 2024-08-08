"use client";
import { useState, useEffect } from "react";
import { Spinner } from "./ui/spinner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  BetterHeader,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "./ui/badge";
import ServerSingle from "@/lib/single";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import SignInPopoverButton from "./clerk/SignInPopoverButton";
import { Star, X } from "lucide-react";
import { favoriteServer, isFavorited } from "@/lib/api";
import { LoadingButton } from "./ui/loading-button";
import { useTheme } from "next-themes";

export default function ServerView(props: { server: string }) {
  const [single, setSingle] = useState(new ServerSingle(props.server));
  const [loading, setLoading] = useState(true);
  const [favorited, setFavorited] = useState(false);
  const { resolvedTheme } = useTheme();
  const [loadingFavorite, setLoadingFavorite] = useState(false);
  const [randomText, setRandomText] = useState("");
  const [lastOnline, setLastOnline] = useState(0);
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
    });
  }, []);

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
      {single.grabOnline() == undefined && (
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

      <div className="grid p-4 sm:grid-cols-3 gap-4">
        <Card className="sm:col-span-2">
          <BetterHeader>
            <CardTitle className="flex items-center">
              {single.grabOnline() == undefined ? (
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
              <LoadingButton
                variant={resolvedTheme == "dark" ? "outline" : "default"}
                loading={loadingFavorite}
                onClick={() => {
                  setLoadingFavorite(true);
                  favoriteServer(single.grabOffline()?.name as string).then(
                    () => {
                      setFavorited(!favorited);
                      setLoadingFavorite(false);
                    }
                  );
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
                {favorited && "Unf"}
                {!favorited && "F"}avorite Server
              </LoadingButton>
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
