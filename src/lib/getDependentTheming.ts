import { useTheme } from "next-themes";

export function useDepTheme() {
	const { resolvedTheme } = useTheme();

	return resolvedTheme === "dark" ? "black" : "white";
}
