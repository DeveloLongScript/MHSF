"use client";
import { Button } from "@/components/ui/button";
import { useClerk, useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";
import { unlinkMCAccount } from "@/lib/api";
import { useEffect, useState } from "react";
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
    <main className="p-4">
      <strong className="text-3xl">Linking</strong>
      <br />
      <br />
      <strong className="font-bold">Link Account</strong>
      <div className="flex items-center">
        <p>
          Link a Minecraft account to customize a server you own.
          <br />{" "}
          {user?.publicMetadata.player != undefined && linked && (
            <>Currently linked to {user?.publicMetadata.player as string}</>
          )}
        </p>

        <Dialog>
          <DialogTrigger>
            {!linked && <Button className="h-[30px] ml-2">Link Account</Button>}
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
        <p>Unlink your Minecraft acconut if you have already linked one.</p>

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
        All of your customizations stay the same, and can be changed if another
        account links your Minecraft account.
      </small>
    </main>
  );
}
