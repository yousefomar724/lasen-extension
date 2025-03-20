import { NextResponse } from "next/server"
import { validateArabicText } from "@/lib/gemini"

export async function POST(request: Request) {
  try {
    const { text } = await request.json()

    // Validate input
    if (!text) {
      return NextResponse.json(
        { success: false, message: "Text is required" },
        { status: 400 }
      )
    }

    console.log(
      "Validation request received for text:",
      text.substring(0, 50) + (text.length > 50 ? "..." : "")
    )

    // Get validation results from Gemini
    const validationResult = await validateArabicText(text)

    console.log("Validation results:", JSON.stringify(validationResult))

    // Return the validation results with incorrect words
    return NextResponse.json({
      success: true,
      data: validationResult,
    })
  } catch (error) {
    console.error("Error in validation controller:", error)
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
