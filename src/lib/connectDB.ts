// lib/mongodb.js
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

/**
 * Cached connection for MongoDB.
 */
declare global {
  // eslint-disable-next-line no-var
  var mongoose:
    | { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null }
    | undefined;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
  }
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI!).then(() => {
      return cached;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
