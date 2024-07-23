import { OnlineServer } from "@/components/ServerView";
import toast from "react-hot-toast";

var numberOfItemsInView = 20;

export default class ServersList {
  private servers: Array<OnlineServer> = [];
  currentServers: Array<OnlineServer> = [];
  private filters: Array<(server: OnlineServer) => Promise<boolean>> = [];
  extraData: any = { total_players: 0, total_servers: 0 };
  private it = 0;
  hasMore = true;

  constructor(filters: Array<(server: OnlineServer) => Promise<boolean>>) {
    this.filters = filters;
  }
  getRandomServer() {
    return this.servers[Math.floor(Math.random() * this.servers.length)];
  }
  getExtraData() {
    return this.extraData;
  }
  fetchDataAndFilter(): Promise<boolean> {
    return new Promise((g, bc) => {
      fetch("https://api.minehut.com/servers")
        .then((b) => {
          if (!b.ok) {
            console.log(
              "%c[MHSF] STOP! There was an error while requesting Minehut's API! Heres the fetch object for debugging: ",
              "font-weight: bold",
              b,
            );
            toast.error(`
            Error while grabbing servers from API.
            If this is happening alot, make a new issue on GitHub
            `);
            bc();
          }
          if (b.ok)
            b.json().then((serversb) => {
              var serversWithoutFilt: Array<OnlineServer> = serversb.servers;
              var serversWithFilt: Array<OnlineServer> = [];
              this.extraData.total_players = serversb.total_players;
              this.extraData.total_servers = serversb.total_servers;
              serversWithoutFilt.forEach((server: OnlineServer, im) => {
                var good = true;
                const filterEach = () => {
                  return new Promise((g, b) => {
                    if (arrayEmpty(this.filters)) {
                      g(true);
                      serversWithFilt = serversWithoutFilt;
                    }
                    this.filters.forEach((filter, i) => {
                      // Test for if filter is compatiable with server
                      filter(server).then((b) => {
                        if (!b) good = false;
                        if (i == this.filters.length - 1 && good) {
                          serversWithFilt.push(server);
                        }
                        if (i == this.filters.length - 1) {
                          g(true);
                        }
                      });
                    });
                  });
                };

                filterEach().then(() => {
                  if (im == serversWithoutFilt.length - 1) {
                    this.servers = serversWithFilt;
                    g(true);
                  }
                });
              });
            });
        })
        .catch((b) => {
          toast.error(`
          Error while grabbing servers from API.
          If this is happening alot, make a new issue on GitHub
          `);
          console.log(
            "%c[MHSF] STOP! There was an error while requesting Minehut's API! Heres the error for debugging: ",
            "font-weight: bold",
            b,
          );
          bc();
        });
    });
  }

  moveListDown() {
    const slicedArray = this.servers.slice(
      this.it * numberOfItemsInView,
      this.it * numberOfItemsInView + numberOfItemsInView,
    );
    this.currentServers = this.currentServers.concat(slicedArray);
    this.it++;
    console.log(
      "%c[MHSF] Moved list down! Updated entries: ",
      "font-weight: bold",
      slicedArray,
    );
    if (slicedArray.length != numberOfItemsInView) {
      this.hasMore = false;
    }
  }

  editFilters(newFilters: Array<(server: OnlineServer) => Promise<boolean>>) {
    this.filters = newFilters;
    this.servers = [];
    this.it = 0;
    this.currentServers = [];
    this.hasMore = true;
  }

  async getMOTDs(list: Array<{ server: string; motd: string }>) {
    let response = await fetch("/api/getMOTD", {
      body: JSON.stringify({ motd: list }),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    let json = await response.json();
    return json.result;
  }
}

function arrayEmpty(a: Array<any>) {
  return a.length == 0;
}
