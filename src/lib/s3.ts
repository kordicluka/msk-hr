// lib/s3.ts
import { S3Client } from "@aws-sdk/client-s3";

// Kreiraj S3 client s potrebnim konfiguracijama
export const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export function getUrl(fileName: string) {
  const AWS_S3_BUCKET_NAME = "msk-hr";
  const AWS_REGION = "eu-north-1";
  return `https://${AWS_S3_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${fileName}`;
}
