import mongoose, { Document, Schema } from "mongoose"

export interface ICorrection extends Document {
  originalText: string
  correctedText: string
  source: "extension" | "api" | "api-dialect" | "other"
  dialect?: string
  createdAt: Date
}

const correctionSchema = new Schema<ICorrection>({
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
    enum: ["extension", "api", "api-dialect", "other"],
    default: "extension",
  },
  dialect: {
    type: String,
    enum: ["egyptian", "levantine", "gulf", "moroccan"],
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Create indexes for better query performance
correctionSchema.index({ originalText: 1 })
correctionSchema.index({ createdAt: -1 })

export default mongoose.models.Correction ||
  mongoose.model<ICorrection>("Correction", correctionSchema)
