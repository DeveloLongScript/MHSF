"use client";
import { getCustomization } from "@/lib/api";
import { useEffect, useState } from "react";

export default function Banner({ server }: { server: string }) {
  const [bannerURL, setBannerURL] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCustomization(server).then((c) => {
      if (c != null) {
        setLoading(false);
        setBannerURL(c.banner == undefined ? "" : c.banner);
      } else {
        setLoading(false);
      }
    });
  }, [server]);

  if (loading) {
    return (
      <>
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
