import Link from "next/link";
import { ReactNode } from "react";

export default function HelpPage() {
  return (
    <main className="sm:grid sm:grid-cols-6  pt-20">
      <div className="pl-3 border rounded ml-4">
        <strong className="pt-2">MHSF Help Guides</strong>
        <br />
        <br />
        <L H="/">Go back to server list</L>
      </div>
      <div className="prose dark:prose-invert p-4 pl-[50px] max-w-[100%] col-span-5">
        <h1>How to link your Minecraft account</h1>
        <p>
          To link your Minecraft account, make sure you have a MHSF account
          created, and go into the settings in the top right, and press
          "Security/Profile settings". Click "Link Account".
        </p>

        <h2>Joining the server</h2>
        <p>
          After launching Minecraft, join the server{" "}
          <code>MHSFPV.minehut.gg</code> and take note of the code being said in
          chat. <i>(You may need to go into the lobby to start up MHSFPV)</i>{" "}
          Put this code the number selector, click "Submit", and you have linked
          your account!
          <br /> Congratulations!
        </p>
        <br />
        <b>Related Articles:</b>
        <p>
          {" "}
          - <L H="/help/how-to-customize">How to customize your server</L>
        </p>
      </div>
    </main>
  );
}

function L({ H, children }: { H: string; children: ReactNode }) {
  return <Link href={H}>{children}</Link>;
}
