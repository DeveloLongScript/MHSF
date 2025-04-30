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

import { allTags } from "@/config/tags";
import type { MHSFData } from "../data";
import type { OnlineServer, ServerResponse } from "../mh-server";
import type { Filter } from "../filter";

export class TagFilter implements Filter {
	tagId: string;

    type(): "filter" {
        return "filter";
    }

	toIdentifier(): { [key: string]: string | number | boolean } {
		return { tagId: this.tagId };
	}

	getSpecificFilterId(): string {
		return "app.mhsf.filter.tagFilter";
	}

	fromIdentifier(identifier: {
		[key: string]: string | number | boolean;
	}): Filter {
		return new TagFilter(identifier.tagId as string);
	}

	constructor(tagIndex: number | string) {
		if (typeof tagIndex === "string") this.tagId = tagIndex;
		else this.tagId = btoa(allTags[tagIndex].docsName);
	}

	applyToServer(server: {
		online?: OnlineServer;
		server?: ServerResponse;
		mhsfData?: MHSFData;
	}): Promise<boolean> {
        const result = (
			(
				allTags.find((c) => btoa(c.docsName) === this.tagId) ?? {
					condition: () => true,
				}
			).condition ?? (() => true)
		)(server);

        if (typeof result === "boolean")
            return new Promise((r) => r(result))

		return result;
	}
}
