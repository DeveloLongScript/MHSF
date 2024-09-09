"use client";
import { useClerk, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { SLCustomize } from "@/components/SLCustomizePage";

export default function Settings() {
  const clerk = useClerk();

  const { user, isSignedIn } = useUser();
  const [linked, setLinked] = useState(false);
  useEffect(() => {
    setLinked(user?.publicMetadata.player != undefined);
  }, [user, isSignedIn]);

  return (
    <main className="p-4">
      <strong className="text-3xl">Profile Preferences</strong>
      <br />
      <br />
      <SLCustomize />
    </main>
  );
}
