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

import { serverOwned } from "./api";
import { OnlineServer, ServerResponse } from "./types/mh-server";
import { toast } from "sonner";

export default class ServerSingle {
	private name = "";
	private onlineObj: OnlineServer | undefined = undefined;
	private offlineObj: ServerResponse | undefined = undefined;
	online = false;

	constructor(name: string) {
		this.name = name;
	}
	setName(newName: string) {
		this.name = newName;
	}

	isCustomized(): Promise<boolean> {
		return serverOwned(this.name);
	}

	init(skipOnline?: boolean): Promise<boolean> {
		return new Promise<boolean>((g, bc) => {
			fetch("https://api.minehut.com/server/" + this.name + "?byName=true")
				.then((d) => {
					if (d.ok) {
						d.json().then((m) => {
							this.online = m.server.online;
							this.offlineObj = m.server;
							if (this.online == true && skipOnline != true) {
								fetch("https://api.minehut.com/servers").then((l) =>
									l.json().then((o) => {
										if (
											o.servers.find(
												(j: OnlineServer) => j.name == this.name,
											) == undefined
										) {
											g(true);
										}
										o.servers.forEach((j: OnlineServer) => {
											if (j.name == this.name) {
												this.onlineObj = j;
												g(true);
											}
										});
									}),
								);
							} else g(true);
						});
					} else {
						console.log(
							"%c[MHSF] STOP! There was an error while requesting Minehut's API! Heres the fetch object for debugging: ",
							"font-weight: bold",
							d,
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
						b,
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
