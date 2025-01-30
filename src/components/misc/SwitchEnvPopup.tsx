"use client";

import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import { OctagonAlert } from "lucide-react";
import A from "./Link";
import { Button } from "../ui/button";
import { useRouter } from "@/lib/useRouter";

export function SwitchEnvPopup() {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (localStorage.getItem("mhsf--switch-env-alert") !== "true") {
            setOpen(true);
        }
    }, [])

    const setDialogTrigger = (v: boolean) => {
        setOpen(v)
        if (!v) {
            localStorage.setItem("mhsf--switch-env-alert", "true")
        }
    }

    return (
        <Dialog open={open} onOpenChange={setDialogTrigger}>
            <DialogContent>
                <OctagonAlert className="text-orange-300" />
                <DialogTitle className="text-3xl">
                    Wait! Did you have an old account?
                </DialogTitle>
                <p className="inline">
                    <strong>If you had an account before Jan. 28th, 2025</strong>, you
                    have a legacy account that <i>needs to be converted.</i>
                </p>
                <p className="inline">
                    Legacy accounts can be converted by going to{" "}
                    <A alt="this page">Special:ClerkConvertionPage</A> and logging in with
                    your old account & creating a new account. Your old account settings &
                    content will automatically be transferred to your new account.{" "}
                </p>
                <div className="flex items-center">
                    <Button onClick={() => { router.push(process.env.NEXT_PUBLIC_CLERK_SWITCH_DOMAIN || "#") }}>Convert account</Button>{" "}
                    <DialogTrigger>
                        <Button className="ml-2" variant="outline">Close</Button>
                    </DialogTrigger>
                </div>
            </DialogContent>
        </Dialog>
    );
}
