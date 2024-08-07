"use client";

import { getCustomization } from "@/lib/api";
import { useEffect, useState } from "react";

export default function Banner({ server }: { server: string }) {
  const [bannerURL, setBannerURL] = useState("");

  useEffect(() => {
    getCustomization(server).then((c) => {
      setBannerURL(c.banner == null ? "" : c.banner);
    });
  }, [server]);

  return (
    <>
      <img
        src={"https://i.imgur.com/" + bannerURL}
        className="rounded align-middle block ml-auto mr-auto w-[50%] max-h-[150px]"
      />
      <br />
    </>
  );
}
