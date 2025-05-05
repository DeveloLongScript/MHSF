import { FilterIdentifier, Filter } from "./filter";
import { CategoryFilter } from "./filters/category-filter";
import { CombinationFilter } from "./filters/combination-filter";
import { PlayerRangeFilter } from "./filters/player-range-filter";
import { TagFilter } from "./filters/tag-filter";

export const filterRegistry = new Map<string, (identifier: FilterIdentifier) => Filter>();

// Register filters
filterRegistry.set("app.mhsf.filter.util.combinationFilter", (identifier: FilterIdentifier) => new CombinationFilter([]).fromIdentifier(identifier));
filterRegistry.set("app.mhsf.filter.tagFilter", (identifier: FilterIdentifier) => new TagFilter(0, false).fromIdentifier(identifier));
filterRegistry.set("app.mhsf.filter.categoryFilter", (identifier: FilterIdentifier) => new CategoryFilter(0).fromIdentifier(identifier));
filterRegistry.set("app.mhsf.filter.playerRangeFilter", (identifier: FilterIdentifier) => new PlayerRangeFilter(0, 0).fromIdentifier(identifier)); 