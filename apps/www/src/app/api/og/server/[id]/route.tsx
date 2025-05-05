import { ImageResponse } from "@vercel/og";
import { ServerResponse } from "@/lib/types/mh-server";
import { NextRequest } from "next/server";
import { miniMessage } from "minimessage-js";
import { loadFonts } from "../../fonts";

export const runtime = "edge";

// Function to parse MiniMessage and create JSX elements with styling
function parseMotdToJsx(text: string) {
  try {
    // First convert to HTML
    const htmlContent = miniMessage().toHTML(miniMessage().deserialize(text));

    // Simple parsing of the HTML to extract basic formatting
    // This is a simplified approach that handles common formatting
    const parts = [];
    let currentText = "";
    let inBold = false;
    let inItalic = false;
    let inUnderline = false;
    let currentColor = "white";
    let partIndex = 0;

    // Create a simple parser for the HTML content
    let i = 0;
    while (i < htmlContent.length) {
      // Handle opening tags
      if (htmlContent[i] === "<") {
        // Add current text if any
        if (currentText) {
          parts.push(
            <span
              key={`part-${partIndex++}`}
              style={{
                color: currentColor,
                fontWeight: inBold ? "bold" : "normal",
                fontStyle: inItalic ? "italic" : "normal",
                textDecoration: inUnderline ? "underline" : "none",
                display: "flex",
              }}
            >
              {currentText}
            </span>
          );
          currentText = "";
        }

        // Find the end of the tag
        const tagEnd = htmlContent.indexOf(">", i);
        if (tagEnd === -1) break;

        const tag = htmlContent.substring(i, tagEnd + 1);

        // Handle specific tags
        if (tag.includes('span style="font-weight: bold"') || tag === "<b>") {
          inBold = true;
        } else if (tag === "</b>" || (tag === "</span>" && inBold)) {
          inBold = false;
        } else if (
          tag.includes('span style="font-style: italic"') ||
          tag === "<i>"
        ) {
          inItalic = true;
        } else if (tag === "</i>" || (tag === "</span>" && inItalic)) {
          inItalic = false;
        } else if (
          tag.includes('span style="text-decoration: underline"') ||
          tag === "<u>"
        ) {
          inUnderline = true;
        } else if (tag === "</u>" || (tag === "</span>" && inUnderline)) {
          inUnderline = false;
        } else if (tag.includes('span style="color:')) {
          // Extract color
          const colorMatch = tag.match(/color:\s*([^;"]+)/);
          if (colorMatch?.[1]) {
            currentColor = colorMatch[1];
          }
        } else if (tag === "</span>" && currentColor !== "white") {
          currentColor = "white";
        }

        i = tagEnd + 1;
      } else {
        currentText += htmlContent[i];
        i++;
      }
    }

    // Add any remaining text
    if (currentText) {
      parts.push(
        <span
          key={`part-${partIndex++}`}
          style={{
            color: currentColor,
            fontWeight: inBold ? "bold" : "normal",
            fontStyle: inItalic ? "italic" : "normal",
            textDecoration: inUnderline ? "underline" : "none",
            display: "flex",
          }}
        >
          {currentText}
        </span>
      );
    }

    return parts.length > 0
      ? parts
      : [
          <span key="empty" style={{ display: "flex" }}>
            No description available
          </span>,
        ];
  } catch (error) {
    console.error("Error parsing MOTD:", error);
    return [
      <span key="error" style={{ display: "flex" }}>
        No description available
      </span>,
    ];
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {

    const id = (await params).id;

    // Load fonts
    const [interRegular, interBold] = await loadFonts();

    // Fetch server data
    const response = await fetch(`https://api.minehut.com/server/${id}`);
    const { server }: { server: ServerResponse | undefined } =
      await response.json();

    if (!server) {
      // Return a default banner for server not found
      return new ImageResponse(
        (
          <div
            style={{
              display: "flex",
              fontSize: 60,
              color: "white",
              width: "100%",
              height: "100%",
              padding: "50px 50px",
              textAlign: "center",
              justifyContent: "center",
              alignItems: "center",
              backgroundImage: `url(${new URL("/branding/bg-banner.png", request.url).toString()})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              fontFamily: "Inter",
            }}
          >
            <div style={{ display: "flex" }}>
              <span>Server not found</span>
            </div>
          </div>
        ),
        {
          width: 1200,
          height: 630,
          fonts: [
            {
              name: "Inter",
              data: interRegular,
              style: "normal",
              weight: 400,
            },
          ],
        }
      );
    }

    // Format player count
    const playerCount = server.playerCount || 0;
    const maxPlayers = server.maxPlayers || 0;

    // Format last online date
    const lastOnline = server.last_online
      ? new Date(server.last_online).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "Unknown";

    // Format creation date
    const creationDate = server.creation
      ? new Date(server.creation).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "Unknown";

    // Determine status color
    const statusColor = server.online ? "#4ade80" : "#ef4444";

    // Parse MOTD to JSX with formatting
    const motdElements = parseMotdToJsx(
      server.motd || "No description available"
    );

    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            padding: "50px 50px",
            position: "relative",
            overflow: "hidden",
            fontFamily: "Inter",
            backgroundImage: `url(${new URL("/branding/bg-banner.png", request.url).toString()})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Decorative elements */}
          <div
            style={{
              position: "absolute",
              top: "-100px",
              right: "-100px",
              width: "400px",
              height: "400px",
              borderRadius: "50%",
              background: "rgba(79, 70, 229, 0.1)",
              filter: "blur(40px)",
              display: "flex",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-100px",
              left: "-100px",
              width: "300px",
              height: "300px",
              borderRadius: "50%",
              background: "rgba(236, 72, 153, 0.1)",
              filter: "blur(40px)",
              display: "flex",
            }}
          />

          {/* Header with server name and status */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                background: statusColor,
                marginRight: "15px",
                display: "flex",
              }}
            />
            <h1 style={{ fontSize: 40, fontWeight: "bold", margin: 0 }}>
              {server.name}
            </h1>
          </div>

          {/* MOTD with formatting */}
          <div
            style={{
              fontSize: 32,
              marginBottom: "30px",
              opacity: 0.9,
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "4px",
            }}
          >
            {motdElements}
          </div>

          {/* Stats grid */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "30px",
              marginTop: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                minWidth: "200px",
              }}
            >
              <div style={{ fontSize: 24, opacity: 0.7, display: "flex" }}>
                <span>Players</span>
              </div>
              <div
                style={{ fontSize: 36, fontWeight: "bold", display: "flex" }}
              >
                <span>
                  {playerCount}/{maxPlayers}
                </span>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                minWidth: "200px",
              }}
            >
              <div style={{ fontSize: 24, opacity: 0.7, display: "flex" }}>
                <span>Plan</span>
              </div>
              <div
                style={{
                  fontSize: 36,
                  fontWeight: "bold",
                  display: "flex",
                  textTransform: "capitalize",
                }}
              >
                <span>
                  {server.server_plan.toLocaleLowerCase().split("_")[0] ||
                    "Unknown"}
                </span>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                minWidth: "200px",
              }}
            >
              <div style={{ fontSize: 24, opacity: 0.7, display: "flex" }}>
                <span>Created</span>
              </div>
              <div
                style={{ fontSize: 36, fontWeight: "bold", display: "flex" }}
              >
                <span>{creationDate}</span>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                minWidth: "200px",
              }}
            >
              <div style={{ fontSize: 24, opacity: 0.7, display: "flex" }}>
                <span>Last Online</span>
              </div>
              <div
                style={{ fontSize: 36, fontWeight: "bold", display: "flex" }}
              >
                <span>{lastOnline}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "40px",
              fontSize: 24,
              opacity: 0.7,
            }}
          >
            <div style={{ display: "flex" }}>
              <span>mhsf.app</span>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: "Inter",
            data: interRegular,
            style: "normal",
            weight: 400,
          },
          {
            name: "Inter",
            data: interBold,
            style: "normal",
            weight: 700,
          }
          
        ],
      }
    );
  } catch (error) {
    const [interRegular, interBold] = await loadFonts();
    console.error("Error generating OG image:", error);

    // Try to load the banner image again in case it failed earlier
    let bannerImageData: ArrayBuffer | undefined;
    try {
      bannerImageData = await fetch(
        new URL("/branding/dark-banner.png", request.url)
      ).then((res) => res.arrayBuffer());
    } catch (e) {
      // If banner image fails to load, use a solid color background
      console.error("Failed to load banner image for error page:", e);
    }

    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            fontSize: 60,
            color: "white",
            background: bannerImageData ? undefined : "#121212",
            width: "100%",
            height: "100%",
            padding: "50px 50px",
            textAlign: "center",
            justifyContent: "center",
            alignItems: "center",
            fontFamily: "Inter",
            ...(bannerImageData && {
              backgroundImage: `url(data:image/png;base64,${Buffer.from(bannerImageData).toString("base64")})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }),
          }}
        >
          <div style={{ display: "flex" }}>
            <span>Error generating image</span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: "Inter",
            data: interRegular,
            style: "normal",
            weight: 400,
          },
        ],
      }
    );
  }
}
