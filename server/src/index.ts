import express from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import bodyParser from "body-parser"
import config from "./config.js"
import { connectDB } from "./db.js"
import correctionRoutes from "./routes/correctionRoutes.js"

// Connect to MongoDB
connectDB()

// Initialize Express
const app = express()

// Apply middleware
app.use(cors())
app.use(helmet())
app.use(morgan("dev"))
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use("/api", correctionRoutes)

// Health check endpoint
app.get("/", (_req, res) => {
  res.status(200).json({ message: "Arabic Correction API is running" })
})

// Handle 404
app.use((_req, res) => {
  res.status(404).json({ message: "Route not found" })
})

// Start the server
const PORT = config.port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err)
})

export default app
