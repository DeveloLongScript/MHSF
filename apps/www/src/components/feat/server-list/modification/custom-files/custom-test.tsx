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

import { transpileTypeScript } from "@/app/(sl-modification-frame)/servers/embedded/sl-modification-frame/file/[filename]/page";
import { Setting, SettingContent, SettingDescription, SettingMeta, SettingTitle } from "@/components/feat/settings/setting";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Material } from "@/components/ui/material";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { tryCatch } from "@/lib/try-catch";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CustomTestSuccess } from "./custom-test-success";

export function CustomTest({value, successfullyLinted, filename}: {value: string, successfullyLinted: boolean; filename: string}) {
	const [open, setOpen] = useState(false);
	const [filterEnabled, setFilterEnabled] = useState(true);
	const [sortEnabled, setSortEnabled] = useState(true);
	const [success, setSuccess] = useState(false);
    const [testMode, setTestMode] = useState<"filter" | "sort" | "">("");

    // biome-ignore lint: values needed (but not shown by linter)
	useEffect(() => setSuccess(false), [value]);

    // biome-ignore lint: values not needed
	useEffect(() => {
		setFilterEnabled(true);
		setSortEnabled(true);
		setTestMode("");
		(async () => {
			const transpiledValue = transpileTypeScript(value);
			const functionBody = transpiledValue
				?.replace(/export default(?!.*[;])/g, "") // Avoid replacing if followed by a semicolon
				.replace(/export(?!.*[;])/g, ""); // Avoid replacing if followed by a semicolon
			const { error: filterErr, data: filterFunc } = await tryCatch(
				(async () =>
					new Function(
						"server",
						`${functionBody}
												return filter(server)`,
					))(),
			);
			const { error: sortErr, data: sortFunc } = await tryCatch(
				(async () =>
					new Function(
						"serverA",
						"serverB",
						`${functionBody}
												return sort(serverA, serverB)`,
					))(),
			);

			if (filterErr) setFilterEnabled(false);
			if (sortErr) setSortEnabled(false);

			try {
				filterFunc?.({});
			} catch (e) {
				if (String(e).startsWith("ReferenceError: filter is not defined")) {
					setFilterEnabled(false);
				}
			}
			try {
				sortFunc?.({}, {});
			} catch (e) {
				if (String(e).startsWith("ReferenceError: sort is not defined")) {
					setSortEnabled(false);
				}
			}
		})();
	}, [open, value]);

	return (
		<>
			<Button disabled={!successfullyLinted} onClick={() => setOpen(true)}>
				Test
			</Button>
			<Drawer direction="right" open={open} onOpenChange={setOpen}>
				<DrawerContent className="p-4 min-w-[400px] overflow-x-hidden max-h-screen overflow-y-auto">
					<p className="text-sm mb-2">
						You can run an interactive server-list environment with actual
						online servers to test your modifications.
					</p>

					<Material>
						<Setting>
							<SettingContent>
								<SettingMeta>
									<SettingTitle>Function to test</SettingTitle>
									<SettingDescription>
										You can pick to either test a sorting system or a filter.
									</SettingDescription>
								</SettingMeta>
								<Select
									value={testMode}
									onValueChange={setTestMode as (change: string) => void}
									disabled={success}
								>
									<SelectTrigger className="w-[180px]">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectGroup>
											<SelectItem value="filter" disabled={!filterEnabled}>
												<code>filter</code>
											</SelectItem>
											<SelectItem value="sort" disabled={!sortEnabled}>
												<code>sort</code>
											</SelectItem>
										</SelectGroup>
									</SelectContent>
								</Select>
							</SettingContent>
						</Setting>
					</Material>

					<Button
						className="w-full mt-2 flex items-center gap-2"
						disabled={testMode === "" || success}
						variant={success ? "success-subtle" : "default"}
						onClick={() => {
							const t = btoa(value);

							const newTab = window.open(
								`/servers?tm=${encodeURIComponent(t)}`,
							);
							const interval = setInterval(() => {
								newTab?.dispatchEvent(
									new Event(`test-mode.enable.${testMode}`),
								);
							}, 500);
							toast.info("Waiting for server tab to pick up thread...");

							newTab?.addEventListener("test-mode.enabled", () => {
								clearInterval(interval);
								toast.success("Connected to new tab; continue.");
								newTab?.addEventListener("test-mode.success", () => {
									toast.success("Resolved success from thread!");
									setSuccess(true);
								});
							});
						}}
					>
						{success && <Check size={16} />}Test
					</Button>
					{success && (
						<CustomTestSuccess filename={filename} testMode={testMode} value={value} />
					)}
				</DrawerContent>
			</Drawer>
		</>
	);
}
