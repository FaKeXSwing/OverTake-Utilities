import mongoose from "mongoose";

export async function setupDatabase(): Promise<void> {
    try {
        await mongoose.connect(process.env.MONGO_URI as string)
        console.log("✅ MongoDB connection established.")
    } catch (error) {
        console.error("❌ MongoDB connection failed.", error)
        process.exit(1);
    }
}