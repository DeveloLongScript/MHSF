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

import { Material } from "@/components/ui/material";
import { Ripple } from "../../home-page/ripple";

const PARTNER_HERO = "This server is partnered with MHSF.";
const PARTNER_DESCRIPTION =
	"This server and its staff support the future of MHSF";
const PARTNER_DESCRIPTION_2 =
	"and a portion of users on MHSF may come from this server";
const PARTNER_DESCRIPTION_3 = "or it's communication standards.";

export function AffiliateRow() {
	return (
		<Material className="p-4 col-span-2 row-span-2 relative h-[500px] max-lg:mb-3 flex items-center justify-center">
			<span className="text-center">
				<h1 className="animate-fade-in text-balance bg-gradient-to-br from-black from-30% to-black/40 bg-clip-text pb-6 text-2xl font-semibold leading-none tracking-tighter text-transparent opacity-0 [--animation-delay:200ms] sm:text-2xl md:text-3xl lg:text-4xl dark:from-white dark:to-white/40">
					{PARTNER_HERO}
				</h1>
				<p className="animate-fade-in mb-6 mt-6 -translate-y-4 text-balance text-md tracking-tight text-gray-400 opacity-0 [--animation-delay:400ms] md:text-xl">
					{PARTNER_DESCRIPTION} <br /> {PARTNER_DESCRIPTION_2} <br /> {PARTNER_DESCRIPTION_3}
				</p>
			</span>
			<Ripple mainCircleSize={700} className="max-md:hidden" />
		</Material>
	);
}
