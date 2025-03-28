/*
 * MHSF, Minehut Server List
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
  getCustomization,
  ownServer,
  reportServer,
  serverOwned as sOFunc,
  setCustomization,
  unownServer,
  userOwnedServer,
} from "@/lib/api";
import { OnlineServer } from "@/lib/types/mh-server";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckIcon, X } from "lucide-react";
import Link from "next/link";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import Setting from "./ui/setting";
import { Textarea } from "./ui/textarea";
import "@/themes.css";
import { themes } from "@/lib/themes";
import Editor from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { BannerPopover } from "./misc/BannerPopover";
import { DiscordPopover } from "./misc/DiscordPopover";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { LoadingSpinner } from "./ui/loading-spinner";

const formSchema = z.object({
  description: z
    .string()
    .min(2, {
      message: "Description must be at least 2 characters.",
    })
    .max(1250, {
      message: "Description cannot be longer than 1250 characters.",
    }),
});

export default function ServerCustomize({
  server,
  cs,
  setCS,
}: {
  server: string;
  cs: string;
  setCS: Dispatch<SetStateAction<string>>;
}) {
  const [serverOwned, setServerOwned] = useState(false);
  const [userOwned, setUserOwned] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [get, setGet] = useState<any>({});
  const [author, setAuthor] = useState<string | undefined>("");
  const [minehutOwned, setMinehutOwned] = useState(false);
  const { resolvedTheme: mode } = useTheme();
  const { user, isSignedIn } = useUser();
  useEffect(() => {
    sOFunc(server).then((c) => {
      setServerOwned(c);
      getCustomization(server).then((b) => {
        setGet(b);
        setDescription(b != null ? b.description : "");
        form.reset({ description: b != null ? b.description : "" });
        setCS(b != null ? b.colorScheme : "zinc");
        userOwnedServer(server).then((c) => {
          setUserOwned(c);
          fetch("https://api.minehut.com/servers").then((c) => {
            c.json().then((c: { servers: Array<OnlineServer> }) => {
              c.servers.forEach((v) => {
                setAuthor(v.author);
                if (v.name == server && isSignedIn) {
                  if (user?.publicMetadata.player === v.author) {
                    setMinehutOwned(true);
                  }
                }
                setLoading(false);
              });
            });
          });
        });
      });
    });
  }, [isSignedIn, server]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description,
    },
  });
  if (loading) {
    return (
      <>
        <LoadingSpinner className="flex items-center" />
        <br />
      </>
    );
  }

  return (
    <>
      <SignedOut>
        {!serverOwned && (
          <div>
            <div className="font-bold">Do you own this server? </div>
            Create an account and link it to the owner of the server to
            customize it.
          </div>
        )}
      </SignedOut>
      <SignedIn>
        {!serverOwned && user?.publicMetadata.player == null && (
          <div>
            <div className="font-bold">Do you own this server? </div>
            Create an account and link it to the owner of the server to
            customize it.
          </div>
        )}
        {serverOwned && !userOwned && (
          <div>
            <div className="font-bold">
              Is this server in violation of the Rules?
            </div>
            Is this server in violation of the{" "}
            <Link href="/docs/legal/rules">MHSF Rules</Link>? You can report the
            server to remove the customizations from the server.
            <Dialog>
              <DialogTrigger>
                <Button className="h-[30px] ml-2">Report</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Report Server</DialogTitle>
                  <DialogDescription>
                    This will send a notification to MHSF maintainers. This
                    server must be in violation of the{" "}
                    <Link href="/docs/legal/rules">Rules</Link> to be a valid
                    report. Typical response times include 1 hour to 1 day, and
                    you will not be notified if your report is successful or
                    not.{" "}
                    <b>
                      Please do not spam this form with mindless reports. If you
                      do, your account will be banned. We are not Minehut
                      support, we cannot help you with a problem within the
                      Minehut platform or within the server, we can only
                      moderate the customization of the server.
                    </b>{" "}
                    (if the problem is within the server,{" "}
                    <Link href="https://support.minehut.com/hc/en-us/requests/new?tf_subject=Reporting%20Server&tf_27062997154195=reports_appeals&tf_27063229498259=report_server">
                      report it on Minehut
                    </Link>
                    )<br />
                    <br />
                    <b>Reason:</b>
                  </DialogDescription>
                </DialogHeader>
                <Textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
                <div className="grid grid-flow-row gap-2">
                  <Button
                    onClick={async () => {
                      await toast.promise(
                        new Promise(async (g, b) => {
                          (await reportServer(server, reason)) ? g("") : b();
                        }),
                        {
                          success: "Report sent!",
                          loading: "Sending report...",
                          error: "Error while sending report",
                        }
                      );
                    }}
                  >
                    Report Server
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <br />
          </div>
        )}
      </SignedIn>

      {!serverOwned && minehutOwned && (
        <div className="font-bold">
          Do you own this server?{" "}
          <Button
            className="h-[30px] ml-2"
            onClick={async () => {
              await toast.promise(
                new Promise(async (g, b) => {
                  (await ownServer(server)) ? g("") : b();
                }),
                {
                  success: "Owned server!",
                  loading: "Owning server...",
                  error: "Error while owning server",
                }
              );

              setMinehutOwned(true);
              setUserOwned(true);
              setServerOwned(true);
            }}
          >
            Click to own this server
          </Button>
        </div>
      )}
      <br />
      {!userOwned && (
        <>
          <strong>
            {" "}
            <X size={24} />
            Whoops.. something went wrong
          </strong>
          <div> You don't have permission to customize this server. </div>
        </>
      )}

      {serverOwned && userOwned && (
        <div className="max-w-[800px]">
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
              <CardDescription>
                Edit the description of the server.
              </CardDescription>
            </CardHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit((c) => {
                  toast.promise(setCustomization(server, c), {
                    success: "Successfully set description",
                    loading: "Setting description..",
                    error: "Error while setting descript",
                  });
                })}
              >
                <CardContent>
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Editor
                            height="90vh"
                            className="rounded"
                            defaultLanguage="markdown"
                            defaultValue=""
                            theme={mode == "dark" ? "vs-dark" : "light"}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Set the description for your server page. <br />
                          <small>
                            By adding a description, all text is subject to{" "}
                            <Link href="https://minehut.wiki.gg/wiki/Rules">
                              Minehuts Terms of Service
                            </Link>{" "}
                            & the{" "}
                            <Link href="/docs/legal/rules">MHSF Rules</Link>.
                          </small>
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                  <Button type="submit" className="h-[30px]">
                    Edit Description
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
          <br />
          <br />
          <Setting
            name="Color Scheme"
            description={
              <>
                Pick any color scheme for the components on your server page to
                use.
              </>
            }
            button={
              <Popover>
                <PopoverTrigger>
                  <Button type="submit" className="h-[30px]">
                    Edit Color Schemes
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="grid grid-cols-3 gap-1.5 w-[400px]">
                  {themes.map((colorObj) => {
                    const color = colorObj.name;
                    const theme = themes.find((theme) => theme.name === color);
                    const isActive = cs === color;

                    if (!theme) {
                      return null;
                    }

                    return (
                      <Button
                        variant={"outline"}
                        size="sm"
                        key={theme.name}
                        onClick={() => {
                          setCS(theme.name);
                          setCustomization(server, { colorScheme: theme.name });
                        }}
                        className={
                          "justify-start " +
                          (isActive && "border-2 border-primary")
                        }
                        style={
                          {
                            "--theme-primary": `hsl(${
                              theme?.activeColor[
                                mode === "dark" ? "dark" : "light"
                              ]
                            })`,
                          } as React.CSSProperties
                        }
                      >
                        <span
                          className={
                            "mr-1 flex h-5 w-5 shrink-0 -translate-x-1 items-center justify-center rounded-full bg-[--theme-primary]"
                          }
                        >
                          {isActive && (
                            <CheckIcon className="h-4 w-4 text-white" />
                          )}
                        </span>
                        {theme.label}
                      </Button>
                    );
                  })}
                </PopoverContent>
              </Popover>
            }
          />
          <br />
          <br />
          <Setting
            name="Banner"
            description={
              <>
                Banners appear on both the server list, and the server page.{" "}
                <i>
                  You will have to provide your own Imgur image for your image.
                </i>
                <br />
                <small>
                  By adding a banner, all images are subject to{" "}
                  <Link href="https://minehut.wiki.gg/wiki/Rules">
                    Minehuts Terms of Service
                  </Link>
                  ,{" "}
                  <Link href="https://imgur.com/tos">
                    Imgurs Terms of Service
                  </Link>{" "}
                  & the <Link href="/docs/legal/rules">MHSF Rules</Link>.
                </small>
              </>
            }
            button={
              <Popover>
                <PopoverTrigger>
                  <Button className="h-[30px]">Change Banner</Button>
                </PopoverTrigger>
                <PopoverContent>
                  <BannerPopover server={server} get={get} />
                </PopoverContent>
              </Popover>
            }
          />
          <br />
          <br />
          <Setting
            name="Discord Server"
            description={
              <>
                Associate a Discord server embed in your server page.
                <br />
                <small>
                  By adding a Discord Server, all servers are subject to{" "}
                  <Link href="https://discord.com/terms/">
                    Discords Terms of Service
                  </Link>{" "}
                  & the <Link href="/docs/legal/rules">MHSF Rules</Link>.
                </small>
              </>
            }
            button={
              <Popover>
                <PopoverTrigger>
                  <Button className="h-[30px]">Change Discord</Button>
                </PopoverTrigger>
                <PopoverContent>
                  <DiscordPopover server={server} get={get} />
                </PopoverContent>
              </Popover>
            }
          />
          <br />
          <br />
          <Setting
            name="Un-own server"
            description={
              <>
                By unowning the server, you will revert all customizations on
                the server and not be associated with the server.
              </>
            }
            button={
              <Button
                className="h-[30px]"
                variant="destructive"
                onClick={() =>
                  toast.promise(unownServer(server), {
                    success: "Un-owned server!",
                    loading: "Un-owning server...",
                    error: "Error while un-owning server.",
                  })
                }
              >
                Un-own Server
              </Button>
            }
          />
          <br />
          <br />
        </div>
      )}
    </>
  );
}
