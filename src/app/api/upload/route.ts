import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const files = data.getAll("files") as File[];

    if (!files.length) {
      return NextResponse.json({
        status: 400,
        body: { message: "Niste uploadali datoteku." },
      });
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    const urls: string[] = [];

    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json({
          status: 400,
          body: { message: "Krivi tip datoteke datoteke: " + file.name },
        });
      }
    }

    const uploadDir = path.join(process.cwd(), "uploads");

    // Ensure the upload directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    for (const file of files) {
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = path.join(uploadDir, fileName);
      const buffer = Buffer.from(await file.arrayBuffer());

      await fs.promises.writeFile(filePath, buffer);
      urls.push(`/api/upload/${fileName}`);
    }

    return NextResponse.json({
      status: 200,
      body: { message: "Datoteke uspješno uploadane.", urls },
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({
      status: 500,
      body: { message: "Greška prilikom uploada datoteke." },
    });
  }
}
