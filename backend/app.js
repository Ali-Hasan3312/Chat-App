import express from 'express';
import authRoutes from './src/routes/auth.js';
import messageRoutes from "./src/routes/message.js"
import dotenv from 'dotenv'
import { connectDB } from './src/db/database.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
dotenv.config();
connectDB();

const app = express();
app.use(express.json())
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(cookieParser())
const port = process.env.PORT
app.use('/api/auth', authRoutes)
app.use('/api/message', messageRoutes)
app.listen(5000, ()=>{
    console.log(`Server is running on port ${port}`);
})