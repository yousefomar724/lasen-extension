import { NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import Correction from "@/lib/models/correction"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get("limit") || "20")
    const page = parseInt(searchParams.get("page") || "1")
    const skip = (page - 1) * limit

    // Connect to the database
    await dbConnect()

    // Get corrections from database
    const corrections = await Correction.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    // Get total count
    const total = await Correction.countDocuments()

    // Return the corrections
    return NextResponse.json({
      success: true,
      count: corrections.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: corrections,
    })
  } catch (error) {
    console.error("Error in get corrections controller:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
