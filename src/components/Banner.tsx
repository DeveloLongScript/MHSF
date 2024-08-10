"use client";

import { getCustomization } from "@/lib/api";
import { useEffect, useState } from "react";
import { Spinner } from "./ui/spinner";

export default function Banner({ server }: { server: string }) {
  const [bannerURL, setBannerURL] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCustomization(server).then((c) => {
      if (c != null) {
        setLoading(false);
        setBannerURL(c.banner == undefined ? "" : c.banner);
      }
    });
  }, [server]);

  if (loading) {
    return (
      <>
        <Spinner className="flex items-center" />
        <br />
      </>
    );
  }

  return (
    <>
      {bannerURL != "" && (
        <img
          src={"https://i.imgur.com/" + bannerURL}
          className="rounded align-middle block ml-auto mr-auto w-[50%] max-h-[150px]"
        />
      )}
      <br />
    </>
  );
}
