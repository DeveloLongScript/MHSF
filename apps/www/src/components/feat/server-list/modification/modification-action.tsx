import { Button } from "@/components/ui/button";
import type { Filter } from "@/lib/types/filter";
import type { Sort } from "@/lib/types/sort";
import { ModificationFileCreationDialog } from "./modification-file-creation-dialog";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useIframeCommunication } from "@/lib/hooks/use-iframe-communication";

type Action = Filter | Sort | { customAction: string };

export type ClerkEmbeddedFilter<T> = {
	type: string;
	metadata: T;
};

export function ModificationAction({ value }: { value?: Action }) {
	const { isSignedIn, user } = useUser();
	const [applied, setApplied] = useState<number | undefined>();
	const communication = useIframeCommunication();

	const findExisting = () => {
		if (!(value !== undefined && "customAction" in value)) {
			const filter = value as Filter;
			let existing = -1;
			console.log(
				(
					(user?.unsafeMetadata.filters as Array<
						ClerkEmbeddedFilter<unknown>
					>) ?? []
				).findIndex((c) => {
					return (
						JSON.stringify(c.metadata, replacer) === JSON.stringify(filter.toIdentifier(), replacer) &&
						c.type === filter.getSpecificFilterId()
					);
				}),
			);
			if (isSignedIn)
				existing = (
					(user.unsafeMetadata.filters as Array<
						ClerkEmbeddedFilter<unknown>
					>) ?? []
				).findIndex(
					(c) =>
						JSON.stringify(c.metadata, replacer) === JSON.stringify(filter.toIdentifier(), replacer) &&
						c.type === filter.getSpecificFilterId(),
				);
			else
				existing = (
					(JSON.parse(localStorage.getItem("mhsf__filters") ?? "[]") as Array<
						ClerkEmbeddedFilter<unknown>
					>) ?? []
				).findIndex(
					(c) =>
						JSON.stringify(c.metadata, replacer) === JSON.stringify(filter.toIdentifier(), replacer) &&
						c.type === filter.getSpecificFilterId(),
				);
			return existing;
		}
		return -1;
	};

	useEffect(() => setApplied(findExisting()));

	return (
		<>
			{value !== undefined && "customAction" in value ? (
				<ModificationFileCreationDialog
					type={value.customAction.endsWith("sort") ? "sort" : "filter"}
				>
					<Button size="sm" className="mt-1">
						{value.customAction === "custom-sort"
							? "Create Sort"
							: "Create Filter"}
					</Button>
				</ModificationFileCreationDialog>
			) : (
				<Button
					size="sm"
					className="mt-1"
					onClick={async () => {
						if (value?.type() === "filter") {
							const updatedUser = await user?.reload();
							const filter = value as Filter;
							const existing = findExisting();

							if (isSignedIn) {
								const existingArray =
									(updatedUser?.unsafeMetadata.filters as Array<
										ClerkEmbeddedFilter<unknown>
									>) ?? [];
								const previousFilters = updatedUser?.unsafeMetadata
									.filters as Array<ClerkEmbeddedFilter<unknown>>;
								if (existing === -1)
									await user.update({
										unsafeMetadata: {
											...(user.unsafeMetadata ?? {}),
											filters: [
												{
													type: filter.getSpecificFilterId(),
													metadata: filter.toIdentifier(),
												},
												...(previousFilters ?? []),
											] as Array<ClerkEmbeddedFilter<unknown>>,
										},
									});
								else {
									existingArray.splice(existing, 1);
									await user.update({
										unsafeMetadata: {
											...(user.unsafeMetadata ?? {}),
											filters: existingArray,
										},
									});
								}
							} else {
								const existingArray =
									(JSON.parse(
										localStorage.getItem("mhsf__filters") ?? "[]",
									) as Array<ClerkEmbeddedFilter<unknown>>) ?? [];
								existingArray.splice(existing, 1);

								if (existing === -1)
									localStorage.setItem(
										"mhsf__filters",
										JSON.stringify([
											...((JSON.parse(
												localStorage.getItem("mhsf__filters") ?? "[]",
											) as Array<ClerkEmbeddedFilter<unknown>>) ?? []),
											{
												type: filter.getSpecificFilterId(),
												metadata: filter.toIdentifier(),
											},
										], replacer),
									);
								else
									localStorage.setItem(
										"mhsf__filters",
										JSON.stringify(existingArray, replacer),
									);
							}

							setApplied(findExisting());
						}
						communication.fromIframe.send("rerender-servers", {});
					}}
				>
					{applied === -1 ? "A" : "Una"}pply
				</Button>
			)}
		</>
	);
}
const replacer = (key, value) =>
	value instanceof Object && !(Array.isArray(value)) ? 
		Object.keys(value)
		.sort()
		.reduce((sorted, key) => {
			sorted[key] = value[key];
			return sorted 
		}, {}) :
		value;