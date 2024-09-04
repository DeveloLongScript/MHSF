import { Sidebar } from "@/components/docs/Sidebar";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { version } from "@/config/version";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="border-b pt-[40px]">
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        <aside className="fixed top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
          <ScrollArea className="h-full py-6 pr-6 lg:py-8">
            <div className="bg-muted w-full rounded justify-center p-4 flex items-center">
              MHSF Docs <small className="ml-2">Version {version}</small>
            </div>
            <br />
            <Sidebar />
          </ScrollArea>
        </aside>
        <br className="md:hidden" />

        <div className="bg-muted w-full rounded justify-center p-4 flex items-center md:hidden">
          MHSF Docs <small className="ml-2">Version {version}</small>
          <Drawer>
            <DrawerTrigger>
              <Button className="ml-2">
                <HamburgerMenuIcon />
              </Button>
            </DrawerTrigger>
            <DrawerContent className="p-4">
              <Sidebar />
            </DrawerContent>
          </Drawer>
        </div>
        {children}
      </div>
    </div>
  );
}
