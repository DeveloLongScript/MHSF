import { OnlineServer, ServerResponse } from "./types/mh-server";
import toast from "react-hot-toast";

export default class ServerSingle {
  private name = "";
  private onlineObj: OnlineServer | undefined = undefined;
  private offlineObj: ServerResponse | undefined = undefined;
  online = false;

  constructor(name: string) {
    this.name = name;
  }
  init(): Promise<boolean> {
    return new Promise<boolean>((g, bc) => {
      fetch("https://api.minehut.com/server/" + this.name + "?byName=true")
        .then((d) => {
          if (d.ok) {
            d.json().then((m) => {
              this.online = m.server.online;
              this.offlineObj = m.server;
              if (this.online == true) {
                fetch("https://api.minehut.com/servers").then((l) =>
                  l.json().then((o) => {
                    o.servers.forEach((j: OnlineServer) => {
                      if (j.name == this.name) {
                        this.onlineObj = j;
                        g(true);
                      }
                    });
                  })
                );
              } else g(true);
            });
          } else {
            console.log(
              "%c[MHSF] STOP! There was an error while requesting Minehut's API! Heres the fetch object for debugging: ",
              "font-weight: bold",
              d
            );
            toast.error(`
            Error while grabbing servers from API.
            If this is happening alot, make a new issue on GitHub
            `);
            bc();
          }
        })
        .catch((b) => {
          toast.error(`
        Error while grabbing servers from API.
        If this is happening alot, make a new issue on GitHub
        `);
          console.log(
            "%c[MHSF] STOP! There was an error while requesting Minehut's API! Heres the error for debugging: ",
            "font-weight: bold",
            b
          );
          bc();
        });
    });
  }

  getAuthor(): string | undefined {
    if (this.onlineObj == undefined || this.onlineObj.author == undefined) {
      return undefined;
    } else {
      return this.onlineObj.author;
    }
  }

  grabOnline(): OnlineServer | undefined {
    return this.onlineObj;
  }
  grabOffline(): ServerResponse | undefined {
    if (this.offlineObj != undefined) {
      this.offlineObj.__unix =
        "Time in this file is defined in Unix time. Convert it in something like https://www.epochconverter.com/ (in milliseconds)";
    }
    return this.offlineObj;
  }
}
