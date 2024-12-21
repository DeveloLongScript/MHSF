/*
 * MHSF, Minehut Server List
 * All external content is rather licensed under the ECA Agreement
 * located here: https://list.mlnehut.com/docs/legal/external-content-agreement
 *
 * All code under MHSF is licensed under the MIT License
 * by open source contributors
 *
 * Copyright (c) 2024 dvelo
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

"use client";
import { getCustomization } from "@/lib/api";
import { useEffect, useState } from "react";
import useTotalBannerSize from "@/lib/hooks/use-total-banner-size";

export default function Banner({ server }: { server: string }) {
  const [bannerURL, setBannerURL] = useState("");
  const [loading, setLoading] = useState(true);
  const { bannerSize } = useTotalBannerSize();

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
          src={
            bannerURL.startsWith("https://i.imgur.com")
              ? bannerURL
              : "wsrv.nl/?url=" + encodeURIComponent(bannerURL) + "?n=-1"
          }
          className="rounded align-middle block ml-auto mr-auto absolute left-0 z-0 max-h-[400px] w-full object-fill"
          alt="User-provided banner for this server."
          style={
            {
              "-webkit-mask-image":
                "linear-gradient(to top, transparent, black)",
              maskImage: "linear-gradient(to top, transparent, black)",
              top: `${bannerSize * 32 + 36}px`,
            } as React.CSSProperties
          }
        />
      )}
      <br />
    </>
  );
}
