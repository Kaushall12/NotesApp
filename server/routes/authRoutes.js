import express from 'express';
import { googleAuth, devBypassAuth } from '../controllers/authController.js';

const router = express.Router();

router.post('/google', googleAuth);
router.post('/dev-bypass', devBypassAuth);

export default router;
