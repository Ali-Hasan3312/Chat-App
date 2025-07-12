import express from 'express';
import { getAllUsersForSidebar, getMessages, sendMessage } from '../controllers/message.js';
import { protectRoute } from '../middleware/auth.js';

const router = express.Router();

router.get('/sidebar-users',protectRoute,getAllUsersForSidebar)
router.get('/:id',protectRoute, getMessages)
router.post('/send/:id', protectRoute, sendMessage)
export default router;