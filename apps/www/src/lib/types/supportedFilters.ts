import { FilterIdentifier, Filter } from "./filter";
import { filterRegistry } from "./filter-registry";

export const supportedFilters = Array.from(filterRegistry.entries()).map(([ns, fi]) => ({
	ns,
	fi
}));
