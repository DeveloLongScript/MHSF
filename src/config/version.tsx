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
import A from "@/components/misc/Link";
import type { ReactNode } from "react";

const User = ({ user }: { user: string }) => (
  <span className="cursor-pointer bg-[rgba(255,165,0,0.25);] rounded p-[2.5px]">
    {user}
  </span>
);

const FeatureList = ({
  features,
  title,
}: {
  features: (string | ReactNode)[];
  title: ReactNode;
}) => {
  return (
    <ul>
      {title}
      {features.map((feature, i) => (
        <li key={i}>• {feature}</li>
      ))}
    </ul>
  );
};

export const version = "1.6.50";
export const changelog: { name: string; id: string; changelog: ReactNode }[] = [
  {
    id: "dut6hx3f2paswzjve4yg9r",
    name: "v1.6.5",
    changelog: (
      <FeatureList
        features={[
          "New MOTD engine that is over 3,000% faster, runs client-side, and doesn't need any requests to run.",
          "Fixed issue where GitHub link was broken if you were signed-out",
          "Adding snowfall finally (better late then ever)",
        ]}
        title={
          <strong className="flex items-center">
            Version 1.6.5 (December 20th 2024)
          </strong>
        }
      />
    ),
  },
  {
    id: "h9jr2cbxn7qwfvt5uypsdg",
    name: "v1.6.0",
    changelog: (
      <FeatureList
        features={[
          "Completely redid top of server view",
          "Favorite counts are now prominent on the server view",
          "New theme transition (smooth)",
          "New favorite button",
          "Added more padding in the server view",
          "Separated the tabs on the side for sharing actions",
          "Added new QR code generator",
        ]}
        title={
          <strong className="flex items-center">
            Version 1.6.0 (November 17th 2024)
          </strong>
        }
      />
    ),
  },
  {
    id: "r9swempc7kaqd2j84nutv5",
    name: "v1.5.0",
    changelog: (
      <FeatureList
        features={[
          "New embeds",
          "More mobile friendly elements",
          "Better tabs in the server",
          "Fixed issue where some servers due to their age were not loading",
        ]}
        title={
          <strong className="flex items-center">
            Version 1.5.0 (November 16th 2024)
          </strong>
        }
      />
    ),
  },
  {
    id: "ywvhtcs4k9rqjfp57x",
    name: "v1.4.5",
    changelog: (
      <FeatureList
        features={["Add server icons"]}
        title={
          <strong className="flex items-center">
            Version 1.4.5 (November 6th 2024)
          </strong>
        }
      />
    ),
  },
  {
    id: "amq4suhgcfwrb7y5j6",
    name: "v1.4.0",
    changelog: (
      <FeatureList
        features={[
          "Revamped documentation",
          "Revamped changelog UI",
          "New hover joins chart",
        ]}
        title={
          <strong className="flex items-center">
            Version 1.4.0 (November 3rd 2024)
          </strong>
        }
      />
    ),
  },
  {
    id: "jeh48p7w9bx2k3ad6f",
    name: "v1.3.2",
    changelog: (
      <div>
        <strong className="flex items-center">
          Version 1.3.2 (October 4th 2024)
        </strong>
        <ul>
          <li>• Minor backend changes</li>
          <li>
            •{" "}
            <A alt="Please check on GitHub for statuses about this project.">
              Special:GitHub/releases/tag/1.3.2
            </A>
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: "wvg9x5dbpj76sn4yrz",
    name: "v1.3.0",
    changelog: (
      <div>
        <strong className="flex items-center">
          Version 1.3.0 (September 9th 2024)
        </strong>
        <ul>
          <li>
            • <A alt="New documentation linking">Docs:Reading</A>
          </li>
          <li>
            • Achievements are here! See more at{" "}
            <A alt="here">Docs:Advanced/Achievements</A>
          </li>
          <li>• Finally fixed Cron actions for the final time™</li>
          <li>• Overhauled account preferences</li>
        </ul>
      </div>
    ),
  },
  {
    name: "v1.2.0",
    changelog: (
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
    ),
    id: "e482y9k5hvjt73urfx",
  },
  {
    name: "v1.1.0",
    changelog: (
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
    ),
    id: "hfn9p243765x8bwurj",
  },
  {
    name: "v1.0.0",
    changelog: (
      <div>
        <strong className="flex items-center">
          Version 1.0.0 (August 22nd 2024)
        </strong>
        <ul>
          <li>• 1.0!</li>
          <li>• New hover card on server title hover</li>
          <li>• Moving to self-hosted cron jobs</li>
          <li>• Fixing some mobile issues</li>
        </ul>
      </div>
    ),
    id: "a8w4xvjbg3s7ynehu6",
  },
  {
    name: "v0.10.7",
    changelog: (
      <div>
        <strong className="flex items-center">
          Version b-0.10.7 (August 18th 2024)
        </strong>
        <ul>
          <li>• New server information tab on server pages</li>
        </ul>
      </div>
    ),
    id: "asbt64h9fdyu8neqmp",
  },
  {
    name: "v0.10.2",
    changelog: (
      <div>
        <strong className="flex items-center">
          Version b-0.10.2 (August 18th 2024)
        </strong>
        <ul>
          <li>• Content fades-in on load</li>
          <li>• Instead of using spinners, now we are using Skeletons</li>
        </ul>
      </div>
    ),
    id: "kct29adbp6zug5r3q8",
  },
  {
    name: "v0.10.0",
    changelog: (
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
    ),
    id: "ah6t7c8sfzyrkp3u52",
  },
  {
    name: "v0.9.0",
    changelog: (
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
          Hey! Update on statistics. Recently, we have figured out the Minehut
          API is blocked to Vercel servers (atleast the <code>/servers</code>{" "}
          endpoint). I'm actively trying to find a loop-hole so that statistics
          works correctly. Thank you {":)"}
        </i>
        <br />
      </div>
    ),
    id: "kjxnrfazc7hp9q4e82",
  },
  {
    name: "v0.8.0",
    changelog: (
      <div>
        <strong className="flex items-center">
          Version b-0.8.0 (August 11th 2024)
        </strong>
        <ul>
          <li>• Fixing up command bar</li>
          <li>• Renaming "Short Term" to "Statistics"</li>
        </ul>
      </div>
    ),
    id: "f8rmhwzuxk3qyds542",
  },
  {
    name: "v0.7.2",
    changelog: (
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
    ),
    id: "g2rhxfj6bu8wqk43n7",
  },
  {
    name: "v0.7.0",
    changelog: (
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
    ),
    id: "a5xb97jv3surwmqn62",
  },
  {
    name: "v0.6.0",
    changelog: (
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
    ),
    id: "u83r5mkea9x4p2fjnb",
  },
  {
    name: "v0.4.5",
    changelog: (
      <div>
        <strong className="flex items-center">
          Version b-0.4.5 (July 26th 2024):
        </strong>
        <ul>
          <li>• Made charts better</li>
          <li>• Sorted API endpoints</li>
        </ul>
      </div>
    ),
    id: "vu3k2daqj4y68bnwsp",
  },
  {
    name: "v0.4.0",
    changelog: (
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
    ),
    id: "psr9tx5jah74d32vq6",
  },
  {
    name: "v0.3.0",
    changelog: (
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
    ),
    id: "m2ngpd6fwtv7xh5zrk",
  },
  {
    name: "v0.2.0",
    changelog: (
      <div>
        <strong className="flex items-center">
          Version b-0.2 (July 23th 2024):
        </strong>
        <ul>
          <li>• Inital release!</li>
        </ul>
      </div>
    ),
    id: "xsfw2rcnv7m3kuhpbq",
  },
];
