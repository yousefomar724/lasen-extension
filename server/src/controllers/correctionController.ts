import { Request, Response } from "express"
import { correctArabicText } from "../services/geminiService.js"
import Correction from "../models/correctionModel.js"

/**
 * Corrects Arabic text and saves the correction to the database
 * @route POST /api/correct
 * @access Public
 */
export const correctText = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { text, source = "extension" } = req.body

    // Validate input
    if (!text) {
      res.status(400).json({ success: false, message: "Text is required" })
      return
    }

    // Get corrected text from Gemini
    const correctedText = await correctArabicText(text)

    // Only save to database if there was a change
    if (correctedText !== text) {
      // Save to database
      await Correction.create({
        originalText: text,
        correctedText,
        source,
      })
    }

    // Return the corrected text
    res.status(200).json({
      success: true,
      data: {
        originalText: text,
        correctedText,
      },
    })
  } catch (error) {
    console.error("Error in correction controller:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}

/**
 * Gets the correction history
 * @route GET /api/corrections
 * @access Public
 */
export const getCorrectionHistory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string) || 20
    const page = parseInt(req.query.page as string) || 1
    const skip = (page - 1) * limit

    // Get corrections from database
    const corrections = await Correction.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    // Get total count
    const total = await Correction.countDocuments()

    // Return the corrections
    res.status(200).json({
      success: true,
      count: corrections.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: corrections,
    })
  } catch (error) {
    console.error("Error in get corrections controller:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}

export default {
  correctText,
  getCorrectionHistory,
}
