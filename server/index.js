import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';

// Initialize dotenv
dotenv.config();

// Setup __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const config = {
	port: process.env.PORT || 5000,
	mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/lasen',
	geminiApiKey: process.env.GEMINI_API_KEY || '',
};

// Validate required environment variables
if (!config.geminiApiKey) {
	console.error('GEMINI_API_KEY is required');
	process.exit(1);
}

// Initialize the Google Generative AI with API key
const genAI = new GoogleGenerativeAI(config.geminiApiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// MongoDB Connection
mongoose
	.connect(config.mongoUri)
	.then(() => console.log('MongoDB Connected'))
	.catch((err) => {
		console.error('MongoDB connection error:', err);
		process.exit(1);
	});

// Define Mongoose Schema
const correctionSchema = new mongoose.Schema({
	originalText: {
		type: String,
		required: true,
	},
	correctedText: {
		type: String,
		required: true,
	},
	source: {
		type: String,
		enum: ['extension', 'api', 'other'],
		default: 'extension',
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

// Create indexes for better query performance
correctionSchema.index({ originalText: 1 });
correctionSchema.index({ createdAt: -1 });

// Create the model
const Correction = mongoose.model('Correction', correctionSchema);

// Gemini AI text correction function
async function correctArabicText(text) {
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
}

// Gemini AI text validation function
async function validateArabicText(text) {
	try {
		// Skip empty text
		if (!text.trim()) {
			console.log('Skipping validation for empty text');
			return { incorrectWords: [] };
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
    `;

		const result = await model.generateContent(prompt);
		const response = result.response;
		const rawResponse = response.text().trim();

		console.log('Raw validation response:', rawResponse);

		try {
			// Clean up the response if it contains markdown code blocks
			let cleanedResponse = rawResponse;
			if (rawResponse.includes('```')) {
				// Extract the JSON from the code block
				const jsonMatch = rawResponse.match(/```(?:json)?\s*\n([\s\S]*?)\n```/);
				if (jsonMatch && jsonMatch[1]) {
					cleanedResponse = jsonMatch[1].trim();
					console.log('Extracted JSON from code block:', cleanedResponse);
				}
			}

			const jsonResponse = JSON.parse(cleanedResponse);

			// Validate response structure
			if (
				!jsonResponse.incorrectWords ||
				!Array.isArray(jsonResponse.incorrectWords)
			) {
				console.error(
					'Invalid response format: incorrectWords is missing or not an array'
				);
				return { incorrectWords: [] };
			}

			console.log(
				`Found ${jsonResponse.incorrectWords.length} incorrect words before validation`
			);

			// Validate each incorrect word entry
			const validatedIncorrectWords = jsonResponse.incorrectWords.filter(
				(word) => {
					if (!word || typeof word !== 'object') {
						console.warn('Skipping invalid word object:', word);
						return false;
					}
					if (!('word' in word) || typeof word.word !== 'string') {
						console.warn(
							'Skipping word with invalid or missing word property:',
							word
						);
						return false;
					}
					if (!('startIndex' in word) || typeof word.startIndex !== 'number') {
						console.warn(
							'Skipping word with invalid or missing startIndex:',
							word
						);
						return false;
					}
					if (!('endIndex' in word) || typeof word.endIndex !== 'number') {
						console.warn(
							'Skipping word with invalid or missing endIndex:',
							word
						);
						return false;
					}
					return true;
				}
			);

			console.log(
				`Returning ${validatedIncorrectWords.length} validated incorrect words`
			);
			console.log(
				'Final validated incorrectWords:',
				JSON.stringify(validatedIncorrectWords)
			);

			return { incorrectWords: validatedIncorrectWords };
		} catch (error) {
			console.error('Error parsing JSON response from Gemini:', error);
			console.error('Raw response was:', rawResponse);
			return { incorrectWords: [] };
		}
	} catch (error) {
		console.error('Error validating text with Gemini:', error);
		// Return empty result if there's an error
		return { incorrectWords: [] };
	}
}

// Initialize Express
const app = express();

// Apply middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/', (req, res) => {
	res.status(200).json({ message: 'Arabic Correction API is running' });
});

// Correction API endpoint
app.post('/api/correct', async (req, res) => {
	try {
		const { text, source = 'extension' } = req.body;

		// Validate input
		if (!text) {
			res.status(400).json({ success: false, message: 'Text is required' });
			return;
		}

		// Get corrected text from Gemini
		const correctedText = await correctArabicText(text);

		// Only save to database if there was a change
		if (correctedText !== text) {
			// Save to database
			await Correction.create({
				originalText: text,
				correctedText,
				source,
			});
		}

		// Return the corrected text
		res.status(200).json({
			success: true,
			data: {
				originalText: text,
				correctedText,
			},
		});
	} catch (error) {
		console.error('Error in correction controller:', error);
		res.status(500).json({
			success: false,
			message: 'Server error',
			error: error instanceof Error ? error.message : 'Unknown error',
		});
	}
});

// Validation API endpoint
app.post('/api/validate', async (req, res) => {
	try {
		const { text } = req.body;

		// Validate input
		if (!text) {
			res.status(400).json({ success: false, message: 'Text is required' });
			return;
		}

		console.log(
			'Validation request received for text:',
			text.substring(0, 50) + (text.length > 50 ? '...' : '')
		);

		// Get validation results from Gemini
		const validationResult = await validateArabicText(text);

		console.log('Validation results:', JSON.stringify(validationResult));

		// Return the validation results with incorrect words
		res.status(200).json({
			success: true,
			data: validationResult,
		});
	} catch (error) {
		console.error('Error in validation controller:', error);
		res.status(500).json({
			success: false,
			message: 'Server error',
			error: error instanceof Error ? error.message : 'Unknown error',
		});
	}
});

// Get correction history endpoint
app.get('/api/corrections', async (req, res) => {
	try {
		const limit = parseInt(req.query.limit) || 20;
		const page = parseInt(req.query.page) || 1;
		const skip = (page - 1) * limit;

		// Get corrections from database
		const corrections = await Correction.find()
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit);

		// Get total count
		const total = await Correction.countDocuments();

		// Return the corrections
		res.status(200).json({
			success: true,
			count: corrections.length,
			total,
			page,
			pages: Math.ceil(total / limit),
			data: corrections,
		});
	} catch (error) {
		console.error('Error in get corrections controller:', error);
		res.status(500).json({
			success: false,
			message: 'Server error',
			error: error instanceof Error ? error.message : 'Unknown error',
		});
	}
});

// Handle 404
app.use((req, res) => {
	res.status(404).json({ message: 'Route not found' });
});

// Start the server
const PORT = config.port;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
	console.error('Unhandled Rejection:', err);
});
