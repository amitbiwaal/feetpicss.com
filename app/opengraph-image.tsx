import { ImageResponse } from "next/og";

export const alt = "FeetPicss — your free guide to selling feet pics online safely and anonymously";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Default social sharing image for every page that has no cover image of its own.
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          color: "#f6eef9",
          background: "linear-gradient(135deg, #2a1f44 0%, #120c1c 60%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <div
            style={{
              width: 84,
              height: 84,
              borderRadius: 22,
              background: "#ff5c8a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 19,
                border: "11px solid #ffffff",
                display: "flex",
              }}
            />
          </div>
          <div style={{ fontSize: 46, fontWeight: 800, display: "flex" }}>FeetPicss</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2, display: "flex" }}>
            Sell Feet Pics Online — Safely &amp; Anonymously
          </div>
          <div style={{ fontSize: 32, color: "#b4a4c8", display: "flex" }}>
            The free 2026 guide: set your own prices, stay anonymous, get paid fast.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div
            style={{
              display: "flex",
              padding: "14px 30px",
              borderRadius: 999,
              fontSize: 28,
              fontWeight: 800,
              color: "#23110a",
              background: "linear-gradient(120deg, #ff5c8a, #ffb454)",
            }}
          >
            feetpicss.com
          </div>
          <div style={{ fontSize: 26, color: "#b4a4c8", display: "flex" }}>18+ only · No face required</div>
        </div>
      </div>
    ),
    size,
  );
}
