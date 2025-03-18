import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url"

// Initialize dotenv
dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, "..")

// Configuration object
const config = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/lasen",
  geminiApiKey: process.env.GEMINI_API_KEY || "",
}

// Validate required environment variables
if (!config.geminiApiKey) {
  console.error("GEMINI_API_KEY is required")
  process.exit(1)
}

export default config
