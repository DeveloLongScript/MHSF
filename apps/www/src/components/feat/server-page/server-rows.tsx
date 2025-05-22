/*
 * MHSF, Minehut Server List
 * All external content is rather licensed under the ECA Agreement
 * located here: https://mhsf.app/docs/legal/external-content-agreement
 *
 * All code under MHSF is licensed under the MIT License
 * by open source contributors
 *
 * Copyright (c) 2025 dvelo
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

import type { ServerResponse } from "@/lib/types/mh-server";
import useClipboard from "@/lib/useClipboard";
import { MOTDRow } from "./motd/motd-row";
import { StatisticsMainRow } from "./stats/stats-main-row";
import type { useMHSFServer } from "@/lib/hooks/use-mhsf-server";
import { GeneralInfo } from "./general-info/general-info";
import { AchievementsView } from "./achievements/achievements";
import { IconsRow } from "./icons/icons-row";
import { affiliates } from "./util";
import { AffiliateRow } from "./afilliate/affilliate-row";
import { EmbedCreatorRow } from "./embeds/embed-creator";
import { ServerDiscordRow } from "./discord/server-discord-row";

export function ServerRows({ server, mhsfData }: { server: ServerResponse, mhsfData: ReturnType<typeof useMHSFServer> }) {
  const clipboard = useClipboard();

  return (
    <span className="lg:grid lg:grid-cols-2 w-full gap-3">
      {affiliates.includes(server.name) && <AffiliateRow />}
      <MOTDRow server={server} mhsfData={mhsfData} />
      <StatisticsMainRow server={server} mhsfData={mhsfData} />
      {mhsfData.server?.customizationData.discord !== undefined && <ServerDiscordRow server={server} mhsfData={mhsfData} />}
      <GeneralInfo server={server} mhsfData={mhsfData} />
      <AchievementsView server={server} mhsfData={mhsfData} />
      <IconsRow server={server} mhsfData={mhsfData} />
      <EmbedCreatorRow serverName={server.name} />
    </span>
  );
}
