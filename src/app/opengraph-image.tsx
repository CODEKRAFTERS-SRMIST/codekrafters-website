import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "CodeKrafters SRM — Premier Student Tech Community";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#070709",
          backgroundImage:
            "radial-gradient(circle at center, rgba(249, 176, 0, 0.22) 0%, rgba(7, 7, 9, 0.95) 75%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
          padding: "60px",
          position: "relative",
        }}
      >
        {/* Yellow top accent border */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "8px",
            background: "#F9B000",
          }}
        />

        {/* Institution Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "10px 24px",
            borderRadius: "9999px",
            backgroundColor: "rgba(249, 176, 0, 0.12)",
            border: "2px solid rgba(249, 176, 0, 0.4)",
            marginBottom: "20px",
          }}
        >
          <span
            style={{
              color: "#F9B000",
              fontSize: "19px",
              fontWeight: 800,
              letterSpacing: "0.15em",
            }}
          >
            SRMIST RAMAPURAM • CHENNAI
          </span>
        </div>

        {/* Big Branded Heading */}
        <div
          style={{
            display: "flex",
            fontSize: "82px",
            fontWeight: 900,
            letterSpacing: "-0.03em",
            marginBottom: "16px",
          }}
        >
          <span style={{ color: "#ffffff" }}>CODE</span>
          <span style={{ color: "#F9B000" }}>KRAFTERS</span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: "28px",
            color: "rgba(255, 255, 255, 0.85)",
            textAlign: "center",
            maxWidth: "880px",
            lineHeight: 1.35,
            marginBottom: "36px",
            fontWeight: 500,
          }}
        >
          Premier Student Tech Community & Developer Collective
        </div>

        {/* Milestone Chips */}
        <div
          style={{
            display: "flex",
            gap: "20px",
          }}
        >
          {[
            "7 DOMAINS",
            "500+ DEVELOPERS",
            "30+ TECH EVENTS",
            "₹5L+ BOUNTIES WON",
          ].map((stat) => (
            <div
              key={stat}
              style={{
                padding: "12px 22px",
                borderRadius: "14px",
                backgroundColor: "#111116",
                border: "2px solid rgba(249, 176, 0, 0.45)",
                color: "#F9B000",
                fontSize: "16px",
                fontWeight: 800,
                letterSpacing: "0.06em",
              }}
            >
              {stat}
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
