import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";
import { MongoClient } from "mongodb";
import fs from "node:fs";
import path from "node:path";

// Helper function to format dates
function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

// Helper function to format times
function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Load fonts directly from the filesystem
async function loadLocalFonts() {
  const fontPath = path.join(process.cwd(), "src", "app", "api", "og", "fonts");

  return [
    fs.readFileSync(path.join(fontPath, "Inter-Regular.ttf")),
    fs.readFileSync(path.join(fontPath, "Inter-Bold.ttf")),
  ];
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Load banner image from filesystem
    const bannerPath = path.join(
      process.cwd(),
      "public",
      "branding",
      "bg-banner.png"
    );
    const bannerImageData = fs.readFileSync(bannerPath);

    const id = (await params).id;

    // Load fonts
    const [interRegular, interBold] = await loadLocalFonts();

    // Verify server exists
    const serverResponse = await fetch(`https://api.minehut.com/server/${id}`);
    const serverData = await serverResponse.json();

    if (!serverData.server) {
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
              backgroundImage: `url(data:image/png;base64,${bannerImageData.toString("base64")})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              fontFamily: "Inter",
            }}
          >
            <div style={{ display: "flex" }}>
              <span style={{ display: "flex" }}>Server not found</span>
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

    const serverName = serverData.server.name;

    // Connect to MongoDB
    const mongo = new MongoClient(process.env.MONGO_DB as string);
    await mongo.connect();
    const db = mongo.db("mhsf");

    // Get player data (last 60 entries)
    const historyCollection = db.collection("history");
    const playerData = await historyCollection
      .find({ server: serverName })
      .sort({ date: -1 })
      .limit(80)
      .project({ player_count: 1, date: 1, _id: 0 })
      .toArray();

    // Close MongoDB connection
    await mongo.close();

    // Reverse the data to show oldest to newest
    const playerHistory = playerData.reverse();

    // Calculate max player count for scaling
    const maxPlayerCount = Math.max(
      ...playerHistory.map((item: any) => item.player_count || 0),
      1 // Ensure we have at least 1 as max to avoid division by zero
    );

    // Calculate average player count
    const averagePlayerCount = Math.round(
      playerHistory.reduce(
        (sum: number, item: any) => sum + (item.player_count || 0),
        0
      ) / Math.max(playerHistory.length, 1)
    );

    // Get current player count
    const currentPlayerCount =
      playerHistory.length > 0
        ? playerHistory[playerHistory.length - 1].player_count || 0
        : 0;

    const bars = [];
    const numBars = Math.min(playerHistory.length, 30); // Limit to 30 bars for better visibility
    const step = Math.max(1, Math.floor(playerHistory.length / numBars));

    // Create Y-axis markers (player count) - Modified to avoid drawing horizontal lines that intersect with Y-axis
    const yAxisMarkers = [];
    const numYMarkers = 4; // Reduced to 4 for better alignment

    for (let i = 0; i <= numYMarkers; i++) {
      const value = Math.round((maxPlayerCount * i) / numYMarkers);
      const position = 200 - (i / numYMarkers) * 200;

      yAxisMarkers.push(
        <div
          key={`y-marker-${i}`}
          style={{
            display: "flex",
            position: "absolute",
            left: "50px",
            top: `${position}px`,
            width: "1100px",
            borderTop: i > 0 ? "1px dashed rgba(255, 255, 255, 0.2)" : "none",
          }}
        >
          <div
            style={{
              display: "flex",
              position: "absolute",
              left: "-40px",
              top: "-10px",
              fontSize: "12px",
              color: "rgba(255, 255, 255, 0.7)",
            }}
          >
            {value}
          </div>
        </div>
      );
    }

    const chartWidth = 970; // Fixed width of the chart area
    // Create X-axis markers (times)
    const xAxisMarkers = [];
    const numXMarkers = Math.min(10, playerHistory.length); // Increased to 10 for more labels

    if (playerHistory.length > 0) {
      for (let i = 0; i < numXMarkers; i++) {
        const index = Math.floor(
          (i / (numXMarkers - 1)) * (playerHistory.length - 1)
        );
        const item = playerHistory[index];
        const position = (index / (playerHistory.length - 1)) * chartWidth;

        xAxisMarkers.push(
          <div
            key={`x-marker-${i}`}
            style={{
              display: "flex",
              position: "absolute",
              left: `${position + 50}px`, // Add 50px offset for Y-axis
              bottom: "-25px",
              transform: "translateX(-50%)",
              fontSize: "12px",
              color: "rgba(255, 255, 255, 0.7)",
              whiteSpace: "nowrap",
            }}
          >
            {formatTime(new Date(item.date))}
          </div>
        );
      }
    }

    for (let i = 0; i < playerHistory.length; i += step) {
      const item = playerHistory[i];
      const height = Math.max(
        5,
        ((item.player_count || 0) / maxPlayerCount) * 200
      );
      const position = (i / (playerHistory.length - 1)) * chartWidth;

      bars.push(
        <div
          key={`bar-${i}`}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            width: "16px",
            height: "209px",
            position: "absolute",
            left: `${position}px`, // Add 50px offset for Y-axis
            transform: "translateX(-50%)",
          }}
        >
          <div
            style={{
              display: "flex",
              width: "100%",
              height: `${height}px`,
              backgroundColor: "#4ade80",
              borderRadius: "2px 2px 0 0",
            }}
          />
        </div>
      );
    }

    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            padding: "50px",
            position: "relative",
            overflow: "hidden",
            fontFamily: "Inter",
            backgroundImage: `url(data:image/png;base64,${bannerImageData.toString("base64")})`,
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

          {/* Header with server name */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <h1
              style={{
                fontSize: 40,
                fontWeight: "bold",
                margin: 0,
                display: "flex",
              }}
            >
              <span style={{ display: "flex" }}>
                {serverName} - Player Statistics
              </span>
            </h1>
          </div>

          {/* Stats summary */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div style={{ fontSize: 20, opacity: 0.7, display: "flex" }}>
                <span style={{ display: "flex" }}>Max Players</span>
              </div>
              <div
                style={{ fontSize: 36, fontWeight: "bold", display: "flex" }}
              >
                <span style={{ display: "flex" }}>{maxPlayerCount}</span>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div style={{ fontSize: 20, opacity: 0.7, display: "flex" }}>
                <span style={{ display: "flex" }}>Average Players</span>
              </div>
              <div
                style={{ fontSize: 36, fontWeight: "bold", display: "flex" }}
              >
                <span style={{ display: "flex" }}>{averagePlayerCount}</span>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div style={{ fontSize: 20, opacity: 0.7, display: "flex" }}>
                <span style={{ display: "flex" }}>Current Players</span>
              </div>
              <div
                style={{ fontSize: 36, fontWeight: "bold", display: "flex" }}
              >
                <span style={{ display: "flex" }}>{currentPlayerCount}</span>
              </div>
            </div>
          </div>

          {/* Bar chart container */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-end",
              marginTop: "10px",
              height: "270px",
              width: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.2)",
              borderRadius: "8px",
              padding: "20px 40px 20px 40px", // Added padding for Y-axis labels
              position: "relative", // For absolute positioning of markers
              backdropFilter: "blur(12px)",
            }}
          >
            {/* Chart content container */}
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "220px",
                paddingBottom: "10px",
                display: "flex",
              }}
            >
              {/* Y-axis and X-axis are now drawn as a single element to ensure continuity */}
              <svg
                width="100%"
                height="100%"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  pointerEvents: "none",
                  zIndex: "20",
                }}
              >
                {/* Y-axis line */}
                <line
                  x1="50" // Changed from 30 to match new spacing
                  y1="0"
                  x2="50" // Changed from 30 to match new spacing
                  y2="200"
                  stroke="white"
                  strokeWidth="2"
                  strokeOpacity="0.8"
                />
                {/* X-axis line */}
                <line
                  x1="50"
                  y1="200"
                  x2="1150"
                  y2="200"
                  stroke="white"
                  strokeWidth="2"
                  strokeOpacity="0.8"
                />
                {/* Y-axis tick marks */}
                {Array.from({ length: numYMarkers + 1 }).map((_, i) => {
                  const yPosition = 200 - (i / numYMarkers) * 200;
                  return (
                    <line
                      key={`y-tick-${i}`}
                      x1="45" // Changed from 25 to match new spacing
                      y1={yPosition}
                      x2="50" // Changed from 30 to match new spacing
                      y2={yPosition}
                      stroke="white"
                      strokeWidth="2"
                      strokeOpacity="0.8"
                    />
                  );
                })}
              </svg>

              {/* Y-axis markers (labels and grid lines) */}
              <div style={{ display: "flex" }}>{yAxisMarkers}</div>

              {/* X-axis markers */}
              <div style={{ display: "flex" }}>{xAxisMarkers}</div>

              {/* Bars */}
              <div
                style={{
                  display: "flex",
                  position: "relative",
                  width: "1100px",
                  height: "220px",
                  marginLeft: "50px",
                }}
              >
                {bars}
              </div>
            </div>
          </div>

          {/* Chart legend */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "10px",
              marginBottom: "30px",
              fontSize: "14px",
            }}
          >
            <div style={{ display: "flex" }}>
              <span style={{ display: "flex" }}>
                Oldest Entry:{" "}
                {playerHistory.length > 0
                  ? formatDate(new Date(playerHistory[0].date))
                  : "N/A"}
              </span>
            </div>
            <div style={{ display: "flex" }}>
              <span style={{ display: "flex" }}>
                Latest Entry:{" "}
                {playerHistory.length > 0
                  ? formatDate(
                      new Date(playerHistory[playerHistory.length - 1].date)
                    )
                  : "N/A"}
              </span>
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 18,
              marginTop: "30px",
              opacity: 0.7,
            }}
          >
            <div style={{ display: "flex" }}>
              <span style={{ display: "flex" }}>✨ Powered by mhsf.app</span>
            </div>
            <br />
            <small
              style={{
                fontSize: 12,
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <span style={{ display: "flex" }}>
                Licensed under MIT license using open source technologies.
              </span>
              <span style={{ display: "flex", textAlign: "center" }}>
                Using dynamic statistical data version 1.
              </span>
              <span style={{ display: "flex", textAlign: "center" }}>
                Not officially affiliated with Minehut, GamerSafer or Super
                League Enterprise.
              </span>
            </small>
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
          },
        ],
      }
    );
  } catch (error) {
    console.error("Error generating player statistics image:", error);

    // Load fonts for error page
    let interRegular: Buffer | null = null;
    try {
      interRegular = (await loadLocalFonts())[0];
    } catch (e) {
      // If we can't load fonts, we'll just use a system font
      console.error("Failed to load fonts for error page:", e);
    }

    // Try to load the banner image
    let bannerImageData: Buffer | null = null;
    try {
      const bannerPath = path.join(
        process.cwd(),
        "public",
        "branding",
        "dark-banner.png"
      );
      bannerImageData = fs.readFileSync(bannerPath);
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
              backgroundImage: `url(data:image/png;base64,${bannerImageData.toString("base64")})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }),
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <span style={{ display: "flex" }}>
              Error generating player statistics image
            </span>
            <span style={{ fontSize: 24, display: "flex" }}>
              {String(error).substring(0, 100)}
            </span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: interRegular
          ? [
              {
                name: "Inter",
                data: interRegular,
                style: "normal",
                weight: 400,
              },
            ]
          : undefined,
      }
    );
  }
}
