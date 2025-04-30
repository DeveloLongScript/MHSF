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
			if (isSignedIn)
				existing = (
					(user.unsafeMetadata.filters as Array<
						ClerkEmbeddedFilter<unknown>
					>) ?? []
				).findIndex(
					(c) =>
						JSON.stringify(c.metadata) ===
							JSON.stringify(filter.toIdentifier()) &&
						c.type === filter.getSpecificFilterId(),
				);
			else
				existing = (
					(JSON.parse(localStorage.getItem("mhsf__filters") ?? "[]") as Array<
						ClerkEmbeddedFilter<unknown>
					>) ?? []
				).findIndex(
					(c) =>
						JSON.stringify(c.metadata) === JSON.stringify(filter.toIdentifier()) &&
						c.type === filter.getSpecificFilterId(),
				);
			return existing;
		}
		return -1;
	};

	useEffect(() => setApplied(findExisting()))

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
							const filter = value as Filter;
							const existing = findExisting();

							if (isSignedIn) {
								const existingArray =
									(user.unsafeMetadata.filters as Array<
										ClerkEmbeddedFilter<unknown>
									>) ?? [];
								existingArray.splice(existing, 1);
								if (existing === -1)
									await user.update({
										unsafeMetadata: {
											...user.unsafeMetadata,
											filters: [
												{
													type: filter.getSpecificFilterId(),
													metadata: filter.toIdentifier(),
												},
												...((user.unsafeMetadata.filters as Array<
													ClerkEmbeddedFilter<unknown>
												>) ?? []),
											] as Array<ClerkEmbeddedFilter<unknown>>,
										},
									});
								else
									await user.update({
										unsafeMetadata: {
											filters: existingArray,
											...user.unsafeMetadata,
										},
									});
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
											{
												type: filter.getSpecificFilterId(),
												metadata: filter.toIdentifier(),
											},
											...((JSON.parse(
												localStorage.getItem("mhsf__filters") ?? "[]",
											) as Array<ClerkEmbeddedFilter<unknown>>) ?? []),
										]),
									);
								else
									localStorage.setItem("mhsf__filters", JSON.stringify(existingArray));
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
