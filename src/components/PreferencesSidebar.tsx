import { Cog, ExternalLink, KeyRound, Link, UserPen } from "lucide-react";
import { Button } from "./ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./ui/resizable";
import NextLink from "next/link";
import { useClerk } from "@clerk/nextjs";

export function Sidebar({
  children,
  curPage,
}: {
  children: React.ReactNode;
  curPage: string;
}) {
  const clerk = useClerk();

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="min-h-[calc(100vh-70px)] pt-[70px]"
    >
      <ResizablePanel className="max-md:hidden min-w-[285px] max-w-[285px] w-[285px]">
        <div className="w-[300px] ml-[10px]">
          <NextLink href="/account/settings" className="text-inherit">
            <Button
              className="mb-[2px] w-[250px]"
              variant={curPage !== "/account/settings" ? "ghost" : "default"}
            >
              <Link size={16} className="mr-2" /> Linking
            </Button>
          </NextLink>
          <NextLink href="/account/settings/options" className="text-inherit">
            <Button
              className="mb-[2px] w-[250px] "
              variant={
                curPage !== "/account/settings/options" ? "ghost" : "default"
              }
            >
              <Cog size={16} className="mr-2" /> Options
            </Button>
          </NextLink>
          <Button
            className="mb-[2px] w-[250px]"
            variant="ghost"
            onClick={() => clerk.openUserProfile({})}
          >
            <UserPen size={16} className="mr-2" /> Profile{" "}
            <ExternalLink size={16} className="ml-2" />
          </Button>
          <Button
            className="mb-[2px] w-[250px]"
            variant="ghost"
            onClick={() => clerk.openUserProfile({})}
          >
            <KeyRound size={16} className="mr-2" /> Security{" "}
            <ExternalLink size={16} className="ml-2" />
          </Button>
        </div>
      </ResizablePanel>
      <ResizableHandle className="max-md:hidden" />
      <ResizablePanel>
        <div className="md:hidden ml-2">
          <NextLink href="/account/settings" className="text-inherit">
            <Button
              className="mr-[2px]"
              variant={curPage !== "/account/settings" ? "ghost" : "default"}
            >
              <Link size={16} className="mr-2" /> Linking
            </Button>
          </NextLink>
          <NextLink href="/account/settings/options" className="text-inherit">
            <Button
              className="mr-[2px]"
              variant={
                curPage !== "/account/settings/options" ? "ghost" : "default"
              }
            >
              <Cog size={16} className="mr-2" /> Options
            </Button>
          </NextLink>
          <Button
            className="mr-[2px]"
            variant="ghost"
            onClick={() => clerk.openUserProfile({})}
          >
            <UserPen size={16} className="mr-2" /> Profile{" "}
            <ExternalLink size={16} className="ml-2" />
          </Button>
          <Button
            className="mr-[2px] mb-[30px]"
            variant="ghost"
            onClick={() => clerk.openUserProfile({})}
          >
            <KeyRound size={16} className="mr-2" /> Security{" "}
            <ExternalLink size={16} className="ml-2" />
          </Button>
        </div>
        {children}{" "}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
