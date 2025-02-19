"use client";

import { Button } from "@/components/ui/button";
import { Material } from "@/components/ui/material";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { SignedIn, SignedOut, useClerk } from "@clerk/nextjs";
import { ExternalLink, Globe, TabletSmartphone } from "lucide-react";
import { BrowserSettings } from "./browser-settings";

export function Settings() {
  const clerk = useClerk();

  return (
    <main className="lg:px-[10rem] px-4">
      <h1 className="scroll-m-20 text-2xl font-extrabold tracking-tight lg:text-4xl mb-3">
        Settings
      </h1>
      <Tabs defaultValue="browser-settings" className="mt-3">
        <TabsList>
          <TabsTrigger
            value="browser-settings"
            className="flex items-center gap-2"
          >
            <Globe size={16} />
            Browser stored settings
          </TabsTrigger>
          <TabsTrigger
            value="user-settings"
            className="flex items-center gap-2"
          >
            <TabletSmartphone size={16} />
            User stored settings
          </TabsTrigger>
          <SignedIn>
            <TabsTrigger
              value="account-settings"
              className="flex items-center gap-2"
              onClick={() => clerk.openUserProfile()}
            >
              Account Settings <ExternalLink size={16} />
            </TabsTrigger>
          </SignedIn>
        </TabsList>
        <TabsContent value="browser-settings">
          <BrowserSettings />
        </TabsContent>
        <TabsContent value="user-settings">
          <SignedOut>
            <Material className="mt-6 grid gap-4 py-6">
              <h3
                className={cn(
                  "scroll-m-20 text-2xl font-semibold tracking-tight bg-linear-to-r from-[#3b82f6] to-[#ef4444] bg-clip-text text-transparent",
                  "w-full flex items-center text-center justify-center"
                )}
              >
                Create an account.
              </h3>
              <span className="w-full flex items-center text-center justify-center">
                <p className="max-w-[600px] break-words">
                  Creating an account allows you to mark your favorite servers,
                  link your own servers with your own, link your Minecraft
                  account to your MHSF one, and store various different settings
                  to sync across all of the devices linked with your account.
                </p>
              </span>
              <span className="flex items-center w-full justify-center gap-2">
                <Button
                  className="max-w-[400px]"
                  onClick={() => clerk.openSignUp()}
                >
                  Sign-up
                </Button>
                <Button
                  className="max-w-[400px]"
                  variant="secondary"
                  onClick={() => clerk.openSignIn()}
                >
                  Sign-in
                </Button>
              </span>
            </Material>
          </SignedOut>
        </TabsContent>
      </Tabs>
    </main>
  );
}
