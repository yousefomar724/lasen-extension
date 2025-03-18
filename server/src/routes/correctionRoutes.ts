import express from "express"
import {
  correctText,
  getCorrectionHistory,
} from "../controllers/correctionController.js"

const router = express.Router()

// POST /api/correct
router.post("/correct", correctText)

// GET /api/corrections
router.get("/corrections", getCorrectionHistory)

export default router
