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

/**
 *   New API file for easier API access
 *   Could be used for a JavaScript library :eyes:
 *   @author DeveloLongScript
 */
//

import { Achievement } from "./types/achievement";

const connector = (
  endpoint: string,
  options: { version: number; starting?: string }
) =>
  `${options.starting == undefined ? "/" : `${options.starting}/`}api/v${options.version}${endpoint}`;

async function apiConstructor<K>(
  connector: string,
  requestInit: RequestInit,
  modifier: (data: any) => K
): Promise<K> {
  try {
    const response = await fetch(connector, requestInit);

    if (response.status >= 400) {
      throw Error("Error while running API");
    }
    return modifier(await response.json());
  } catch {
    throw Error("Error while running API");
  }
}
export async function getMOTDFromServer(
  list: Array<{ server: string; motd: string }>
): Promise<Array<{ server: string; motd: string }>> {
  const result = await fetch(
    process.env.NEXT_PUBLIC_ALTERNATE_MOTD_ENDPOINT ??
      connector("/motd", { version: 1 }),
    {
      body: JSON.stringify({ motd: list }),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  let json = await result.json();
  return json.result;
}

export async function getRelativeServerData(
  server: string
): Promise<Array<{ date: string; relativePrecentage: number }>> {
  const result = await fetch(
    connector("/history/" + server + "/get-relative-data", { version: 0 })
  );

  const json = await result.json();
  return json.data;
}

export async function getMonthlyData(
  server: string
): Promise<Array<{ month: string; result: number }>> {
  const result = await fetch(
    connector("/history/" + server + "/get-monthly-data", { version: 0 })
  );

  const json = await result.json();
  return json.result;
}

export async function getDailyData(
  server: string
): Promise<Array<{ day: string; result: number }>> {
  const result = await fetch(
    connector("/history/" + server + "/get-daily-data", { version: 0 })
  );

  const json = await result.json();
  return json.result;
}

export async function getCommunityServerFavorites(
  server: string
): Promise<number> {
  const result = await fetch(
    connector(`/favorites/${server}/community-favorites`, { version: 0 }),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  let json = await result.json();
  return json.result;
}

/** requires authentication */
export async function favoriteServer(server: string) {
  try {
    await fetch(
      connector(`/favorites/${server}/favorite-server`, { version: 0 }),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch {
    throw Error("Not authenticated with a user.");
  }
}

/** requires authentication */
export async function isFavorited(server: string): Promise<boolean> {
  try {
    const response = await fetch(
      connector(`/favorites/${server}/favorited`, { version: 0 }),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return (await response.json()).result;
  } catch {
    throw Error("Not authenticated with a user.");
  }
}

/** requires authentication */
export async function getAccountFavorites(): Promise<Array<string>> {
  try {
    const response = await fetch(
      connector(`/favorites/account-favorites`, { version: 0 }),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return (await response.json()).result;
  } catch {
    throw Error("Not authenticated with a user.");
  }
}

/**
 *  currently not used in frontend yet
 */
export async function getHistoricalData(
  server: string,
  scopes: Array<"player_count" | "favorites" | "server" | "time">
): Promise<
  Array<{
    player_count?: number;
    favorites?: number;
    server?: string;
    time?: number;
  }>
> {
  const response = await fetch(
    connector(`/history/${server}/get-historical-data`, { version: 0 }),
    {
      method: "POST",
      body: JSON.stringify({ scopes }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return (await response.json()).data;
}

export async function getShortTermData(
  server: string,
  scopes: Array<"player_count" | "favorites" | "server" | "date">
): Promise<{
  data: Array<{
    player_count?: number;
    favorites?: number;
    server?: string;
    time?: number;
  }>;
  dataMax: number;
}> {
  const response = await fetch(
    connector(`/history/${server}/get-short-term-data`, { version: 0 }),
    {
      method: "POST",
      body: JSON.stringify({ scopes }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return await response.json();
}

export async function getMetaShortTerm(
  scopes: Array<"total_players" | "total_servers" | "date">
): Promise<
  Array<{
    total_players?: number;
    total_servers?: number;
    unix?: number;
  }>
> {
  const response = await fetch(
    connector(`/history/meta-short-term-data`, { version: 0 }),
    {
      method: "POST",
      body: JSON.stringify({ scopes }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return (await response.json()).data;
}

/** requires authentication */
export async function linkMCAccount(code: string): Promise<string | undefined> {
  try {
    const response = await fetch(
      connector(`/account-linking/claim-account-code`, { version: 0 }),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      }
    );

    if (response.status == 400) {
      return undefined;
    }

    return (await response.json()).player;
  } catch {
    throw Error("Incorrect code");
  }
}

/** requires authentication */
export async function unlinkMCAccount(): Promise<boolean> {
  try {
    const response = await fetch(
      connector(`/account-linking/unlink-account`, { version: 0 }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return true;
  } catch {
    throw Error(
      "Not authenticated with a user or user already linked account."
    );
  }
}

export async function serverOwned(server: string): Promise<boolean> {
  try {
    const response = await fetch(
      connector(`/account-linking/is-owned`, { version: 0 }),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ server }),
      }
    );

    return (await response.json()).owned;
  } catch {
    throw Error("Error while running API");
  }
}

/** requires authentication */
export async function userOwnedServer(server: string): Promise<boolean> {
  try {
    const response = await fetch(
      connector(`/account-linking/owned-user`, { version: 0 }),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ server }),
      }
    );

    return (await response.json()).result;
  } catch {
    throw Error("Error while running API");
  }
}

/** requires authentication */
export async function ownServer(server: string): Promise<boolean> {
  try {
    const response = await fetch(
      connector(`/account-linking/own-server`, { version: 0 }),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ server }),
      }
    );

    if (response.status >= 400) {
      return false;
    }

    return true;
  } catch {
    throw Error("Error while running API");
  }
}

/** requires authentication */
export async function unownServer(server: string): Promise<boolean> {
  try {
    const response = await fetch(
      connector(`/account-linking/unown-server`, { version: 0 }),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ server }),
      }
    );

    if (response.status == 400) {
      return false;
    }

    return true;
  } catch {
    throw Error("Error while running API");
  }
}

/** requires authentication */
export async function setCustomization(
  server: string,
  customization: any
): Promise<boolean | Error> {
  try {
    const response = await fetch(
      connector(`/customization/${server}/set`, { version: 0 }),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ customization }),
      }
    );

    if (response.status == 400) {
      throw Error("Error while running API");
      return false;
    }

    return true;
  } catch {
    throw Error("Error while running API");
  }
}

export async function getCustomization(server: string): Promise<any> {
  try {
    const response = await fetch(
      connector(`/customization/${server}/get`, { version: 0 }),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status == 400) {
      return false;
    }

    return (await response.json()).results;
  } catch {
    throw Error("Error while running API");
  }
}

export async function sortedFavorites(): Promise<
  Array<{ server: string; favorites: number }> | boolean
> {
  try {
    const response = await fetch(
      connector(`/sorting/favorites`, { version: 0 }),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status == 400) {
      return false;
    }

    return (await response.json()).results;
  } catch {
    throw Error("Error while running API");
  }
}

export async function reportServer(
  server: string,
  reason: string
): Promise<boolean> {
  try {
    const response = await fetch(connector(`/report-server`, { version: 1 }), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ server, reason }),
    });

    if (response.status == 400) {
      return false;
    }

    return true;
  } catch {
    throw Error("Error while running API");
  }
}

export async function setAccountSL(
  data: number | boolean | null,
  type: "srv" | "ipr" | "pad"
): Promise<boolean> {
  try {
    const response = await fetch(
      connector(`/account-sl/change`, { version: 0 }),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data, type }),
      }
    );

    if (response.status === 400) {
      return false;
    }

    return true;
  } catch {
    throw Error("Error while running API");
  }
}

export const getAchievements = async (server: string) =>
  apiConstructor<{ _id: string; name: string; achievements: Achievement[] }[]>(
    connector(`/achievements/${server}`, { version: 0 }),
    {},
    (data) => data.result
  );
