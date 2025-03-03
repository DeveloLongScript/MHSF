import { Button } from "@/components/ui/button";
import { GithubNoTheme } from "@/components/ui/github";
import { Material } from "@/components/ui/material";
import { Link } from "@/components/util/link";
import { Inbox, Sticker } from "lucide-react";
import { StatusButton } from "./status-button";
import { Separator } from "@/components/ui/separator";

export function Support() {
  return (
    <article className="2xl:px-[30rem] xl:px-[15rem] lg:px-[10rem] px-4 border-l border-r">
      <Material className="w-full py-10">
        <h1 className="text-4xl font-bold w-full text-center justify-center flex items-center">
          Contact
          <span className="text-[0.4rem]">🧇</span>
        </h1>
      </Material>
      <br />
      <span className="grid grid-cols-2 gap-4">
        <Material>
          <GithubNoTheme className="w-[32px] h-[32px] dark:fill-white" />
          <h2 className="text-xl font-bold">GitHub Issues</h2>
          <span>
            If you have a bug issue that is reproducible or suggestion please
            make a new issue on{" "}
            <Link href="GitHub:Issues" target="_blank">
              GitHub Issues
            </Link>
          </span>
          <br />
          <Link href="GitHub:Issues">
            <Button className="mt-2">Open an issue</Button>
          </Link>
        </Material>
        <Material>
          <Inbox className="w-[32px] h-[32px]" />
          <h2 className="text-xl font-bold">Contact Support</h2>
          <span>
            If you do not have a GitHub account and/or need help with something
            MHSF-related, feel free to contact{" "}
            <Link href="mailto:support@mhsf.app" className="underline">
              support@mhsf.app
            </Link>
          </span>
          <br />
          <span className="flex items-center mt-2 gap-2">
            <Link href="mailto:support@mhsf.app">
              <Button>Contact</Button>
            </Link>
            <StatusButton />
          </span>
        </Material>
      </span>
      <Material className="mt-4">
        <Sticker className="w-[32px] h-[32px]" />
        <h2 className="text-xl font-bold">Ask</h2>
        <span>
          For anything else where you'll need to contact somebody, contact me @{" "}
          <Link href="mailto:dvelo@mhsf.app" className="underline">
            dvelo@mhsf.app
          </Link>
        </span>
        <Separator className="my-4" />
        <Link href="mailto:dvelo@mhsf.app">
          <Button>Give me an email!</Button>
        </Link>
      </Material>
    </article>
  );
}
