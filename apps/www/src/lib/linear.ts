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

import { LinearClient, LinearFetch, User } from "@linear/sdk";

export async function createReportIssue(
	server: string,
	reportDescription: string,
	userId: string,
) {
	const linearClient = new LinearClient({
		apiKey: process.env.LINEAR,
	});

	const allTeams = await linearClient.teams();
	// Always grabs the first issue category.
	const team = allTeams.nodes[0];

	// Ensure there *actually* is a team there
	if (team.id) {
		await linearClient.createIssue({
			teamId: team.id,
			title: `Issue against server \`${server}\``,
			description: desc(userId, server, reportDescription),
			assigneeId: (await team.members()).nodes[0].id,
		});
	}
}

const desc = (user: string, server: string, reason: string) => `There was a report against the server, submitted by a user.
Every issue must be [considered with care](https://list.mlnehut.com/docs/legal/external-content-agreement) before evaluating its outcome.


**User**: \`${user}\`
**Server**: \`${server}\`
**For reason**:
${reason}


*This was an automatically added issue by the report bot. Add the canceled status to remove the issue from the active issues, along with the labels Not Controllable & Spam for their respective values.*
`;
