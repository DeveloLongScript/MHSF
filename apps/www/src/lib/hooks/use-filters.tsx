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

import { useEffect, useState } from "react";
import type { OnlineServer } from "../types/mh-server";
import { useQueryState } from "nuqs";
import { toast } from "sonner";
import { tryCatch } from "../try-catch";
import { transpileTypeScript } from "@/app/(sl-modification-frame)/servers/embedded/sl-modification-frame/file/[filename]/page";

export function useFilters(data: OnlineServer[]) {
	const [filteredData, setFilteredData] = useState<OnlineServer[]>(data);
	const [t] = useQueryState("tm");
	const [testModeEnabled, setTestModeEnabled] = useState(false);
	const [testModeStatus, setTestModeStatus] = useState(
		"Haven't connected thread yet (if stuck, select the other tab, and come back)",
	);
	const [testModeLoading, setTestModeLoading] = useState(true);

	useEffect(() => {
		if (filteredData.length === 0) setFilteredData(data);
	}, [data, filteredData.length]);

	const testModeInit = (type: "filter" | "sort") => {
		window.dispatchEvent(new Event("test-mode.enabled"));
		if (!t) {
			toast.error("Couldn't enable test mode; no query variable.");
		} else {
			setTestModeEnabled(true);
			const code = atob(t);
			(async () => {
				setTestModeStatus("Transpiling TypeScript...");
				const startTime = Date.now();
				const { error, data: transpiledCode } = await tryCatch(
					(async () => transpileTypeScript(code))(),
				);
				if (error) {
					setTestModeStatus(
						"Failed to transpile TypeScript! Error: " + error.message,
					);
					setTestModeLoading(false);
					return;
				}
				if (transpiledCode === null) {
					setTestModeStatus("Cannot continue.");
					setTestModeLoading(false);
					return;
				}
				setTestModeStatus("Generating function...");
				if (
					!transpiledCode.includes("export default") &&
					!transpiledCode.includes("export")
				) {
					setTestModeStatus(
						"Transpiled code does not contain any export statements.",
					);
					setTestModeLoading(false);
					return;
				}
				const functionBody = transpiledCode
					.replace(/export default(?!.*[;])/g, "") // Avoid replacing if followed by a semicolon
					.replace(/export(?!.*[;])/g, ""); // Avoid replacing if followed by a semicolon
				const { error: filterErr, data: filterFunc } = await tryCatch(
					(async () =>
						type === "filter"
							? new Function(
									"server",
									`${functionBody}
            
                  return filter(server)`,
								)
							: new Function(
									"serverA",
									"serverB",
									`${functionBody}
            
                  return sort(serverA, serverB)`,
								))(),
				);
				if (filterErr) {
					setTestModeStatus(
						`Failed to generate function! Error: ${filterErr.message}`,
					);
					setTestModeLoading(false);
					return;
				}
				if (typeof filterFunc === "function") {
					setTestModeStatus("Compiled in " + (Date.now() - startTime) + "ms");
					toast.promise(
						async () => {
							let newServers = [];
							if (type === "filter") {
								newServers = data.filter((c) => filterFunc(c));
								setTestModeStatus(
									"Server count " + data.length + " -> " + newServers.length,
								);
								if (newServers.length === 0)
									setTestModeStatus(
										"No servers were specified in the criteria; showing all servers instead",
									);
								setFilteredData(() => [...newServers]);
							}
							if (type === "sort") {
								newServers = data.sort((a, b) => filterFunc(a, b));
								setTestModeStatus("Sorted " + newServers.length + " servers.");
								console.log(newServers, data.sort((a, b) => filterFunc(a, b)))
								console.log(filterFunc)
								setFilteredData(() => [...newServers]);
							}

							setTestModeLoading(false);
							window.dispatchEvent(new Event("test-mode.success"));
						},
						{
							loading: "Manipulating data...",
							success: "Manipulated data; test mode finished!",
							error: (e) =>
								`Error while manipulating data; go back to your editor and run again. ${e}`,
						},
					);
				} else {
					setTestModeStatus(
						"Code doesn't have a 'filter' function. Cannot be tested.",
					);
					setTestModeLoading(false);
				}
			})();
		}
	};

	useEffect(() => {
		if (data.length !== 0) {
			window.addEventListener("test-mode.enable.filter", () =>
				testModeInit("filter"),
			);
			window.addEventListener("test-mode.enable.sort", () =>
				testModeInit("sort"),
			);
		}
	}, [t, data]);

	return { filteredData, testModeEnabled, testModeLoading, testModeStatus };
}
