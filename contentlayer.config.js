import { defineDocumentType, makeSource } from "contentlayer/source-files";
import rehypeSlug from "rehype-slug";
import GithubSlugger from "github-slugger";

export const Docs = defineDocumentType(() => ({
	name: "Docs",
	filePathPattern: `**/*.mdx`,
	contentType: "mdx",
	fields: {
		title: {
			type: "string",
			required: true,
		},
		folder: {
			type: "string",
			required: false,
		},
		lastUpdated: {
			type: "string",
			required: false,
		},
	},
	computedFields: {
		url: {
			type: "string",
			resolve: (docs) => `/docs/${docs._raw.flattenedPath}`,
		},
		toc: {
			type: "json",
			resolve: async (doc) => {
				const headingsRegex = /\n(?<flag>#{1,6})\s+(?<content>.+)/g;
				const slugger = new GithubSlugger();
				const headings = Array.from(doc.body.raw.matchAll(headingsRegex)).map(
					({ groups }) => {
						const flag = groups?.flag;
						const content = groups?.content;
						return {
							level: flag.length,
							text: content,
							slug: content ? slugger.slug(content) : undefined,
						};
					},
				);
				return headings;
			},
		},
	},
}));

export default makeSource({
	contentDirPath: "docs",
	documentTypes: [Docs],
	mdx: { rehypePlugins: [rehypeSlug] },
});
