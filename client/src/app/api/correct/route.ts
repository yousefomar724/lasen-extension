import { NextResponse } from "next/server"
import { correctArabicText } from "@/lib/gemini"
import dbConnect from "@/lib/db"
import Correction from "@/lib/models/correction"

export async function POST(request: Request) {
  try {
    const { text } = await request.json()

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Text is required" }, { status: 400 })
    }

    // Use Gemini to correct the text
    const correctedText = await correctArabicText(text)

    // Connect to the database
    await dbConnect()

    // Save the correction to the database
    if (text !== correctedText) {
      await Correction.create({
        originalText: text,
        correctedText,
        source: "api",
      })
    }

    return NextResponse.json({ correctedText })
  } catch (error) {
    console.error("Error correcting text:", error)
    return NextResponse.json(
      { error: "Error processing the request" },
      { status: 500 }
    )
  }
}
