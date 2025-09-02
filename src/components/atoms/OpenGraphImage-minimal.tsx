import { ImageResponse } from "next/og";

export const alt = "MSK Digital Agency";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImageMinimal({
  title,
}: {
  title?: string;
}) {
  console.log("🎨 Minimal OpenGraphImage called with title:", title);

  try {
    console.log("🏗️ About to create minimal ImageResponse");
    
    const imageResponse = new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#ffffff",
            fontSize: "32px",
            fontWeight: "bold",
            color: "#000000",
            fontFamily: "Inter, sans-serif",
          }}
        >
          {title || "MSK Digital Agency"}
        </div>
      ),
      {
        ...size,
      }
    );

    console.log("✅ Minimal ImageResponse created successfully");
    return imageResponse;
  } catch (error) {
    console.error("❌ Error creating minimal ImageResponse:", error);
    throw error;
  }
}