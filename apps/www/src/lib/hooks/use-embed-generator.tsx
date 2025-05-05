import { useEffect, useState } from "react";

const JSX_INSERTS = `<iframe
    src="{{ embed }}"
    width={390}
    height={145}
    style={{ borderRadius: "0.25rem" }}
    allow="clipboard-write"
    frameBorder={0}
    sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
  />`
const HTML_INSERTS = `<iframe 
    src="{{ embed }}"
    width="390" 
    height="145" 
    style="border-radius: 0.25rem;" 
    allow="clipboard-write"
    frameborder="0" 
    sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
></iframe>`

export function useEmbedGenerator(name: string) {
    // In parameters
    const [theme, setTheme] = useState<"light" | "dark">("light");
    const [removeMinehutBranding, setRMHB] = useState<boolean>(false);
    const [staticMode, setStatic] = useState<boolean>(false);

    // Out parameters
    const [jsxCode, setJSX] = useState<string>();
    const [htmlCode, setHTML] = useState<string>();
    const [finalURL, setFinalURL] = useState<string>();

    useEffect(() => {
        const baseUrl = `${window.location.protocol}//${window.location.host}`;
        const url = new URL(`/embed/${name}`, baseUrl);

        url.searchParams.set("theme", theme);
        if (removeMinehutBranding)
            url.searchParams.set("branding", "false");
        if (staticMode)
            url.searchParams.set("static", "true")

        setJSX(JSX_INSERTS.replaceAll("{{ embed }}", url.toString()));
        setHTML(HTML_INSERTS.replaceAll("{{ embed }}", url.toString()));
        setFinalURL(url.toString());
    }, [theme, removeMinehutBranding, staticMode, name])

    return {
        in: {
            theme, setTheme,
            removeMinehutBranding, setRMHB,
            staticMode, setStatic
        },
        out: {
            jsxCode,
            htmlCode,
            finalURL
        }
    }
}