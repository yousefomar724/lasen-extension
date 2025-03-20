import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    message: "Arabic Correction API is running",
    status: "healthy",
    timestamp: new Date().toISOString(),
  })
}
