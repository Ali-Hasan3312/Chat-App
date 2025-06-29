import express from 'express';
import { getAllMessages } from '../controllers/message.js';

const router = express.Router();

router.get('/messages', getAllMessages);

export default router;