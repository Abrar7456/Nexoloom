import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Initialize Cloudinary if credentials are set
const isCloudinaryConfigured = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export async function POST(req: NextRequest) {
  try {
    const { publicId } = await req.json();

    if (!publicId) {
      return NextResponse.json({ error: "Missing publicId" }, { status: 400 });
    }

    if (!isCloudinaryConfigured) {
      console.log(`[Cloudinary Fallback] Simulating delete of asset: ${publicId}`);
      return NextResponse.json({ success: true, message: "Asset deletion simulated successfully." });
    }

    const result = await cloudinary.uploader.destroy(publicId);
    if (result.result === "ok" || result.result === "not_found") {
      return NextResponse.json({ success: true, result });
    } else {
      return NextResponse.json({ error: "Cloudinary deletion failed", details: result }, { status: 500 });
    }
  } catch (error: any) {
    console.error("Cloudinary delete error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
