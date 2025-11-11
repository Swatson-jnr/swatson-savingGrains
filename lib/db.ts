import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI || ""

const connectDB = async () => {
  // Check if already connected first (useful for tests)
  const connectionState = mongoose.connection.readyState
  if (connectionState === 1) {
    console.log("MongoDB is already connected.")
    return
  }

  if (connectionState === 2) {
    console.log("MongoDB connection is in progress.")
    return
  }

  // Only check for MONGODB_URI if not connected
  if (!MONGODB_URI) {
    console.error("MONGODB_URI is not defined in environment variables")
    throw new Error("MONGODB_URI is required")
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: "saving-grains-nextjs",
      bufferCommands: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      maxPoolSize: 10, // Maintain up to 10 socket connections
      minPoolSize: 1, // Maintain at least 1 socket connection
    })
    console.log("MongoDB connected successfully.")
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error"
    console.error("MongoDB connection error:", errorMessage)
    throw new Error(`MongoDB connection failed: ${errorMessage}`)
  }
}

export default connectDB

