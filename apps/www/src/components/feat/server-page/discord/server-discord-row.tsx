import { useMHSFServer } from "@/lib/hooks/use-mhsf-server";
import { useTheme } from "@/lib/hooks/use-theme";
import { ServerResponse } from "@/lib/types/mh-server";
import { useUser } from "@clerk/nextjs";

export function ServerDiscordRow({
	server,
	mhsfData,
}: { server: ServerResponse; mhsfData: ReturnType<typeof useMHSFServer> }) {
	const { user, isSignedIn } = useUser();
	const { resolvedTheme } = useTheme()

	return (
		<iframe
			src={`https://discord.com/widget?id=${mhsfData.server?.customizationData.discord}&theme=${resolvedTheme ?? "dark"}${isSignedIn ? `&username=${user.username}` : ""}`}
			height={250}
			// @ts-ignore bro idk what react is on :sob:
			allowtransparency={true}
			frameBorder={0}
			title="Discord Embed"
			className="w-full relative max-lg:mt-3 rounded-lg"
			sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
		/>
	);
}
