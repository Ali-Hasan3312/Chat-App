import express from 'express';
import { getAllUsersForSidebar, getMessages, sendMessage } from '../controllers/message.js';
import { protectRoute } from '../middleware/auth.js';
import { upload } from '../middleware/multer.js';

const router = express.Router();

router.get('/sidebar-users',protectRoute,getAllUsersForSidebar)
router.get('/:id',protectRoute, getMessages)
router.post('/send/:id',upload.single("messageImage"), protectRoute, sendMessage)
export default router;