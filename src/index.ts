import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import logger, {stream} from "./utils/logger.js";
import {connectDB} from "./database/connect.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
    cors({
        origin: process.env.CORS_ORIGIN
    })
);
app.use(express.json());

// HTTP request logging
app.use(morgan(":method :url :status :res[content-length] - :response-time ms", {stream}));

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
    logger.info(`Server is running on http://localhost:${PORT}`);
});
