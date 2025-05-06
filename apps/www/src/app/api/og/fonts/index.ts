// For Edge runtime, we need to use fetch instead of fs
export async function loadFonts() {
  const interRegularFontP = fetch(
    new URL("./Inter-Regular.ttf", import.meta.url)
  ).then((res) => res.arrayBuffer());

  const interMediumFontP = fetch(
    new URL("./Inter-Medium.ttf", import.meta.url)
  ).then((res) => res.arrayBuffer());

  const interBoldFontP = fetch(
    new URL("./Inter-Bold.ttf", import.meta.url)
  ).then((res) => res.arrayBuffer());

  return Promise.all([interRegularFontP, interMediumFontP, interBoldFontP]);
}
