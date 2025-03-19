import express from 'express';
import {
	correctText,
	getCorrectionHistory,
	validateText,
} from '../controllers/correctionController.js';

const router = express.Router();

// POST /api/correct
router.post('/correct', correctText);

// POST /api/validate
router.post('/validate', validateText);

// GET /api/corrections
router.get('/corrections', getCorrectionHistory);

export default router;
