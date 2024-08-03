import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuItem,
  ContextMenuContent,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";
import toast from "react-hot-toast";
import {
  CardHeader,
  CardTitle,
  CardDescription,
  Card,
  CardContent,
} from "./ui/card";
import IconDisplay from "./IconDisplay";
import { TagShower } from "./ServerList";
import { Copy, EllipsisVertical, Layers, MoveRight, Router } from "lucide-react";
import { Button } from "./ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useEffect, useState } from "react";
import { Tooltip } from "@radix-ui/react-tooltip";
import { TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { useRouter } from '@/lib/useRouter'
import Link from "next/link";

export default function ServerCard({ b, motd }: any) {
  const router = useRouter()
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <Card
          key={b.name}
          className="min-h-[450px] max-h-[450px] mb-4 flex items-start"
        >
          <CardHeader>
            <CardTitle className="  m-0">
              <IconDisplay server={b} /> {b.name}{" "}
              <Drawer>
                <DrawerTrigger>
                  <Button
                    size="icon"
                    className="  w-[24px] h-[24px] ml-2 md:hidden"
                    variant="secondary"
                  >
                    <EllipsisVertical size={16} />
                  </Button>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>Actions</DrawerTitle>
                  </DrawerHeader>
                  <DrawerFooter>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          b.name + ".mshf.minehut.gg",
                        );
                        toast.success("Copied IP to clipboard");
                      }}
                    >
                      Copy server IP
                      <Copy size={18} className="  ml-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        router.push("/server/" + b.name);
                      }}
                    >
                      Open server page
                    </Button>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
              {b.author != undefined ? (
                <div className="  text-sm text-muted-foreground">
                  by {b.author}
                </div>
              ) : (
                <br />
              )}
              <TagShower server={b} />
            </CardTitle>
            <CardDescription className="  float-left inline">
              <span className="  flex items-center">
                {b.playerData.playerCount == 0 ? (
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
                  {b.playerData.playerCount}{" "}
                  {b.playerData.playerCount == 1 ? "player" : "players"}{" "}
                  currently online
                </span>
              </span>

              <ContextMenu>
                <ContextMenuTrigger>
                  <>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="  min-w-[128px] max-w-[328px] h-[32px] mt-2 ml-2 max-md:hidden"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          b.name + ".mshf.minehut.gg",
                        );
                        toast.success("Copied IP to clipboard");
                      }}
                    >
                      <Copy size={18} />
                      <code className="ml-2">{b.name}</code>
                    </Button>
                    <Tooltip>
                      <TooltipTrigger>
                        <Link href={"/server/" + b.name}>
                        <Button
                          size="icon"
                          variant="secondary"
                          className="  w-[32px] h-[32px] mt-2 ml-2 max-md:hidden"
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
                  </>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem
                    onClick={() => {
                      navigator.clipboard.writeText(
                        b.name + ".mshf.minehut.gg",
                      );
                      toast.success("Copied IP to clipboard");
                    }}
                  >
                    Copy server IP
                    <div className="  RightSlot">
                      <Copy size={18} />
                    </div>
                  </ContextMenuItem>
                  <ContextMenuSeparator />
                  <Link href={"/server/" + b.name}>
                  <ContextMenuItem
                    
                  >
                    Open server page
                  </ContextMenuItem></Link>
                </ContextMenuContent>
              </ContextMenu>
            </CardDescription>
            <CardContent>
              
                <span dangerouslySetInnerHTML={{ __html: motd }} className="max-w-[12px] text-center"/>
              
            </CardContent>
          </CardHeader>
        </Card>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem
          onClick={() => {
            navigator.clipboard.writeText(b.name + ".mshf.minehut.gg");
            toast.success("Copied IP to clipboard");
          }}
        >
          Copy server IP
          <div className="  RightSlot">
            <Copy size={18} />
          </div>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem
          onClick={() => {
            router.push("/server/" + b.name);
          }}
        >
          Open server page
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
