import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize the Google Generative AI with API key
const apiKey = process.env.GEMINI_API_KEY || ""

if (!apiKey) {
  throw new Error(
    "Please define the GEMINI_API_KEY environment variable inside .env.local"
  )
}

const genAI = new GoogleGenerativeAI(apiKey)
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

/**
 * Corrects Arabic text using Gemini AI
 */
export async function correctArabicText(text: string): Promise<string> {
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

interface ValidationResult {
  incorrectWords: Array<IncorrectWord>
}

interface IncorrectWord {
  word: string
  startIndex: number
  endIndex: number
}

/**
 * Validates Arabic text using Gemini AI
 */
export async function validateArabicText(
  text: string
): Promise<ValidationResult> {
  try {
    // Skip empty text
    if (!text.trim()) {
      console.log("Skipping validation for empty text")
      return { incorrectWords: [] }
    }

    const prompt = `
    أنت مدقق لغوي للغة العربية. قم بتحليل النص التالي وتحديد الأخطاء النحوية واللغوية والإملائية:
    "${text}"
    
    قم بإرجاع إجابتك على شكل JSON فقط وفق الصيغة التالية:
    {
      "incorrectWords": [
        {
          "word": "الكلمة الخاطئة",
          "startIndex": 0,
          "endIndex": 0
        }
      ]
    }
    
    لا تضف أي تعليقات أو توضيحات. أعد JSON فقط.
    `

    const result = await model.generateContent(prompt)
    const response = result.response
    const rawResponse = response.text().trim()

    console.log("Raw validation response:", rawResponse)

    try {
      // Clean up the response if it contains markdown code blocks
      let cleanedResponse = rawResponse
      if (rawResponse.includes("```")) {
        // Extract the JSON from the code block
        const jsonMatch = rawResponse.match(/```(?:json)?\s*\n([\s\S]*?)\n```/)
        if (jsonMatch && jsonMatch[1]) {
          cleanedResponse = jsonMatch[1].trim()
          console.log("Extracted JSON from code block:", cleanedResponse)
        }
      }

      const jsonResponse = JSON.parse(cleanedResponse)

      // Validate response structure
      if (
        !jsonResponse.incorrectWords ||
        !Array.isArray(jsonResponse.incorrectWords)
      ) {
        console.error(
          "Invalid response format: incorrectWords is missing or not an array"
        )
        return { incorrectWords: [] }
      }

      console.log(
        `Found ${jsonResponse.incorrectWords.length} incorrect words before validation`
      )

      // Validate each incorrect word entry
      const validatedIncorrectWords = jsonResponse.incorrectWords.filter(
        (word: unknown) => {
          if (!word || typeof word !== "object") {
            console.warn("Skipping invalid word object:", word)
            return false
          }
          if (!("word" in word) || typeof word.word !== "string") {
            console.warn(
              "Skipping word with invalid or missing word property:",
              word
            )
            return false
          }
          if (!("startIndex" in word) || typeof word.startIndex !== "number") {
            console.warn(
              "Skipping word with invalid or missing startIndex:",
              word
            )
            return false
          }
          if (!("endIndex" in word) || typeof word.endIndex !== "number") {
            console.warn(
              "Skipping word with invalid or missing endIndex:",
              word
            )
            return false
          }
          return true
        }
      )

      console.log(
        `Returning ${validatedIncorrectWords.length} validated incorrect words`
      )
      console.log(
        "Final validated incorrectWords:",
        JSON.stringify(validatedIncorrectWords)
      )

      return { incorrectWords: validatedIncorrectWords }
    } catch (error) {
      console.error("Error parsing JSON response from Gemini:", error)
      console.error("Raw response was:", rawResponse)
      return { incorrectWords: [] }
    }
  } catch (error) {
    console.error("Error validating text with Gemini:", error)
    // Return empty result if there's an error
    return { incorrectWords: [] }
  }
}

/**
 * Converts Arabic text to a specific dialect using Gemini AI
 */
export async function convertToDialect(
  text: string,
  dialect: string
): Promise<string> {
  try {
    // Skip empty text
    if (!text.trim()) {
      return text
    }

    const dialectName =
      {
        egyptian: "المصرية",
        levantine: "الشامية",
        gulf: "الخليجية",
        moroccan: "المغربية",
      }[dialect.toLowerCase()] || dialect

    const prompt = `
    أنت متخصص في اللهجات العربية. قم بتحويل النص التالي من العربية الفصحى أو أي لهجة عربية أخرى إلى اللهجة ${dialectName}.
    حافظ على المعنى الأصلي للنص قدر الإمكان، لكن استخدم المفردات والتعبيرات والتراكيب النحوية الخاصة باللهجة ${dialectName}.
    
    النص الأصلي:
    "${text}"
    
    أعد النص المحول إلى اللهجة ${dialectName} فقط، بدون أي توضيحات أو تعليقات إضافية.
    `

    const result = await model.generateContent(prompt)
    const response = result.response
    const convertedText = response.text().trim()

    return convertedText
  } catch (error) {
    console.error("Error converting text dialect with Gemini:", error)
    // Return original text if there's an error
    return text
  }
}
