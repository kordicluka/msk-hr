import { NextRequest, NextResponse } from "next/server";
import { join } from "path";
import { unlink, readFile, access } from "fs/promises";
import fs from "fs";
import path from "path";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params;

  console.log("Deleting file:", key);

  if (!key) {
    return NextResponse.json({
      status: 400,
      body: { message: "File key is missing." },
    });
  }

  const filePath = join(process.cwd(), "uploads/", key);

  try {
    await unlink(filePath);
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json({
      status: 500,
      body: { message: "Error deleting file." },
    });
  }

  return NextResponse.json({
    status: 200,
    body: { message: "File deleted successfully." },
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params;
  const filename = key;
  const filePath = path.join(process.cwd(), "uploads", filename);

  console.log("Attempting to serve file:", filename);

  try {
    // Check if the file exists before attempting to read it
    await access(filePath, fs.constants.R_OK);
  } catch (error) {
    console.error("File not found or not accessible:", filename);
    console.error("Error accessing file: " + error);
    return NextResponse.json(
      { error: "File not found or not accessible" },
      { status: 404 }
    );
  }

  try {
    const fileBuffer = await readFile(filePath);
    const fileType = getFileType(filename);

    console.log("Serving file:", filename);

    return new NextResponse(new Uint8Array(fileBuffer), {
      headers: {
        "Content-Type": fileType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error reading file:", filename, error);
    return NextResponse.json({ error: "Error reading file" }, { status: 500 });
  }
}

function getFileType(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  switch (ext) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".gif":
      return "image/gif";
    case ".webp":
      return "image/webp";
    default:
      return "application/octet-stream";
  }
}
