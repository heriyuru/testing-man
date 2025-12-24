import mongoose from "mongoose";

const MongoURL = process.env.MongoURL;

if (!MongoURL) {
  throw new Error("🚨 MongoURL missing in .env.local");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectionToDatabase = async () => {
  try {
    if (cached.conn) {
      console.log("✅ Using cached connection");
      return cached.conn;
    }

    if (!cached.promise) {
      console.log("🔌 Connecting to MongoDB...");
      const opts = { bufferCommands: false };
      
      cached.promise = mongoose.connect(MongoURL, opts).then((mongoose) => {
        console.log("✅ MongoDB connected!");
        return mongoose;
      });
    }

    cached.conn = await cached.promise;
    return cached.conn;
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    throw err;
  }
};

export default connectionToDatabase;
