import { LinearClient, LinearFetch, User } from "@linear/sdk";

export async function createReportIssue(server: string, reportDescription: string, userId: string) {
    const linearClient = new LinearClient({
        apiKey: process.env.LINEAR
    })

    const allTeams = await linearClient.teams();
    // Always grabs the first issue category.
    const team = allTeams.nodes[0];

    // Ensure there *actually* is a team there
    if (team.id) {
        await linearClient.createIssue({teamId: team.id, title: `Issue against server \`${server}\``, description: desc(userId, server, reportDescription), assigneeId: (await team.members()).nodes[0].id  })
    }
}

const desc = (user: string, server: string, reason: string) => `There was a report against the server, submitted by a user.
Every issue must be [considered with care](https://list.mlnehut.com/docs/legal/external-content-agreement) before evaluating its outcome.


**User**: \`${user}\`
**Server**: \`${server}\`
**For reason**:
${reason}


*This was an automatically added issue by the report bot. Add the canceled status to remove the issue from the active issues, along with the labels Not Controllable & Spam for their respective values.*
`