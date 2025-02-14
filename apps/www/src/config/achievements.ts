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
