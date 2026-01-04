import express from 'express';
import cors from 'cors';

import {connectDB} from './database/connect.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN
}));
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.get("/", (req, res) => {
    res.status(200).json({
        message: "RAG Backend is running"
    });
});


// Starting the server

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});