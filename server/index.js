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
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// MongoDB Connection
mongoose.connect(config.mongoUri)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => {
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