import mongoose from "mongoose"

// Define the correction schema
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
    enum: ["extension", "api", "other"],
    default: "extension",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Create indexes for better query performance
correctionSchema.index({ originalText: 1 })
correctionSchema.index({ createdAt: -1 })

// Create the model
const Correction = mongoose.model("Correction", correctionSchema)

export default Correction
