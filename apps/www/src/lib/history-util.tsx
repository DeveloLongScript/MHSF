export async function getServerQuery(selector: string) {
  if (selector.length === 24) {
    // Server is id;

    const res = await fetch(`https://api.minehut.com/server/${selector}`);
    const json = await res.json();

    if (json.server === null) return null;

    return { $or: [{ serverId: selector }, { server: json.server.name }] };
  }
  // Legacy behavior
  return { server: selector };
}

export async function getServerName(selector: string) {
  if (selector.length === 24) {
    // Server is id

    const res = await fetch(`https://api.minehut.com/server/${selector}`);
    const json = await res.json();

    if (json.server === null) return null;

    return json.server.name;
  }

  return selector;
}
