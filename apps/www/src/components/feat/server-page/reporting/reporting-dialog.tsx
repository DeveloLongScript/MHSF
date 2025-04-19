import { Alert } from "@/components/ui/alert";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { TextArea } from "@/components/ui/text-area";
import { Link } from "@/components/util/link";
import type { useMHSFServer } from "@/lib/hooks/use-mhsf-server";
import { useState } from "react";
import Image from "next/image";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

export function ReportingDialog({
  server,
  open,
  setOpen,
}: {
  server: ReturnType<typeof useMHSFServer>;
  open: boolean;
  setOpen: (newState: boolean) => void;
}) {
  const { user, isSignedIn } = useUser();
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <Drawer direction="left" open={open} onOpenChange={setOpen}>
      <DrawerContent className="p-4 lg:min-w-[600px] max-lg:min-w-[400px] max-lg:max-w-[400px] overflow-x-hidden max-h-screen overflow-y-auto">
        <DrawerTitle className="text-lg mb-3 flex items-center gap-2">
          Report server
        </DrawerTitle>
        <Alert variant="warning" className="text-sm">
          <strong>PLEASE READ BEFORE REPORTING:</strong>
          <ul className="list-disc pl-8">
            <li>This will send a notification to MHSF maintainers.</li>
            <li>
              This server must be in violation of the{" "}
              <Link href="/docs/legal/rules" className="underline">
                Platform Rules
              </Link>{" "}
              to be a valid report.
            </li>
            <li>
              Please do not spam this form with mindless reports. If you do,
              your account will be banned.
            </li>
            <li>
              We are not Minehut support,{" "}
              <b>
                we cannot help you with a problem within the Minehut platform
              </b>{" "}
              or within the server, we can only moderate the customization of
              the server. (if the problem is within the server,{" "}
              <Link href="https://support.minehut.com/hc/en-us/requests/new?tf_subject=Reporting%20Server&tf_27062997154195=reports_appeals&tf_27063229498259=report_server">
                report it on Minehut
              </Link>
              )
            </li>
          </ul>
        </Alert>
        <br />
        <TextArea
          label="Reason for reporting"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <br />
        <SignedIn>
          <span className="flex items-center gap-2 text-sm text-muted-foreground">
            <Image
              alt="Clerk Image"
              src={
                user?.imageUrl === undefined
                  ? "https://img.clerk.com/preview.png?size=144&seed=seed&initials=AD&isSquare=true&bgType=marble&bgColor=6c47ff&fgType=silhouette&fgColor=FFFFFF&type=user&w=48&q=75"
                  : user?.imageUrl
              }
              width={16}
              height={16}
              className="rounded-full"
            />
            Signed in as @{user?.username}
          </span>
        </SignedIn>
        <SignedOut>
          <span className="flex items-center gap-2 text-sm text-muted-foreground">
            You must be signed in to perform this action.
          </span>
        </SignedOut>
        <br />
        <Button
          disabled={!isSignedIn || loading}
          className="flex items-center gap-2"
          onClick={async () => {
            if (reason === "" || reason === " ") {
              toast.error("The reason cannot be empty.");
              return;
            }
            setLoading(true);
            await server.reportServer(reason);
            setLoading(false);
            setOpen(false);
          }}
        >
          Report Server {loading && <Spinner />}
        </Button>
      </DrawerContent>
    </Drawer>
  );
}
