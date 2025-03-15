import { useTheme as useLibTheme } from "next-themes";

export function useTheme() {
  const theme = useLibTheme();

  return {
    ...theme,
    resolvedTheme: theme.forcedTheme ?? theme.resolvedTheme,
  };
}
