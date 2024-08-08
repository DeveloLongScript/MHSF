"use client";
import { useState } from "react";
import { Button } from "../ui/button";
import toast from "react-hot-toast";
import { Check } from "lucide-react";

export function TextCopyComp() {
  "use client";
  const [textCopied, setTextCopied] = useState(false);

  return (
    <code className="border p-3 rounded">
      MHSFPV.minehut.gg{" "}
      <Button
        size="icon"
        className="ml-1 h-[20px]"
        onClick={() => {
          setTextCopied(true);
          navigator.clipboard.writeText("MHSFPV.minehut.gg");
          toast.success("Copied!");
          setTimeout(() => setTextCopied(false), 1000);
        }}
      >
        {textCopied ? (
          <Check size={16} className="flex items-center" />
        ) : (
          <p>Copy</p>
        )}
      </Button>
    </code>
  );
}
