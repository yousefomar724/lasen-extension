import { GoogleGenerativeAI } from '@google/generative-ai';
import config from '../config.js';

// Initialize the Google Generative AI with our API key
const genAI = new GoogleGenerativeAI(config.geminiApiKey);

// Get the model (using Gemini Flash)
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

/**
 * Validates Arabic text and identifies incorrect words
 * @param text The Arabic text to validate
 * @returns Object with incorrectWords array and their positions
 */
export const validateArabicText = async (
	text: string
): Promise<{
	incorrectWords: Array<{
		word: string;
		startIndex: number;
		endIndex: number;
		suggestions?: string[];
	}>;
}> => {
	try {
		// Skip empty text
		if (!text.trim()) {
			return { incorrectWords: [] };
		}

		const prompt = `
    أنت مدقق لغوي للغة العربية. مهمتك هي تحديد الأخطاء النحوية واللغوية والإملائية في النص العربي دون تصحيحها.

    قم بتحليل النص التالي:
    "${text}"
    
    قم بإرجاع النتيجة بتنسيق JSON فقط بالشكل التالي:
    {
      "incorrectWords": [
        {
          "word": "الكلمة الخاطئة",
          "startIndex": موقع بداية الكلمة في النص الأصلي,
          "endIndex": موقع نهاية الكلمة في النص الأصلي,
          "suggestions": ["التصحيح المقترح 1", "التصحيح المقترح 2"]
        }
      ]
    }
    
    إذا لم تكن هناك أخطاء، أرجع مصفوفة incorrectWords فارغة.
    لا تضف أي نص إضافي أو توضيحات. فقط JSON بالتنسيق المطلوب.
    تأكد أن الإخراج عبارة عن JSON صالح يمكن تحليله بواسطة JSON.parse.
    `;

		// Use the correct method for the Gemini API
		const result = await model.generateContent(prompt);

		const response = result.response;
		const responseText = response.text().trim();

		console.log('Raw Gemini validation response:', responseText);

		try {
			// Try to parse the JSON from the response
			const jsonResponse = JSON.parse(responseText);

			// Ensure the response has the expected structure
			if (!jsonResponse.incorrectWords) {
				console.error('Unexpected response format:', jsonResponse);
				return { incorrectWords: [] };
			}

			if (!Array.isArray(jsonResponse.incorrectWords)) {
				console.error('incorrectWords is not an array:', jsonResponse);
				return { incorrectWords: [] };
			}

			// Validate each incorrect word entry
			const validatedIncorrectWords = jsonResponse.incorrectWords.filter(
				(word: any) => {
					return (
						typeof word.word === 'string' &&
						typeof word.startIndex === 'number' &&
						typeof word.endIndex === 'number' &&
						word.startIndex >= 0 &&
						word.endIndex > word.startIndex &&
						word.endIndex <= text.length
					);
				}
			);

			return { incorrectWords: validatedIncorrectWords };
		} catch (jsonError) {
			console.error('Error parsing validation response as JSON:', jsonError);
			console.error('Raw response was:', responseText);
			return { incorrectWords: [] };
		}
	} catch (error) {
		console.error('Error validating text with Gemini:', error);
		// Return empty result if there's an error
		return { incorrectWords: [] };
	}
};

/**
 * Corrects Arabic text using Gemini AI model
 * @param text The Arabic text to correct
 * @returns Corrected Arabic text
 */
export const correctArabicText = async (text: string): Promise<string> => {
	try {
		// Skip empty text
		if (!text.trim()) {
			return text;
		}

		const prompt = `
    أنت مصحح لغوي للغة العربية. لديك القدرة على تصحيح الأخطاء النحوية واللغوية والإملائية في النص العربي.
    قم بتصحيح النص التالي مع الحفاظ على المعنى الأصلي:
    
    "${text}"
    
    قم بإعادة النص المصحح فقط بدون أي تعليقات أو توضيحات. إذا لم يكن هناك أخطاء، قم بإعادة النص كما هو.
    `;

		const result = await model.generateContent(prompt);
		const response = result.response;
		const correctedText = response.text().trim();

		return correctedText;
	} catch (error) {
		console.error('Error correcting text with Gemini:', error);
		// Return original text if there's an error
		return text;
	}
};

export default {
	correctArabicText,
	validateArabicText,
};
