import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl as getS3SignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";
import s3Client from "@/utils/s3Client"; // Ensure this path is correct

export async function POST(request: NextRequest) {
  try {
    const { contentType, fileSize, checksum } = await request.json();

    // --- Input Validation ---
    if (!contentType || !fileSize || !checksum) {
      return NextResponse.json(
        { failure: "Missing required parameters" },
        { status: 400 }
      );
    }
    if (
      typeof contentType !== "string" ||
      typeof checksum !== "string" ||
      typeof fileSize !== "number"
    ) {
      return NextResponse.json(
        { failure: "Invalid parameter types" },
        { status: 400 }
      );
    }
    if (!contentType.startsWith("image/")) {
      return NextResponse.json(
        { failure: "Only image files are allowed" },
        { status: 400 }
      );
    }
    if (fileSize > 5 * 1024 * 1024) {
      // 5MB limit
      return NextResponse.json(
        { failure: "File size exceeds 5MB limit" },
        { status: 400 }
      );
    }
    // --- End Input Validation ---

    // --- S3 Logic ---
    const fileExtension = contentType.split("/")[1];
    const fileName = `${randomUUID()}.${fileExtension}`;
    const bucket = process.env.SUPABASE_S3_BUCKET || "products";

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: fileName,
      ContentType: contentType,
      // Consider adding ChecksumSHA256: checksum if your S3 setup requires/supports it
    });

    const url = await getS3SignedUrl(s3Client, command, { expiresIn: 60 }); // 60 seconds expiry
    // Construct the public URL correctly using the base Supabase URL
    const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${fileName}`;
    // --- End S3 Logic ---

    return NextResponse.json({ success: { url, publicUrl } });
  } catch (error) {
    console.error("Error in /api/upload-image:", error);
    return NextResponse.json(
      { failure: "Failed to generate upload URL" },
      { status: 500 }
    );
  }
}
