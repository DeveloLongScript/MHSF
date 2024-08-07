"use client";
import { ShowInfo } from "@/components/misc/InfoClaim";
import { TextCopyComp } from "@/components/misc/TextCopyComp";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useClerk, useUser } from "@clerk/nextjs";
import { default as NextLink } from "next/link";
import { ExternalLink, KeyRound, Link, UserPen } from "lucide-react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import toast from "react-hot-toast";
import { unlinkMCAccount } from "@/lib/api";
import { useEffect, useState } from "react";
import { link } from "fs";
import { Dialog } from "@/components/ui/dialog";
import { DialogContent, DialogTrigger } from "@/components/ui/dialog";
import CodeDialog from "@/components/misc/LinkDialog";

export default function Settings() {
  const clerk = useClerk();

  const { user, isSignedIn } = useUser();
  const [linked, setLinked] = useState(false);
  useEffect(() => {
    setLinked(user?.publicMetadata.player != undefined);
  }, [user, isSignedIn]);

  return (
    <main className="pt-[48px] p-4">
      <ResizablePanelGroup
        direction="horizontal"
        className="min-h-[calc(100vh-70px)] "
      >
        <ResizablePanel className="min-w-[285px] max-w-[285px] w-[285px]">
          <div className="w-[300px] mt-[20px] ml-[10px]">
            <Button className="mb-[2px] w-[250px]">
              <Link size={16} className="mr-2" /> Linking
            </Button>
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
        <ResizableHandle />
        <ResizablePanel>
          <div className="p-4">
            <strong className="text-3xl">Linking</strong>
            <br />
            <br />
            <strong className="font-bold">Link Account</strong>
            <div className="flex items-center">
              <p>Link a Minecraft account to customize a server you own.</p>

              <Dialog>
                <DialogTrigger>
                  {!linked && (
                    <Button className="h-[30px] ml-2">Link Account</Button>
                  )}
                </DialogTrigger>
                <DialogContent>
                  <CodeDialog
                    linked={linked}
                    setLinked={(c) => {
                      setLinked(c);
                    }}
                  />
                </DialogContent>
              </Dialog>

              {linked && (
                <Button className="h-[30px] ml-2" disabled>
                  Already linked
                </Button>
              )}
            </div>
            <br />
            <strong className="font-bold">Unlink Account</strong>
            <div className="flex items-center">
              <p>
                Unlink your Minecraft acconut if you have already linked one.
              </p>

              {!linked && (
                <Button className="h-[30px] ml-2" disabled>
                  No linked account
                </Button>
              )}

              {linked && (
                <Button
                  className="h-[30px] ml-2"
                  variant="destructive"
                  onClick={async () => {
                    await toast.promise(unlinkMCAccount(), {
                      success: "Unlinked account!",
                      loading: "Unlinking...",
                      error: "Error while unlinking account.",
                    });
                    setLinked(false);
                  }}
                >
                  Unlink account
                </Button>
              )}
            </div>
            <small className="mt-0">
              All of your customizations stay the same, and can be changed if{" "}
              another account links your Minecraft account.
            </small>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
}
