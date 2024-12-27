/*
 * MHSF, Minehut Server List
 * All external content is rather licensed under the ECA Agreement
 * located here: https://mhsf.app/docs/legal/external-content-agreement
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

import { bannerHooks, defaultBanners } from "@/config/banners";
import { useEffect, useState } from "react";
import { useIsMobile } from "./use-mobile";

export default function useTotalBannerSize() {
	const [bannerSize, setBannerSize] = useState(0);
	const isOnMobile = useIsMobile();

	useEffect(() => {
		setBannerSize(0);
		if (isOnMobile) return;
		const allBanners = [];

		// First push the default banners
		allBanners.push(...defaultBanners);

		// Then push the banner hooks
		bannerHooks.forEach((hook) => {
			allBanners.push(hook());
		});

		setBannerSize(
			allBanners.reduce(
				(acc, banner) => acc + (banner ?? { bannerSpace: 0 }).bannerSpace,
				0,
			) ?? 0,
		);
	}, [isOnMobile]);

	return { bannerSize };
}
