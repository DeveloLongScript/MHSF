import {
	type LucideProps,
	Medal,
	Sparkle,
	Sparkles,
	Users,
} from "lucide-react";
import type { ForwardRefExoticComponent, RefAttributes } from "react";

export const formalNames: FormalNames = {
	mostJoined: {
		title:
			"At one time, <b>this server had the most players on the platform!</b>",
		description:
			"This is awarded to servers that had the most players at the time of the achievements getting resolved.",
		color: "#9aedff",
		icon: Medal,
	},
	has1kFavorites: {
		title: "This server has more than <b>1,000 favorites on MHSF!</b>",
		description:
			"This is awarded to servers that had 1,000 favorites at the time of the achievements getting resolved.",
		color: "#d064ff",
		icon: Sparkle,
	},
	has1kTotalJoins: {
		title: "This server has more than <b>1,000 total joins on Minehut!</b>",
		description:
			"This is awarded to servers that had 1,000 total joins at the time of the achievements getting resolved.",
		color: "#aefa1f",
		icon: Users,
	},
	has100kFavorites: {
		title: "This server has more than <b>100,000 favorites on MHSF!</b>",
		description:
			"This is awarded to servers that had 100,000 favorites at the time of the achievements getting resolved.",
		color: "#fa5b07",
		icon: Sparkles,
	},
	has100kTotalJoins: {
		title: "This server has more than <b>100,000 total joins on Minehut!</b>",
		description:
			"This is awarded to servers that had 100,000 total joins at the time of the achievements getting resolved.",
		color: "#bdcffa",
		icon: Users,
	},
};
interface FormalNames {
	[key: string]: {
		title: string;
		description: string;
		color: string;
		icon: ForwardRefExoticComponent<
			Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
		>;
	};
}
