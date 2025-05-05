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
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIE
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

import { MHSFData } from "../data";
import type { Filter, FilterIdentifier } from "../filter";
import { OnlineServer, ServerResponse } from "../mh-server";

export class PlayerRangeFilter implements Filter {
	min: number | null;
	max: number | null;

	type(): "filter" {
		return "filter";
	}

	getSpecificFilterId(): string {
		return "app.mhsf.filter.playerRangeFilter";
	}

    constructor(min: number | null, max: number | null) {
        this.min = min;
        this.max = max;
    }

    fromIdentifier(identifier: FilterIdentifier): Filter {
        return new PlayerRangeFilter(identifier.min as number | null, identifier.max as number | null);
    }

    toIdentifier(): FilterIdentifier {
        return {min: this.min, max: this.max};
    }

	applyToServer(server: {
		online?: OnlineServer;
		server?: ServerResponse;
		mhsfData?: MHSFData;
	}): Promise<boolean> {
		if (this.max === null && this.min === null)
			return new Promise((r) => r(true));

		if (this.max === null)
			return new Promise((r) => r((server.online?.playerData.playerCount ?? 0) >= (this.min ?? 0)))

		if (this.min === null)
			return new Promise((r) => r((server.online?.playerData.playerCount ?? 0) <= (this.max ?? 0)))

		return new Promise((r) =>
			r(
				(server.online?.playerData.playerCount ?? 0) <= (this.max ?? 0) &&
					(server.online?.playerData.playerCount ?? 0) >= (this.min ?? 0),
			),
		);
	}
	getTagStrings(): string[] {
		const tagArray = [];

		if (this.max !== null)
			tagArray.push(`${this.max} maximum players`)
		if (this.min !== null)
			tagArray.push(`${this.min} minimum players`)

		return tagArray;
	}
}
