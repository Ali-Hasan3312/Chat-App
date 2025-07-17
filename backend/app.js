import express from 'express';
import authRoutes from './src/routes/auth.js';
import messageRoutes from "./src/routes/message.js"
import dotenv from 'dotenv'
import { connectDB } from './src/db/database.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { app, server } from './src/lib/socket.js';
dotenv.config();

app.use(express.json())
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(cookieParser())
const port = process.env.PORT || 5000
app.use('/api/auth', authRoutes)
app.use('/api/message', messageRoutes)
server.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
    connectDB();
})