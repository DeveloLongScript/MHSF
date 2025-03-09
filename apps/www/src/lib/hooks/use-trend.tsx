/*
 * MHSF, Minehut Server List
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

import { useEffect, useState } from "react";

const months = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

export function useTrend(data: { month: string; result: number }[]) {
	const [success, setSuccess] = useState(true);
	const [trend, setTrend] = useState<"up" | "down">("up");
	const [percentage, setPercentage] = useState<number>(0);

	useEffect(() => {
		const today = new Date();
		const previousMonth = new Date();
		previousMonth.setDate(0);

		const previousMonthData = data.find(
			(x) => x.month === months[previousMonth.getMonth()],
		);
		const todayMonthData = data.find(
			(x) => x.month === months[today.getMonth()],
		);

		if (previousMonthData === undefined || todayMonthData === undefined) {
			setSuccess(false);
			return;
		}

		if (previousMonthData.result === 0) {
			setSuccess(false);
			return;
		}

		setSuccess(true);
		setTrend(previousMonthData.result < todayMonthData.result ? "up" : "down");
		setPercentage(
			Math.abs(
				Number(
					(
						((todayMonthData.result - previousMonthData.result) /
							previousMonthData.result) *
						100
					).toFixed(1),
				),
			),
		);
	}, [data]);

	return {
		success,
		trend,
		percentage,
	};
}
