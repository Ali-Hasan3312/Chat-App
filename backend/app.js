import express from 'express';
import authRoutes from './src/routes/auth.js';
import dotenv from 'dotenv'
import { connectDB } from './src/db/database.js';
import cors from 'cors';
dotenv.config();
connectDB();

const app = express();
app.use(cors({
    origin: 'http://localhost:5173',
}));
const port = process.env.PORT
app.use('/api/auth', authRoutes)
app.listen(5000, ()=>{
    console.log(`Server is running on port ${port}`);
})