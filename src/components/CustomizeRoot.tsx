"use client";
import { useState } from "react";
import TabServer from "./misc/TabServer";
import ServerCustomize from "./ServerCustomize";
import Banner from "./Banner";

export default function CustomizeRoot({
  params,
}: {
  params: { server: string };
}) {
  const [color, setColor] = useState("");
  return (
    <div className={"pt-16 theme-" + color}>
      <Banner server={params.server} />
      <TabServer server={params.server} tabDef="customize" />
      <br />
      <div className="pl-[40px] pr-[40px]">
        <ServerCustomize server={params.server} cs={color} setCS={setColor} />
      </div>
    </div>
  );
}
