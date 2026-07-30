import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "QbitX | AI-Powered Project-Based EdTech Platform";
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
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #090d16 0%, #0f172a 50%, #0369a1 100%)",
          padding: "50px",
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          color: "white",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Glow Effects */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "rgba(14, 165, 233, 0.25)",
            filter: "blur(100px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-100px",
            left: "-100px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "rgba(6, 182, 212, 0.25)",
            filter: "blur(100px)",
          }}
        />

        {/* Card Container */}
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            borderRadius: "28px",
            padding: "45px",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            color: "#0f172a",
          }}
        >
          {/* Left Side: 3D Illustration / Brand Card */}
          <div
            style={{
              width: "42%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
              borderRadius: "22px",
              padding: "30px",
              color: "white",
              textAlign: "center",
              position: "relative",
              boxShadow: "0 10px 25px rgba(2, 132, 199, 0.3)",
              transform: "rotate(-2deg)",
            }}
          >
            <div
              style={{
                fontSize: "14px",
                fontWeight: "800",
                letterSpacing: "1px",
                textTransform: "uppercase",
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                padding: "6px 14px",
                borderRadius: "20px",
                marginBottom: "20px",
              }}
            >
              ✨ Next-Gen EdTech
            </div>
            
            <div
              style={{
                fontSize: "38px",
                fontWeight: "900",
                lineHeight: "1.1",
                marginBottom: "15px",
              }}
            >
              QbitX AI Platform
            </div>

            <div
              style={{
                fontSize: "15px",
                opacity: 0.9,
                fontWeight: "500",
                lineHeight: "1.4",
              }}
            >
              Project-Based Learning & Near-Peer Mentorship
            </div>
          </div>

          {/* Right Side: Title & Metadata Info */}
          <div
            style={{
              width: "54%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              paddingLeft: "10px",
            }}
          >
            {/* Domain Badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "#f1f5f9",
                padding: "6px 14px",
                borderRadius: "16px",
                width: "fit-content",
                fontSize: "14px",
                fontWeight: "700",
                color: "#475569",
                marginBottom: "20px",
              }}
            >
              <span>🌐</span> qbitx.com
            </div>

            {/* Headline */}
            <div
              style={{
                fontSize: "42px",
                fontWeight: "900",
                color: "#0284c7",
                lineHeight: "1.15",
                marginBottom: "10px",
                letterSpacing: "-0.5px",
              }}
            >
              From Potential To Progress.
            </div>

            {/* Tagline / Subtitle */}
            <div
              style={{
                fontSize: "18px",
                fontWeight: "700",
                color: "#1e293b",
                marginBottom: "15px",
              }}
            >
              QbitX | AI-Powered Software Engineering Platform
            </div>

            <div
              style={{
                fontSize: "15px",
                fontWeight: "500",
                color: "#64748b",
                lineHeight: "1.5",
                marginBottom: "25px",
              }}
            >
              Transforming curious students into confident software engineers through guided projects, 24/7 AI tutor, and industry-ready roadmaps.
            </div>

            {/* Call to Action Button */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#0f172a",
                color: "white",
                fontSize: "15px",
                fontWeight: "800",
                padding: "12px 24px",
                borderRadius: "14px",
                width: "fit-content",
                boxShadow: "0 4px 12px rgba(15, 23, 42, 0.2)",
              }}
            >
              Get Started Now →
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
