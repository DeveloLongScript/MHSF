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

import {
	ArrowDownUpIcon,
	Database,
	DatabaseZap,
	HardDriveDownload,
	List,
	ServerCog,
	SlidersHorizontal,
	UserPlus,
	type LucideIcon,
} from "lucide-react";
import { type Filter } from "../lib/types/filter";
import type { Sort } from "../lib/types/sort";
import { TagFilter } from "@/lib/types/filters/tag-filter";
import { allCategories } from "./tags";
import { CategoryFilter } from "@/lib/types/filters/category-filter";
import { PlayerRangeFilter } from "@/lib/types/filters/player-range-filter";
import { CombinationFilter } from "@/lib/types/filters/combination-filter";

type ModDBCategory = {
	displayTitle: string;
	description: string;
	__custom?: boolean;
	entries: {
		name: string;
		icon: LucideIcon;
		color: string;
		value: Filter | Sort | { customAction: string };
		description: string;
	}[];
};

export const serverModDB: ModDBCategory[] = [
	{
		displayTitle: "Create Custom Files",
		description: `Create custom TypeScript-based filter or sorting systems, completely from the comfort of your own browser.
            Types used are *builtin* and you can see live type definitions and IntelliSense in the editor.`,
		entries: [
			{
				name: "Create Sort",
				icon: ArrowDownUpIcon,
				value: { customAction: "custom-sort" },
				color: "#a3a68b",
				description:
					"Create a new custom sort system using TypeScript, completely from the comfort of your own browser.",
			},
			{
				name: "Create Filter",
				icon: SlidersHorizontal,
				value: { customAction: "custom-filter" },
				color: "#a3a68b",
				description:
					"Create a new custom filtering system using TypeScript, completely from the comfort of your own browser.",
			},
		],
	},
	{
		displayTitle: "Custom Files",
		description:
			"These are all of your activated modifications made in the editor.",
		__custom: true,
		// Entries are already pre-loaded.
		entries: [],
	},
	{
		displayTitle: "Tag Filters",
		description:
			"These are filters that are associated with an assortment of tags.",
		entries: [
			{
				name: "Always Online",
				description: "All servers that are always online.",
				color: "#a380e0",
				value: new TagFilter(3, false),
				icon: ServerCog,
			},
			{
				name: "Minehut-hosted",
				description:
					"Only show servers hosted directly on Minehut's infrastructure, and not external servers.",
				color: "#fce2e2",
				value: new TagFilter(0, true),
				icon: HardDriveDownload,
			},
			{
				name: "No player-less servers",
				description: "Exclude servers that have no players",
				color: "#66c219",
				value: new TagFilter(2, true),
				icon: UserPlus,
			},
		],
	},
	{
		displayTitle: "Categories",
		description: "Sort servers by the categories they directly are in.",
		entries: allCategories.map((c, i) => {
			return {
				color: "#eae9e9",
				value: new CategoryFilter(i),
				name: c.name,
				description: `Filter all servers that are have the category '${c.name}'`,
				icon: List
			};
		}),
	},
	{
		displayTitle: "Legacy Player Range Filters",
		description: "Use old player range filters from MHSF v0-v1.",
		entries: [
			{
				color: "#ceaced",
				value: new CombinationFilter([
					new PlayerRangeFilter(7, 15),
					new TagFilter(3, true),
				]),
				name: "Only allow smaller servers",
				description:
					"Only allow servers that have the player range 7-15, and cannot be Always Online.",
				icon: Database,
			},
			{
				color: "#ceaced",
				value: new PlayerRangeFilter(15, null),
				name: "Only allow bigger servers",
				description: "Only allow servers with more than 15 players",
				icon: DatabaseZap,
			},
		],
	},
];
