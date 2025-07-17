import express from 'express';
import { checkAuth, login, logout, signup, updateProfile } from '../controllers/auth.js';
import { protectRoute } from '../middleware/auth.js';
import { upload } from '../middleware/multer.js';

const authRoutes = express.Router();

authRoutes.post('/signup',signup)
authRoutes.post('/login',login)
authRoutes.post('/logout',logout)
authRoutes.put("/update-profile",upload.single("profilePic"),protectRoute, updateProfile)
authRoutes.get("/check-auth",protectRoute, checkAuth)

export default authRoutes;