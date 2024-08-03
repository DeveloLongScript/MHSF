/**
 *   New API file for easier API access
 *   Could be used for a JavaScript library :eyes:
 *   @author DeveloLongScript
 */
//

const connector = (
  endpoint: string,
  options: { version: number; starting?: string }
) =>
  `${options.starting == undefined ? "/" : `${options.starting}/`}api/v${options.version}${endpoint}`;

export async function getMOTDFromServer(
  list: Array<{ server: string; motd: string }>
): Promise<Array<{ server: string; motd: string }>> {
  const result = await fetch(connector("/motd", { version: 1 }), {
    body: JSON.stringify({ motd: list }),
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  let json = await result.json();
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

    return (await response.json()).data;
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
    connector(`/history/${server}/get-short-term-data`, { version: 0 }),
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

export async function getMetaShortTerm(
  scopes: Array<"total_players" | "total_servers" | "unix">
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
