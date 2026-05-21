import express from 'express';
import { getVersions, restoreVersion } from '../controllers/versionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:noteId', protect, getVersions);
router.post('/restore', protect, restoreVersion);

export default router;
