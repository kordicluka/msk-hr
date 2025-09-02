// src/app/api/og/route.ts

import { NextRequest } from "next/server";
import OpenGraphImage from "@/components/atoms/OpenGraphImage"; // Uvezi tvoju komponentu

// Probajmo nodejs runtime umjesto edge zbog pipe response problema
// export const runtime = "edge";

export async function GET(req: NextRequest) {
  console.log("🔍 OG API Route called");

  const { searchParams } = req.nextUrl;

  // Uzimamo parametre iz URL-a (npr. /api/og?title=Moj Naslov)
  const title = searchParams.get("title");
  const locale = searchParams.get("locale") || "hr";
  const showContactInfoParam = searchParams.get("showContactInfo");
  const showContactInfo = showContactInfoParam !== "false";
  const backgroundImage = searchParams.get("backgroundImage");
  const url = searchParams.get("url") || process.env.NEXT_PUBLIC_BASE_URL;

  console.log("📊 Parameters received:", {
    title,
    locale,
    showContactInfoParam,
    showContactInfo,
    backgroundImage,
    url,
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  });

  try {
    console.log("🚀 About to call OpenGraphImage component");

    // Pozivamo tvoju komponentu i prosleđujemo joj parametre
    // Komponenta već vraća 'new ImageResponse', tako da je samo vratimo
    const result = OpenGraphImage({
      title: title || undefined,
      locale,
      showContactInfo,
      backgroundImage: backgroundImage || undefined,
      url: url,
    });

    console.log("✅ OpenGraphImage component executed successfully");
    return result;
  } catch (error) {
    console.error("❌ Error in OG API route:", error);
    console.error(
      "Stack trace:",
      error instanceof Error ? error.stack : "No stack trace"
    );
    throw error;
  }
}
