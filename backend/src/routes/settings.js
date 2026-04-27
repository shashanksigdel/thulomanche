import express from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public route to get settings
router.get('/', getSettings);

// Protected route to update settings (admin only)
router.put('/', protect, authorize(['admin']), updateSettings);

export default router;
