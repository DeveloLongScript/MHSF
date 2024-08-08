"use client";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { CheckIcon, CornerDownLeft, X } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  getCustomization,
  ownServer,
  setCustomization,
  serverOwned as sOFunc,
  unownServer,
  userOwnedServer,
} from "@/lib/api";
import toast from "react-hot-toast";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { OnlineServer } from "@/lib/types/server";
import Link from "next/link";
import { useEffectOnce } from "@/lib/useEffectOnce";
import Setting from "./ui/setting";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "./ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";
import "@/themes.css";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { themes } from "@/lib/themes";
import { useTheme } from "next-themes";
import { useColor } from "@/lib/use-color";
import { DiscordPopover } from "./misc/DiscordPopover";
import { Spinner } from "./ui/spinner";
import { BannerPopover } from "./misc/BannerPopover";

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
                  if (user?.publicMetadata.player == v.author) {
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
  }, [isSignedIn]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description,
    },
  });
  if (loading) {
    return (
      <>
        <Spinner className="flex items-center" />
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
                    defaultValue={description}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Markdown is _supported_ in server descriptions"
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
                            <Link href="/legal/external-content-agreement">
                              External Content Agreement
                            </Link>
                            .
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
                  & the{" "}
                  <Link href="/legal/external-content-agreement">
                    External Content Agreement
                  </Link>
                  .
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
                  & the{" "}
                  <Link href="/legal/external-content-agreement">
                    External Content Agreement
                  </Link>
                  .
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