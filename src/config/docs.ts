export const allFolders: (DocsFolder | Docs)[] = [
	{
		title: "Getting Started",
		url: "/docs/getting-started",
	},
	{
		title: "Reading",
		url: "/docs/reading",
	},
	{
		name: "Guides",
		docs: [
			{
				title: "Linking",
				url: "/docs/guides/linking",
			},
			{
				title: "Owning a Server",
				url: "/docs/guides/owning-a-server",
			},
			{
				title: "Server Customization",
				url: "/docs/guides/customization",
			},
			{ title: "Reporting a server", url: "/docs/guides/reporting-server" },
		],
	},
	{
		name: "Advanced",
		docs: [
			{ title: "Tech Stack", url: "/docs/advanced/tech-stack" },
			{ title: "Using the Command-bar", url: "/docs/advanced/command-bar" },
			{ title: "Tips with external servers", url: "/docs/advanced/external" },
		],
	},
	{
		name: "Legal",
		docs: [
			{ title: "ECA Agreement", url: "/docs/legal/external-content-agreement" },
		],
	},
];

export type Docs = {
	title: string;
	url: string;
};

export type DocsFolder = {
	name: string;
	docs: Array<Docs>;
};
