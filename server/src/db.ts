import mongoose from "mongoose"
import config from "./config.js"

// Connect to MongoDB
export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(config.mongoUri)
    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error(
      `Error connecting to MongoDB: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    )
    process.exit(1)
  }
}

export default connectDB
