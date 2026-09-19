import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { r2, R2_BUCKET_NAME, R2_PUBLIC_URL } from "@/lib/r2";
import { getSession } from "@/lib/session";
import { getIpFromRequest, checkRateLimit } from "@/lib/rate-limit";

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "image/avif",
]);

export async function POST(request: Request) {
  try {
    const ip = getIpFromRequest(request);
    const ipLimit = await checkRateLimit(ip, "authenticated");
    if (!ipLimit.success) {
      return NextResponse.json(
        { error: "Too many requests. Please slow down." },
        { status: 429, headers: { "Retry-After": String(ipLimit.retryAfter || 60) } }
      );
    }

    const session = await getSession();
    if (!session || session.role === "APPLICANT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.role === "DOMAIN_ADMIN") {
      const domainNorm = (session.domain_id || "").toLowerCase().replace(/[^a-z0-9]/g, "");
      const allowedDomains = ["content", "creatives", "prmanagement"];
      if (!allowedDomains.includes(domainNorm)) {
        return NextResponse.json({ error: "Your domain cannot upload event media" }, { status: 403 });
      }
    }

    if (!R2_BUCKET_NAME) {
      console.error("Cloudflare R2 bucket name is not configured in environment variables.");
      return NextResponse.json({ error: "Storage configuration error on server" }, { status: 500 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const rawFolder = (formData.get("folder") as string) || "events";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, WEBP, GIF, SVG, and AVIF are permitted." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: "File size exceeds the 10MB limit." },
        { status: 400 }
      );
    }

    // Sanitize folder and filename
    const sanitizedFolder = rawFolder.replace(/[^a-zA-Z0-9_-]/g, "-").toLowerCase();
    const fileExt = file.name.split(".").pop()?.replace(/[^a-zA-Z0-9]/g, "").toLowerCase() || "jpg";
    const uniqueKey = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
    const objectKey = `event-images/${sanitizedFolder}/${uniqueKey}.${fileExt}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    await r2.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: objectKey,
        Body: buffer,
        ContentType: file.type,
      })
    );

    // Build the public URL
    const publicUrl = R2_PUBLIC_URL 
      ? `${R2_PUBLIC_URL}/${objectKey}`
      : `https://${R2_BUCKET_NAME}.r2.cloudflarestorage.com/${objectKey}`;

    return NextResponse.json({ success: true, url: publicUrl, key: objectKey });
  } catch (error: any) {
    console.error("R2 Upload Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload file to Cloudflare R2" },
      { status: 500 }
    );
  }
}
