import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { ReactNode, useEffect, useState } from "react";

export function ServerEditorProvider({children}: {children: ReactNode | ReactNode[]}) {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        window.addEventListener("open-server-editor", () => setOpen(true));
    }, [])

    return <>
        {children}
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerContent>
                <DrawerTitle>Server Settings</DrawerTitle>

            </DrawerContent>
        </Drawer>
    </>
}