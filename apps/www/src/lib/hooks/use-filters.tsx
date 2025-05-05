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

import { useEffect, useMemo, useState } from "react";
import type { OnlineServer } from "../types/mh-server";
import { useQueryState } from "nuqs";
import { toast } from "sonner";
import { tryCatch } from "../try-catch";
import { transpileTypeScript } from "@/app/(sl-modification-frame)/servers/embedded/sl-modification-frame/file/[filename]/page";
import { useUser } from "@clerk/nextjs";
import type { ClerkCustomActivatedModification } from "@/components/feat/server-list/modification/modification-file-creation-dialog";
import { ClerkEmbeddedFilter } from "@/components/feat/server-list/modification/modification-action";
import { supportedFilters } from "../types/supportedFilters";

type EmbeddedFilter = {
	identifier: string;
	functionFilter: (server: OnlineServer) => (boolean | Promise<boolean>);
};

type SortFunction<K> = (object1: K, object2: K) => number;

export function useFilters(data: OnlineServer[]) {
	const [filteredData, setFilteredData] = useState<OnlineServer[]>(data);
	const [t] = useQueryState("tm");
	const [testModeEnabled, setTestModeEnabled] = useState(false);
	const [testModeStatus, setTestModeStatus] = useState(
		"Haven't connected thread yet (if stuck, select the other tab, and come back)",
	);
	const [testModeLoading, setTestModeLoading] = useState(true);
	const [loading, setLoading] = useState(true);
	const [filters, setFilters] = useState<EmbeddedFilter[]>([]);
	const [tagStrings, setTagStrings] = useState<string[]>([]);
	const [sort, setSort] = useState<SortFunction<OnlineServer> | null>(null);
	const { user, isSignedIn } = useUser();

	const updateServers = async (newFilters: EmbeddedFilter[]) => {
		const modificationMap = await Promise.all(data.map((v) =>
			Promise.all(newFilters.map(async (c) => c.functionFilter(v))),
		));
		const resultData = data.filter(
			(_, i) => !modificationMap[i].includes(false),
		);
		const sortedData = sort === null ? resultData : resultData.sort(sort);

		if (sortedData.length !== 0) setFilteredData(sortedData);
	};

	useEffect(() => {
		if (filteredData.length === 0 || data.length === 0) {
			window.dispatchEvent(new Event("update-modification-stack"));
		} else setLoading(false);
	}, [data, filteredData.length]);

	useEffect(() => {
		if (data.length === 0) {
			window.dispatchEvent(new Event("update-modification-stack"));
		} else setLoading(false);
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
						`Failed to transpile TypeScript! Error: ${error.message},`,
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
					setTestModeStatus(`Compiled in ${Date.now() - startTime} ms`);
					toast.promise(
						async () => {
							let newServers: OnlineServer[] = [];
							if (type === "filter") {
								newServers = data.filter((c) => filterFunc(c));
								setTestModeStatus(
									`Server count ${data.length} -> ${newServers.length}`,
								);
								if (newServers.length === 0)
									setTestModeStatus(
										"No servers were specified in the criteria; showing all servers instead",
									);
								setFilteredData(() => [...newServers]);
							}
							if (type === "sort") {
								newServers = data.sort((a, b) => filterFunc(a, b));
								setTestModeStatus(`Sorted ${newServers.length} servers.`);
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

	// biome-ignore lint: I'm gonna turn this off :sob:
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

	// biome-ignore lint: I'm gonna turn this off :sob:
	useEffect(() => {
		window.addEventListener("start-loading-server-view", () => setLoading(true))
		if (!t)
			window.addEventListener("update-modification-stack", async () => {
				await user?.reload();
				let newFilters: EmbeddedFilter[] = [];
				const filters =
					((isSignedIn ? user.unsafeMetadata.filters : JSON.parse(localStorage.getItem("mhsf__filters") ?? "[]")) as Array<
						ClerkEmbeddedFilter<unknown>
					>) ?? [];
				setTagStrings([]);
					
				if (isSignedIn) {
					const activatedModifications =
						(user.unsafeMetadata
							.activatedModifications as ClerkCustomActivatedModification[]) ??
						[];
					const activeModifications = activatedModifications.filter(
						(c) => c.active && c.testMode === "filter",
					);

					const resolvedModifications = (await Promise.all(
						activeModifications.map(async (c) => {
							const functionBody = c.transpiledContents
								.replace(/export default(?!.*[;])/g, "") // Avoid replacing if followed by a semicolon
								.replace(/export(?!.*[;])/g, ""); // Avoid replacing if followed by a semicolon
							const { error: filterErr, data: filterFunc } = await tryCatch(
								(async () =>
									c.testMode === "filter"
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
								toast.error(
									`Couldn't enable modification '${c.friendlyName}'. Please lint and test again.`,
								);
								return {
									identifier: `file-${c.originalFileName}.ts`,
									functionFilter: () => true,
								};
							}

							if (typeof filterFunc === "function") {
								return {
									identifier: `file-${c.originalFileName}.ts`,
									functionFilter: filterFunc,
								};
							}

							toast.error(
								`Couldn't enable modification '${c.friendlyName}'. Please lint and test again.`,
							);
							return {
								identifier: `file-${c.originalFileName}.ts`,
								functionFilter: () => true,
							};
						}),
					)) as EmbeddedFilter[];

					// avoid duplicates
					// biome-ignore lint/complexity/noForEach:
					resolvedModifications.forEach((item) => {
						setFilters((c) => {
							if (c.findIndex((i) => i.identifier === item.identifier) === -1)
								return [...c, item];
							return c;
						});
					});

					newFilters = resolvedModifications.map((item) => {
						return item;
					});
				}

				// biome-ignore lint/complexity/noForEach:
				filters.forEach((filter) => {
					// Get back the filter type from the namespace
					const filterType = supportedFilters.find(
						(t) => filter.type === t.ns,
					);
					// Get back a filter with associated metadata
					const parsedFilter = filterType?.fi(
						filter.metadata as {
							[key: string]: string | number | boolean;
						},
					);

					newFilters.push({
						identifier: filterType?.ns + (Math.random() * Math.random() * Math.random()).toString(),
						functionFilter: (server: OnlineServer) => parsedFilter?.applyToServer({ online: server }) ?? true
					});
					setTagStrings((c) => [...c, ...(parsedFilter?.getTagStrings() as string[])])
				});

				await updateServers(newFilters);
			});
	}, [data]);

	return {
		filteredData,
		testModeEnabled,
		testModeLoading,
		testModeStatus,
		filterCount:
			filters.filter((item, index, array) => array.indexOf(item) === index)
				.length + (sort === null ? 1 : 0),
		loading,
		tagStrings
	};
}
