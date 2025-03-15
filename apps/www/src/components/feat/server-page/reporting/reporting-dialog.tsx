import { Alert } from "@/components/ui/alert";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { TextArea } from "@/components/ui/text-area";
import { Link } from "@/components/util/link";
import type { useMHSFServer } from "@/lib/hooks/use-mhsf-server";
import { useState } from "react";

export function ReportingDialog({
  server,
  open,
  setOpen,
}: {
  server: ReturnType<typeof useMHSFServer>;
  open: boolean;
  setOpen: (newState: boolean) => void;
}) {
  const [reason, setReason] = useState("");

  return (
    <Drawer direction="left" open={open} onOpenChange={setOpen}>
      <DrawerContent className="p-4 min-w-[600px] overflow-x-hidden max-h-screen overflow-y-auto">
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
        <TextArea label="Reason for reporting" />
        <br />
        <span></span>
      </DrawerContent>
    </Drawer>
  );
}
