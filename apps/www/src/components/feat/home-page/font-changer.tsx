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

import { useEffectOnce } from "@/lib/useEffectOnce";
import {
	Inter,
	Roboto,
	Montserrat,
	Ubuntu_Condensed,
	Ubuntu,
	Poppins,
} from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { useEffect, useMemo, useState, type JSX } from "react";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });
const roboto = Roboto({
	subsets: ["latin"],
	weight: ["100", "300", "400", "500", "700", "900"],
});
const montserrat = Montserrat({
	subsets: ["latin"],
	weight: ["100", "300", "400", "500", "700", "900"],
});
const ubuntuCondensed = Ubuntu_Condensed({
	subsets: ["latin"],
	weight: ["400"],
});
const ubuntu = Ubuntu({
	subsets: ["latin"],
	weight: ["400"],
});
const poppins = Poppins({
	subsets: ["latin"],
	weight: ["400"],
});

const fonts = [
	inter.style,
	roboto.style,
	montserrat.style,
	GeistSans.style,
	ubuntuCondensed.style,
	ubuntu.style,
	poppins.style,
];

export function FontChanger({
	children,
	nounderline
}: { children: JSX.Element | JSX.Element[] | string, nounderline?: boolean }) {
	const [position, setPosition] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setPosition((position) => {
				if (position === fonts.length - 1) return 0;
				return position + 1;
			});
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	console.log(position);

	return (
		<div className="h-[1.2em] overflow-hidden flex items-center justify-center">
			<span
				className={cn("leading-[1.2] inline-block text-black dark:text-white font-normal h-[1.2em]", !nounderline ? "underline decoration-black dark:decoration-white" : "")}
				style={fonts[position]}
			>
				{children}
			</span>
		</div>
	);
}
