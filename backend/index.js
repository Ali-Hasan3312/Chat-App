import express from 'express';
import authRoutes from './src/routes/auth.js';
import messageRoutes from './src/routes/message.js';
import dotenv from 'dotenv';
import { connectDB } from './src/db/database.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { app, server } from './src/lib/socket.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

// Fix for __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/message', messageRoutes);

// ✅ Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '../frontend/dist');
  app.use(express.static(frontendPath));

  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
  connectDB();
});
