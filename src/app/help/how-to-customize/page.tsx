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
        <h1>How to customize your server</h1>
        <p>
          Customizing a part of your server is easy, as long as you have access
          to the account the server is owned under. To own a server, first go to
          the server from the <L H="/">server list</L>. Make sure you own an
          account by linking an account or creating a new one,{" "}
          <L H="/help/how-to-link">
            and make sure you linked your Minecraft account.
          </L>{" "}
        </p>
        <h2>Guide</h2>
        <p>
          After going to the server page, click the Customization tab, and if
          you own the server, click the button "Click to own this server". You
          have successfully owned your Minehut server!
        </p>
      </div>
    </main>
  );
}

function L({ H, children }: { H: string; children: ReactNode }) {
  return <Link href={H}>{children}</Link>;
}
