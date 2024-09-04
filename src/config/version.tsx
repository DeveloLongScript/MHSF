import Image from "next/image";
import Link from "next/link";
import { Separator } from "../components/ui/separator";
import { Button } from "../components/ui/button";
import confetti from "canvas-confetti";

export const version = "1.2.0";

const User = ({ user }: { user: string }) => (
  <span className="cursor-pointer bg-[rgba(255,165,0,0.25);] rounded p-[2.5px]">
    {user}
  </span>
);
const handleClick = () => {
  const duration = 5 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  const randomInRange = (min: number, max: number) =>
    Math.random() * (max - min) + min;

  const interval = window.setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    confetti({
      ...defaults,
      particleCount,
      zIndex: 60,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
    });
    confetti({
      ...defaults,
      particleCount,
      zIndex: 60,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
    });
  }, 250);
};

export const Changelog = () => (
  <>
    <div>
      Running on commit{" "}
      <code>
        <a
          href={`https://github.com/DeveloLongScript/mhsf/commit/${process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA}`}
        >
          {(
            process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || "unknown"
          ).substring(0, 7)}
        </a>{" "}
        {process.env.NEXT_PUBLIC_VERCEL_GIT_PULL_REQUEST_ID != undefined &&
          process.env.NEXT_PUBLIC_VERCEL_GIT_PULL_REQUEST_ID != "" && (
            <>
              {" "}
              | on PR{" "}
              <a
                href={`https://github.com/DeveloLongScript/MHSF/pull/${process.env.NEXT_PUBLIC_VERCEL_GIT_PULL_REQUEST_ID}`}
              >
                {process.env.NEXT_PUBLIC_VERCEL_GIT_PULL_REQUEST_ID}
              </a>{" "}
              by{" "}
              <a
                href={`https://github.com/${process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_AUTHOR_NAME}`}
              >
                {process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_AUTHOR_NAME}
              </a>
            </>
          )}{" "}
        {process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_MESSAGE != undefined &&
          `| ${process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_MESSAGE.substring(0, 24)}`}
      </code>
    </div>
    <br />
    <div>
      <strong className="flex items-center">
        Version 1.2.0 (September 3rd 2024)
      </strong>
      <ul>
        <li>• Added documentation</li>
        <li>• Brand new linking of padding and server options</li>
        <li>• New system to ensure automatic Cron actions!</li>
        <li>• and alot more!</li>
      </ul>
    </div>
    <br />
    <div>
      <strong className="flex items-center">
        Version 1.1.0 (August 24rd 2024)
      </strong>
      <ul>
        <li>• Brand new hero page</li>
        <li>• New padding option on server list</li>
        <li>• New help guide</li>
      </ul>
    </div>
    <br />
    <div>
      <strong className="flex items-center">
        Version 1.0.0 (August 22nd 2024)
      </strong>
      <ul>
        <li>
          • 1.0!{" "}
          <Button className="h-[25px] w-[50px] ml-2" onClick={handleClick}>
            woah!
          </Button>
        </li>
        <li>• New hover card on server title hover</li>
        <li>• Moving to self-hosted cron jobs</li>
        <li>• Fixing some mobile issues</li>
      </ul>
    </div>
    <br />
    <Separator />

    <br />
    <div>
      <strong className="flex items-center">
        Version b-0.10.7 (August 18th 2024)
      </strong>
      <ul>
        <li>• New server information tab on server pages</li>
      </ul>
    </div>
    <br />
    <div>
      <strong className="flex items-center">
        Version b-0.10.2 (August 18th 2024)
      </strong>
      <ul>
        <li>• Content fades-in on load</li>
        <li>• Instead of using spinners, now we are using Skeletons</li>
      </ul>
    </div>
    <br />
    <div>
      <strong className="flex items-center">
        Version b-0.10.0 (August 17th 2024)
      </strong>
      <ul>
        <li>• Revamped server list button list</li>
        <li>• Added welcome dialog when first launching</li>
        <li>
          • Fixed an issue where servers were still able to be favorited
          client-side when logged out
        </li>
        <li>• Improved MOTD engine</li>
      </ul>
      <br />
      <i>👀</i>
      {/** Ensure Tailwind pre-renders all grid column types */}
      <span className="grid-cols-6" />
      <span className="grid-cols-5" />
      <span className="grid-cols-4" />
    </div>
    <br />
    <br />
    <div>
      <strong className="flex items-center">
        Version b-0.9.0 (August 15th 2024)
      </strong>
      <ul>
        <li>• Adding favorites sorting option</li>
        <li>• Fixed right-click context menu on the server list</li>
        <li>• Fixed metadata bugs</li>
      </ul>
      <br />
      <i>
        Hey! Update on statistics. Recently, we have figured out the Minehut API
        is blocked to Vercel servers (atleast the <code>/servers</code>{" "}
        endpoint). I'm actively trying to find a loop-hole so that statistics
        works correctly. Thank you {":)"}
      </i>
      <br />
    </div>
    <br />
    <div>
      <strong className="flex items-center">
        Version b-0.8.0 (August 11th 2024)
      </strong>
      <ul>
        <li>• Fixing up command bar</li>
        <li>• Renaming "Short Term" to "Statistics"</li>
      </ul>
    </div>
    <br />
    <div>
      <strong className="flex items-center">
        Version b-0.7.2 (August 7th 2024)
      </strong>
      <ul>
        <li>• Adding new spinners to pages that needed it</li>
        <li>• Fixed lots of bugs</li>
        <li>• Moved from Inngest to Vercel Cron</li>
      </ul>
    </div>
    <br />
    <div>
      <strong className="flex items-center">
        Version b-0.7.0 (August 7th 2024)
      </strong>
      <ul>
        <li>• Added customization to servers</li>
        <li>• New button focus effect</li>
        <li>• Lots of bugfixes</li>
      </ul>
    </div>
    <br />
    <div>
      <strong className="flex items-center">
        Version b-0.6.0 (August 3rd 2024)
      </strong>
      <ul>
        <li>• Enhanced shortcuts</li>
        <li>• Added gradient beam to player count</li>
        <li>• Updated loading animations</li>
        <li>• Lots of bugfixes</li>
      </ul>
    </div>
    <br />
    <div>
      <strong className="flex items-center">
        Version b-0.4.5 (July 26th 2024):
      </strong>
      <ul>
        <li>• Made charts better</li>
        <li>• Sorted API endpoints</li>
      </ul>
    </div>
    <br />
    <div>
      <strong className="flex items-center">
        Version b-0.4 (July 25th 2024):
      </strong>
      <ul>
        <li>• Added Info button</li>
        <li>• Fixed Clerk in production</li>
        <li>• Added Turbo for faster builds</li>
        <li>
          • <strong>Added historical data</strong>
        </li>
      </ul>
    </div>
    <br />
    <div>
      <strong className="flex items-center">
        Version b-0.3 (July 23th 2024):
      </strong>
      <ul>
        <li>
          • Fixed minor bugs described by <User user="@Tarna" />
        </li>
      </ul>
    </div>
    <br />
    <div>
      <strong className="flex items-center">
        Version b-0.2 (July 23th 2024):
      </strong>
      <ul>
        <li>• Inital release!</li>
      </ul>
    </div>
    <br />
    <div>
      <strong>All developers that helped out:</strong>
      <Link href="https://dvelo.vercel.app">
        <Image
          src="/imgs/badge1.png"
          alt="cool badge"
          width={88}
          height={31}
          className="w-[88px] h-[31px]"
        />
      </Link>
    </div>
  </>
);
