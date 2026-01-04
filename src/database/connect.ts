import mongoose from "mongoose";
import dotenv from "dotenv";
import logger from "../utils/logger.js";

dotenv.config();

const connectionString = process.env.MONGODB_URI;

if (!connectionString) {
    throw new Error("MONGODB_URI is not defined in environment variables");
}

export async function connectDB() {
    try {
        const res = await mongoose.connect(connectionString!);
        if (res) {
            logger.info("Connected to MongoDB successfully");
        } else {
            logger.warn("Failed to connect to MongoDB");
        }
    } catch (error) {
        logger.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}
