"use server";

import { s3Client } from "@/lib/s3";
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";

export async function uploadToS3(formData: FormData) {
  try {
    const file = formData.get("file") as File;

    if (!file) {
      throw new Error("No file provided");
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate a unique file name
    const fileName = `${Date.now()}-${file.name}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
    });

    await s3Client.send(command);

    const fileUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

    return {
      success: true,
      fileUrl,
      fileName,
    };
  } catch (error) {
    console.error("Error uploading file:", error);
    return {
      success: false,
      error: "Failed to upload file",
    };
  }
}

export async function deleteFileFromS3(fileName: string) {
  try {
    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: fileName,
    });

    await s3Client.send(command);

    return {
      success: true,
      message: "File deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting file from S3:", error);
    return {
      success: false,
      error: "Failed to delete file from S3",
    };
  }
}
