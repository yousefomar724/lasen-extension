import { NextResponse } from "next/server"
import { convertToDialect } from "@/lib/gemini"
import dbConnect from "@/lib/db"
import Correction from "@/lib/models/correction"

export async function POST(request: Request) {
  try {
    // Parse the request body
    let body
    try {
      body = await request.json()
    } catch (parseError) {
      console.error("Error parsing request body:", parseError)
      return NextResponse.json(
        {
          error: "Invalid JSON in request body",
          details:
            parseError instanceof Error
              ? parseError.message
              : String(parseError),
        },
        { status: 400 }
      )
    }

    // Validate parameters
    const { text, dialect } = body

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        {
          error: "Text is required and must be a string",
          receivedType: typeof text,
        },
        { status: 400 }
      )
    }

    if (!dialect || typeof dialect !== "string") {
      return NextResponse.json(
        {
          error: "Dialect is required and must be a string",
          receivedType: typeof dialect,
        },
        { status: 400 }
      )
    }

    // Validate dialect value
    const validDialects = ["egyptian", "levantine", "gulf", "moroccan"]
    if (!validDialects.includes(dialect.toLowerCase())) {
      return NextResponse.json(
        {
          error: "Invalid dialect specified",
          validDialects,
          receivedDialect: dialect,
        },
        { status: 400 }
      )
    }

    // Use Gemini to convert the text to the specified dialect
    try {
      const convertedText = await convertToDialect(text, dialect)

      // Connect to the database
      try {
        await dbConnect()

        // Save the dialect conversion to the database
        if (text !== convertedText) {
          try {
            await Correction.create({
              originalText: text,
              correctedText: convertedText,
              source: "api-dialect",
              dialect,
            })
          } catch (dbError) {
            console.error("Error saving to database:", dbError)
            // Continue even if DB save fails
          }
        }
      } catch (dbConnectError) {
        console.error("Database connection error:", dbConnectError)
        // Continue even if DB connection fails
      }

      return NextResponse.json({ convertedText })
    } catch (geminiError) {
      console.error("Gemini API error:", geminiError)
      return NextResponse.json(
        {
          error: "Error converting text with Gemini API",
          details:
            geminiError instanceof Error
              ? geminiError.message
              : String(geminiError),
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("Unexpected error in dialect conversion API:", error)
    return NextResponse.json(
      {
        error: "Error processing the request",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
