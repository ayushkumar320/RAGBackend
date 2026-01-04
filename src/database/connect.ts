import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.MONGODB_URI;

if (!connectionString) {
    throw new Error("MONGODB_URI is not defined in environment variables");
}

export async function connectDB() {
    try {
        const res = await mongoose.connect(connectionString!);
        if (res) {
            console.log("Connected to MongoDB successfully");
        } else {
            console.log("Failed to connect to MongoDB");
        }
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}
