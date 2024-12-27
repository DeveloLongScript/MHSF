/*
 * MHSF, Minehut Server List
 * All external content is rather licensed under the ECA Agreement
 * located here: https://list.mlnehut.com/docs/legal/external-content-agreement
 *
 * All code under MHSF is licensed under the MIT License
 * by open source contributors
 *
 * Copyright (c) 2024 dvelo
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
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import { type ReactNode, useEffect, useState } from "react";
import { ThemeProvider } from "../ThemeProvider";
import Link from "next/link";

export function ClerkThemeProvider({
	children,
	className,
}: {
	children?: ReactNode | ReactNode[];
	className?: string | undefined;
}) {
	const [theme, setTheme] = useState<string | undefined>("");

	if (process.env.NEXT_PUBLIC_IS_AUTH !== "true")
		return (
			<html lang="en" className={className}>
				<body>
					Non-authenticated environments are disallowed on this origin. <br />
					<Link href="https://mhsf.app">Go to production</Link>
				</body>
			</html>
		);

	return (
		<ClerkProvider
			appearance={{ baseTheme: theme == "dark" ? dark : undefined }}
		>
			<html lang="en" className={className}>
				<body>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
						{children}
						{/** This *has* to be implemented in component form for the `useTheme` to load at the appropriate time. */}
						<ThemeElement setTheme={setTheme} />
					</ThemeProvider>
				</body>
			</html>
		</ClerkProvider>
	);
}

function ThemeElement({
	setTheme,
}: {
	setTheme: (update: string | undefined) => void;
}) {
	const theme = useTheme();
	useEffect(() => {
		setTheme(theme.resolvedTheme);
	}, [theme.resolvedTheme, setTheme]);
	return <></>;
}
