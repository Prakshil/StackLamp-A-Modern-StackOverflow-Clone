import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    env: {
      hasEndpoint: !!process.env.NEXT_PUBLIC_APPWRITE_HOST_URL,
      hasProjectId: !!process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
      hasApiKey: !!process.env.NEXT_APPWRITE_API_KEY,
      hasBucketId: !!process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID,
      endpoint: process.env.NEXT_PUBLIC_APPWRITE_HOST_URL?.substring(0, 20) + "...",
      projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID?.substring(0, 8) + "...",
    }
  });
}
