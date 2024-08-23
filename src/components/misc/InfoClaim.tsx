"use client";

import { useState } from "react";
import { TextCopyComp } from "./TextCopyComp";
import { ChevronDown, ChevronUp } from "lucide-react";

export function ShowInfo() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      {open == false && (
        <div
          className="text-blue-500 flex items-center cursor-pointer"
          onClick={() => setOpen(true)}
        >
          More info <ChevronDown size={16} className="ml-2" />
        </div>
      )}
      {open == true && (
        <>
          <p>
            By claiming your account, you can add Markdown descriptions and{" "}
            custom color schemes to your server (and more), making it stand out.
            To get started, join the server below on your Minecraft account.
            Enter the code in chat in the website, and you will link your
            account. You may need to go into the lobby and start the server.
          </p>
          <br />
          <TextCopyComp />
          <br />
          <br />
          <div
            className="text-blue-500 flex items-center cursor-pointer"
            onClick={() => setOpen(false)}
          >
            Less info <ChevronUp size={16} className="ml-2" />
          </div>
        </>
      )}
    </div>
  );
}
