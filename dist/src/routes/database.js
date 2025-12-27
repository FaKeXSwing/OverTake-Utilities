import mongoose from "mongoose";
export async function setupDatabase() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB connection established.");
    }
    catch (error) {
        console.error("❌ MongoDB connection failed.", error);
        process.exit(1);
    }
}
