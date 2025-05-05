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

"use client";
import { useTheme } from "@/lib/hooks/use-theme";
import type { SVGProps } from "react";

export const brandingIconClipboard = `<svg width="266" height="265" viewBox="0 0 266 265" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="0.524048" width="264.939" height="264.939" rx="66" fill="url(#paint0_linear_1_19)"/>
<path d="M104.513 123.27H94.8717C92.3148 123.27 89.8626 122.254 88.0546 120.446C86.2466 118.638 85.2309 116.186 85.2309 113.629V94.3476C85.2309 91.7907 86.2466 89.3385 88.0546 87.5305C89.8626 85.7225 92.3148 84.7068 94.8717 84.7068H171.998C174.555 84.7068 177.007 85.7225 178.815 87.5305C180.623 89.3385 181.639 91.7907 181.639 94.3476V113.629C181.639 116.186 180.623 118.638 178.815 120.446C177.007 122.254 174.555 123.27 171.998 123.27H162.357M104.513 142.552H94.8717C92.3148 142.552 89.8626 143.567 88.0546 145.376C86.2466 147.184 85.2309 149.636 85.2309 152.193V171.474C85.2309 174.031 86.2466 176.483 88.0546 178.291C89.8626 180.099 92.3148 181.115 94.8717 181.115H171.998C174.555 181.115 177.007 180.099 178.815 178.291C180.623 176.483 181.639 174.031 181.639 171.474V152.193C181.639 149.636 180.623 147.184 178.815 145.376C177.007 143.567 174.555 142.552 171.998 142.552H162.357M104.513 103.988H104.561M104.513 161.833H104.561M138.255 103.988L118.974 132.911H147.896L128.615 161.833" stroke="white" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
<circle cx="132.993" cy="132.469" r="91.3779" stroke="url(#paint1_linear_1_19)" stroke-width="8"/>
<defs>
<linearGradient id="paint0_linear_1_19" x1="107.824" y1="54.754" x2="230.579" y2="225.198" gradientUnits="userSpaceOnUse">
<stop stop-color="#007BFF"/>
<stop offset="1" stop-color="#BF00FF" stop-opacity="0.5"/>
</linearGradient>
<linearGradient id="paint1_linear_1_19" x1="132.993" y1="37.0914" x2="132.993" y2="227.847" gradientUnits="userSpaceOnUse">
<stop stop-color="#EFEC32"/>
<stop offset="1" stop-color="#98FF60"/>
</linearGradient>
</defs>
</svg>`;

/**
 * Returns a colorful version of the branding icon.
 *
 * The stored SVG file is at `/public/svg/icon-cf.svg`
 *
 * @param props The props for the SVG element.
 * @returns A JSX element representing the colorful branding icon.
 */
export function BrandingColorfulIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="266"
			height="265"
			fill="none"
			viewBox="0 0 266 265"
		>
			<rect
				width="264.939"
				height="264.939"
				x="0.524"
				fill="url(#paint0_linear_1_19)"
				rx="66"
			/>
			<path
				stroke="#fff"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="10"
				d="M104.513 123.27h-9.641a9.64 9.64 0 0 1-9.641-9.641V94.348a9.64 9.64 0 0 1 9.64-9.641h77.127a9.64 9.64 0 0 1 9.641 9.64v19.282a9.64 9.64 0 0 1-9.641 9.641h-9.641m-57.844 19.282h-9.641a9.64 9.64 0 0 0-9.64 9.641v19.281a9.64 9.64 0 0 0 9.64 9.641h77.126a9.64 9.64 0 0 0 9.641-9.641v-19.281a9.64 9.64 0 0 0-9.641-9.641h-9.641m-57.844-38.564h.048m-.048 57.845h.048m33.694-57.845-19.281 28.923h28.922l-19.281 28.922"
			/>
			<circle
				cx="132.993"
				cy="132.469"
				r="91.378"
				stroke="url(#paint1_linear_1_19)"
				strokeWidth="8"
			/>
			<defs>
				<linearGradient
					id="paint0_linear_1_19"
					x1="107.824"
					x2="230.579"
					y1="54.754"
					y2="225.198"
					gradientUnits="userSpaceOnUse"
				>
					<stop stopColor="#007BFF"/>
					<stop offset="1" stopColor="#BF00FF" stopOpacity="0.5"/>
				</linearGradient>
				<linearGradient
					id="paint1_linear_1_19"
					x1="132.993"
					x2="132.993"
					y1="37.091"
					y2="227.847"
					gradientUnits="userSpaceOnUse"
				>
					<stop stopColor="#EFEC32"/>
					<stop offset="1" stopColor="#98FF60"/>
				</linearGradient>
			</defs>
		</svg>
	);
}
/**
 * Returns the optional Pride icon
 *
 * The stored SVG file is at `/public/svg/icon-p.svg`
 *
 * @param {SVGProps<SVGSVGElement>} props The props for the SVG element.
 * @returns A JSX element representing the branding icon.
 */
export function BrandingPrideIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="265"
			height="265"
			fill="none"
			viewBox="0 0 265 265"
			{...props}
		>
			<rect
				width="264.939"
				height="264.939"
				fill="url(#paint0_linear_1_30)"
				rx="66"
			/>
			<path
				stroke="#fff"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="10"
				d="M103.988 123.27h-9.64a9.64 9.64 0 0 1-9.641-9.641V94.348a9.64 9.64 0 0 1 9.64-9.641h77.127a9.64 9.64 0 0 1 9.641 9.64v19.282a9.64 9.64 0 0 1-9.641 9.641h-9.641m-57.845 19.282h-9.64a9.64 9.64 0 0 0-9.64 9.641v19.281a9.64 9.64 0 0 0 9.64 9.641h77.126a9.64 9.64 0 0 0 9.641-9.641v-19.281a9.64 9.64 0 0 0-9.641-9.641h-9.641m-57.845-38.564h.049m-.049 57.845h.049m33.694-57.845-19.281 28.923h28.922l-19.281 28.922"
			/>
			<circle
				cx="132.469"
				cy="132.469"
				r="91.378"
				stroke="url(#paint1_linear_1_30)"
				strokeWidth="8"
			/>
			<defs>
				<linearGradient
					id="paint0_linear_1_30"
					x1="51.663"
					x2="222.549"
					y1="26.935"
					y2="213.717"
					gradientUnits="userSpaceOnUse"
				>
					<stop stopColor="red" />
					<stop offset="0.11" stopColor="#FF6200" />
					<stop offset="0.226" stopColor="#FFAE00" />
					<stop offset="0.326" stopColor="#FFD500" />
					<stop offset="0.422" stopColor="#99EA00" />
					<stop offset="0.498" stopColor="#4DF457" />
					<stop offset="0.593" stopColor="#26D3AB" />
					<stop offset="0.7" stopColor="#13A9D5" />
					<stop offset="0.806" stopColor="#A200FF" />
					<stop offset="0.884" stopColor="#C62AEB" />
					<stop offset="0.957" stopColor="#fff" />
					<stop offset="0.997" />
				</linearGradient>
				<linearGradient
					id="paint1_linear_1_30"
					x1="132.469"
					x2="132.469"
					y1="37.091"
					y2="227.847"
					gradientUnits="userSpaceOnUse"
				>
					<stop stopColor="#EFEC32" />
					<stop offset="1" stopColor="#98FF60" />
				</linearGradient>
			</defs>
		</svg>
	);
}

/**
 * Returns the branding icon based on the current theme.
 *
 * If the theme is dark, the branding icon is a dark version of the logo.
 * If the theme is light, the branding icon is a light version of the logo.
 *
 * The stored SVG file is at `/public/svg/icon-gl.svg` or `/public/svg/icon-gd.svg`
 *
 * @param {SVGProps<SVGSVGElement>} props The props for the SVG element.
 *
 * @returns A JSX element representing the branding icon.
 */
export function BrandingGenericIcon(props: SVGProps<SVGSVGElement>) {
	const { resolvedTheme } = useTheme();

	if (resolvedTheme === "dark") {
		return (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="265"
				height="266"
				fill="none"
				viewBox="0 0 265 266"
				{...props}
			>
				<rect
					width="264.939"
					height="264.939"
					x="0.061"
					y="0.861"
					fill="url(#paint0_linear_1_20)"
					rx="66"
				/>
				<path
					stroke="#fff"
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth="10"
					d="M104.05 124.132h-9.641a9.64 9.64 0 0 1-9.64-9.641V95.209a9.64 9.64 0 0 1 9.64-9.64h77.127a9.64 9.64 0 0 1 9.64 9.64v19.282a9.64 9.64 0 0 1-9.64 9.641h-9.641m-57.845 19.281h-9.641a9.64 9.64 0 0 0-9.64 9.641v19.282a9.64 9.64 0 0 0 9.64 9.641h77.127a9.64 9.64 0 0 0 9.64-9.641v-19.282a9.64 9.64 0 0 0-9.64-9.641h-9.641M104.05 104.85h.048m-.048 57.845h.048m33.695-57.845-19.282 28.922h28.922l-19.281 28.923"
				/>
				<circle
					cx="132.531"
					cy="133.331"
					r="91.378"
					stroke="url(#paint1_linear_1_20)"
					strokeWidth="8"
				/>
				<defs>
					<linearGradient
						id="paint0_linear_1_20"
						x1="107.361"
						x2="230.116"
						y1="55.615"
						y2="226.059"
						gradientUnits="userSpaceOnUse"
					>
						<stop />
					</linearGradient>
					<linearGradient
						id="paint1_linear_1_20"
						x1="132.531"
						x2="132.531"
						y1="37.953"
						y2="228.709"
						gradientUnits="userSpaceOnUse"
					>
						<stop stopColor="#EFEC32" />
						<stop offset="1" stopColor="#98FF60" />
					</linearGradient>
				</defs>
			</svg>
		);
	}
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="265"
			height="265"
			fill="none"
			viewBox="0 0 265 265"
			{...props}
		>
			<rect
				width="264.939"
				height="264.939"
				x="0.061"
				fill="url(#paint0_linear_1_25)"
				rx="66"
			/>
			<path
				stroke="#000"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="10"
				d="M104.05 123.27h-9.641a9.64 9.64 0 0 1-9.64-9.641V94.348a9.64 9.64 0 0 1 9.64-9.641h77.127a9.64 9.64 0 0 1 9.64 9.64v19.282a9.64 9.64 0 0 1-9.64 9.641h-9.641m-57.845 19.282h-9.641a9.64 9.64 0 0 0-9.64 9.641v19.281a9.64 9.64 0 0 0 9.64 9.641h77.127a9.64 9.64 0 0 0 9.64-9.641v-19.281a9.64 9.64 0 0 0-9.64-9.641h-9.641m-57.845-38.564h.048m-.048 57.845h.048m33.695-57.845-19.282 28.923h28.922l-19.281 28.922"
			/>
			<circle
				cx="132.531"
				cy="132.469"
				r="91.378"
				stroke="url(#paint1_linear_1_25)"
				strokeWidth="8"
			/>
			<defs>
				<linearGradient
					id="paint0_linear_1_25"
					x1="107.361"
					x2="230.116"
					y1="54.754"
					y2="225.198"
					gradientUnits="userSpaceOnUse"
				>
					<stop stopColor="#fff" />
				</linearGradient>
				<linearGradient
					id="paint1_linear_1_25"
					x1="132.531"
					x2="132.531"
					y1="37.091"
					y2="227.847"
					gradientUnits="userSpaceOnUse"
				>
					<stop stopColor="#EFEC32" />
					<stop offset="1" stopColor="#98FF60" />
				</linearGradient>
			</defs>
		</svg>
	);
}

export const Discord = (props: SVGProps<SVGSVGElement>) => (
	<svg
		viewBox="0 0 256 199"
		width="1em"
		height="1em"
		xmlns="http://www.w3.org/2000/svg"
		preserveAspectRatio="xMidYMid"
		{...props}
	>
		<path
			d="M216.856 16.597A208.502 208.502 0 0 0 164.042 0c-2.275 4.113-4.933 9.645-6.766 14.046-19.692-2.961-39.203-2.961-58.533 0-1.832-4.4-4.55-9.933-6.846-14.046a207.809 207.809 0 0 0-52.855 16.638C5.618 67.147-3.443 116.4 1.087 164.956c22.169 16.555 43.653 26.612 64.775 33.193A161.094 161.094 0 0 0 79.735 175.3a136.413 136.413 0 0 1-21.846-10.632 108.636 108.636 0 0 0 5.356-4.237c42.122 19.702 87.89 19.702 129.51 0a131.66 131.66 0 0 0 5.355 4.237 136.07 136.07 0 0 1-21.886 10.653c4.006 8.02 8.638 15.67 13.873 22.848 21.142-6.58 42.646-16.637 64.815-33.213 5.316-56.288-9.08-105.09-38.056-148.36ZM85.474 135.095c-12.645 0-23.015-11.805-23.015-26.18s10.149-26.2 23.015-26.2c12.867 0 23.236 11.804 23.015 26.2.02 14.375-10.148 26.18-23.015 26.18Zm85.051 0c-12.645 0-23.014-11.805-23.014-26.18s10.148-26.2 23.014-26.2c12.867 0 23.236 11.804 23.015 26.2 0 14.375-10.148 26.18-23.015 26.18Z"
			fill="#5865F2"
		/>
	</svg>
);
