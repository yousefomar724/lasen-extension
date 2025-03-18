import { GoogleGenerativeAI } from "@google/generative-ai"
import config from "../config.js"

// Initialize the Google Generative AI with our API key
const genAI = new GoogleGenerativeAI(config.geminiApiKey)

// Get the model (using Gemini Flash)
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

/**
 * Corrects Arabic text using Gemini AI model
 * @param text The Arabic text to correct
 * @returns Corrected Arabic text
 */
export const correctArabicText = async (text: string): Promise<string> => {
  try {
    // Skip empty text
    if (!text.trim()) {
      return text
    }

    const prompt = `
    أنت مصحح لغوي للغة العربية. لديك القدرة على تصحيح الأخطاء النحوية واللغوية والإملائية في النص العربي.
    قم بتصحيح النص التالي مع الحفاظ على المعنى الأصلي:
    
    "${text}"
    
    قم بإعادة النص المصحح فقط بدون أي تعليقات أو توضيحات. إذا لم يكن هناك أخطاء، قم بإعادة النص كما هو.
    `

    const result = await model.generateContent(prompt)
    const response = result.response
    const correctedText = response.text().trim()

    return correctedText
  } catch (error) {
    console.error("Error correcting text with Gemini:", error)
    // Return original text if there's an error
    return text
  }
}

export default {
  correctArabicText,
}
